/* eslint-disable @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-explicit-any */
import JSONModel from "sap/ui/model/json/JSONModel";
import Log from "sap/base/Log";

// Pull sinon from the UI5 third-party shim. The shim has no TS typings;
// we treat the imported value as a structural any so the mock implementation
// stays close to the original JavaScript.
// eslint-disable-next-line @typescript-eslint/no-require-imports
declare const sap: any;

interface MockUser {
	UserName: string;
	FirstName?: string;
	LastName?: string;
	Age?: number;
	Friends?: string[];
	BestFriend?: string;
	[key: string]: unknown;
}

interface MockXhr {
	method: string;
	url: string;
	requestBody?: string;
	respond?: (status: number, headers: Record<string, string>, body: string | null) => void;
}

type MockResponse = [number, Record<string, string>, string | null] | [number, Record<string, string>];

// sinon is provided by the "sap/ui/thirdparty/sinon" module — see the require below
let sinon: any;
let sandbox: any;
let users: MockUser[]; // The array that holds the cached user data
let metadata: string; // The string that holds the cached mock service metadata
const namespace = "ui5/tutorial/odatav4";
// Component for writing logs into the console
const logComponent = "ui5.tutorial.odatav4.mockserver";
const rBaseUrl = /services.odata.org\/TripPinRESTierService/;

/**
 * Returns the base URL from a given URL.
 * @param url - the complete URL
 * @returns the base URL
 */
function getBaseUrl(url: string): string {
	const matches = url.match(/http.+\(S\(.+\)\)\//);

	if (!Array.isArray(matches) || matches.length < 1) {
		throw new Error("Could not find a base URL in " + url);
	}

	return matches[0];
}

/**
 * Looks for a user with a given user name and returns its index in the user array.
 * @param userName - the user name to look for.
 * @returns index of that user in the array, or -1 if the user was not found.
 */
function findUserIndex(userName: string): number {
	for (let i = 0; i < users.length; i++) {
		if (users[i].UserName === userName) {
			return i;
		}
	}
	return -1;
}

/**
 * Retrieves any user data from a given http request body.
 * @param body - the http request body.
 * @returns the parsed user data.
 */
function getUserDataFromRequestBody(body: string): MockUser {
	const matches = body.match(/({.+})/);

	if (!Array.isArray(matches) || matches.length !== 2) {
		throw new Error("Could not find any user data in " + body);
	}
	return JSON.parse(matches[1]) as MockUser;
}

/**
 * Retrieves a user name from a given request URL.
 * @param url - the request URL.
 * @returns the user name or undefined if no user was found.
 */
function getUserKeyFromUrl(url: string): string | undefined {
	const matches = url.match(/People\('(.*)'\)/);
	return matches ? matches[1] : undefined;
}

/**
 * Checks if a given UserName is unique or already used
 * @param userName - the UserName to be checked
 * @returns True if the UserName is unique (not used), false otherwise
 */
function isUnique(userName: string): boolean {
	return findUserIndex(userName) < 0;
}

/**
 * Returns a proper HTTP response body for "duplicate key" errors
 * @param key - the duplicate key
 * @returns the proper response body
 */
function duplicateKeyError(key: string): string {
	return JSON.stringify({
		error: {
			code: "409",
			message: "There is already a user with user name '" + key + "'.",
			target: "UserName"
		}
	});
}

function invalidKeyError(key: string): string {
	return JSON.stringify({
		error: {
			code: "404",
			message: "There is no user with user name '" + key + "'.",
			target: "UserName"
		}
	});
}

function getSuccessResponse(responseBody: string): MockResponse {
	return [
		200,
		{
			"Content-Type": "application/json; odata.metadata=minimal",
			"OData-Version": "4.0"
		},
		responseBody
	];
}

/**
 * Reads and caches the fake service metadata and data from their
 * respective files.
 * @returns a promise that is resolved when the data is loaded
 */
function readData(): Promise<unknown[]> {
	const metadataPromise = new Promise<void>((resolve, reject) => {
		const resourcePath = sap.ui.require.toUrl(namespace + "/localService/metadata.xml");
		const request = new XMLHttpRequest();

		request.onload = function () {
			// 404 is not an error for XMLHttpRequest so we need to handle it here
			if (request.status === 404) {
				const error = "resource " + resourcePath + " not found";

				Log.error(error, logComponent);
				reject(new Error(error));
			}
			metadata = this.responseText;
			resolve();
		};
		request.onerror = function () {
			const error = "error loading resource '" + resourcePath + "'";

			Log.error(error, logComponent);
			reject(new Error(error));
		};
		request.open("GET", resourcePath);
		request.send();
	});

	const mockDataPromise = new Promise<void>((resolve, reject) => {
		const resourcePath = sap.ui.require.toUrl(namespace + "/localService/mockdata/people.json");
		const mockDataModel = new JSONModel(resourcePath);

		mockDataModel.attachRequestCompleted(function (this: JSONModel, event: any) {
			// 404 is not an error for JSONModel so we need to handle it here
			if (event.getParameter("errorobject")
				&& event.getParameter("errorobject").statusCode === 404) {
				const error = "resource '" + resourcePath + "' not found";

				Log.error(error, logComponent);
				reject(new Error(error));
			}
			users = (this.getData() as { value: MockUser[] }).value;
			resolve();
		});

		mockDataModel.attachRequestFailed(() => {
			const error = "error loading resource '" + resourcePath + "'";

			Log.error(error, logComponent);
			reject(new Error(error));
		});
	});

	return Promise.all([metadataPromise, mockDataPromise]);
}

/**
 * Reduces a given result set by applying the OData URL parameters 'skip' and 'top' to it.
 * Does NOT change the given result set but returns a new array.
 */
function applySkipTop(xhr: MockXhr, resultSet: MockUser[]): MockUser[] {
	const reducedUsers = [...resultSet];
	const matches = xhr.url.match(/\$skip=(\d+)&\$top=(\d+)/);

	if (Array.isArray(matches) && matches.length >= 3) {
		const skip = parseInt(matches[1], 10);
		const top = parseInt(matches[2], 10);
		return resultSet.slice(skip, skip + top);
	}

	return reducedUsers;
}

/**
 * Sorts a given result set by applying the OData URL parameter 'orderby'.
 * Does NOT change the given result set but returns a new array.
 */
function applySort(xhr: MockXhr, resultSet: MockUser[]): MockUser[] {
	const sortedUsers = [...resultSet]; // work with a copy
	const matches = xhr.url.match(/\$orderby=(\w*)(?:%20(\w*))?/);

	if (!Array.isArray(matches) || matches.length < 2) {
		return sortedUsers;
	}
	const fieldName = matches[1];
	const direction = matches[2] || "asc";

	if (fieldName !== "LastName") {
		throw new Error("Filters on field " + fieldName + " are not supported.");
	}

	sortedUsers.sort((a, b) => {
		const nameA = (a.LastName || "").toUpperCase();
		const nameB = (b.LastName || "").toUpperCase();
		const asc = direction === "asc";

		if (nameA < nameB) {
			return asc ? -1 : 1;
		}
		if (nameA > nameB) {
			return asc ? 1 : -1;
		}
		return 0;
	});

	return sortedUsers;
}

/**
 * Filters a given result set by applying the OData URL parameter 'filter'.
 * Does NOT change the given result set but returns a new array.
 */
function applyFilter(xhr: MockXhr, resultSet: MockUser[]): MockUser[] {
	let filteredUsers = [...resultSet]; // work with a copy
	const matches = xhr.url.match(/\$filter=.*\((.*),'(.*)'\)/);

	// If the request contains a filter command, apply the filter
	if (Array.isArray(matches) && matches.length >= 3) {
		const fieldName = matches[1];
		const query = matches[2];

		if (fieldName !== "LastName") {
			throw new Error("Filters on field " + fieldName + " are not supported.");
		}

		filteredUsers = users.filter((user) => (user.LastName || "").indexOf(query) !== -1);
	}

	return filteredUsers;
}

/**
 * Handles GET requests for metadata.
 */
function handleGetMetadataRequests(): MockResponse {
	return [
		200,
		{
			"Content-Type": "application/xml",
			"odata-version": "4.0"
		}, metadata
	];
}

/**
 * Handles GET requests for a pure user count and returns a fitting response.
 */
function handleGetCountRequests(): MockResponse {
	return getSuccessResponse(users.length.toString());
}

/**
 * Handles GET requests for user data and returns a fitting response.
 */
function handleGetUserRequests(xhr: MockXhr, _bCount: boolean): MockResponse {
	let count: number;
	let expand: RegExpMatchArray | string[] | null;
	let expand2: string;
	let index: number;
	let key: string | undefined;
	let response: { "@odata.count"?: number; value: MockUser[] } | MockUser | null;
	let responseBody: string;
	let result: MockUser[];
	let select: RegExpMatchArray | string[] | null;
	let select2: string;
	let subSelects: string[][] = [];
	let i: number;

	// Get expand parameter
	expand = xhr.url.match(/\$expand=([^&]+)/);

	// Sort out expand parameter values + subSelects in brackets
	if (expand) {
		expand2 = expand[0];
		expand2 = expand2.substring(8);

		// Sort out subselects (e.g. BestFriend($select=Age,UserName),Friend)
		const subSelectMatches = expand2.match(/\([^)]*\)/g) || [];
		subSelects = subSelectMatches.map((s) => s.replace(/\(\$select=/, "").replace(/\)/, "").split(","));
		expand2 = expand2.replace(/\([^)]*\)/g, "");
		expand = expand2.split(",");
	}

	// Get select parameter
	select = xhr.url.match(/[^(]\$select=([\w|,]+)/);

	// Sort out select parameter values
	if (Array.isArray(select)) {
		select2 = select[0];
		select2 = select2.replace(/&/, "").replace(/\?/, "").substring(8);
		select = select2.split(",");
	}

	// Check if an individual user or a user range is requested
	key = getUserKeyFromUrl(xhr.url);
	if (key) {
		index = findUserIndex(key);

		if (/People\(.+\)\/Friends/.test(xhr.url)) {
			// ownRequest for friends
			response = { value: createFriendsArray(users[index].Friends, select as string[]) };
		} else {
			// specific user was requested
			response = getUserObject(index, select as string[], expand as string[], subSelects);
		}

		if (index > -1) {
			responseBody = JSON.stringify(response);
			return getSuccessResponse(responseBody);
		}
		responseBody = invalidKeyError(key);
		return [
			400,
			{
				"Content-Type": "application/json; charset=utf-8"
			},
			responseBody
		];
	}
	// all users requested
	result = applyFilter(xhr, users);
	count = result.length; // the total no. of people found, after filtering
	result = applySort(xhr, result);
	result = applySkipTop(xhr, result);

	// generate sResponse
	const finalResponse: { "@odata.count": number; value: MockUser[] } = { "@odata.count": count, value: [] };

	result.forEach((user) => {
		const userIndex = findUserIndex(user.UserName);

		finalResponse.value.push(getUserObject(userIndex, select as string[], expand as string[], subSelects) as MockUser);
	});

	responseBody = JSON.stringify(finalResponse);

	return getSuccessResponse(responseBody);
}

/**
 * Returns a specific user in the aUsers array.
 */
function getUserByIndex(index: number, properties: string[]): MockUser | null {
	const helper: MockUser = { UserName: "" };
	const user = users[index];

	if (user) {
		properties.forEach((selectProperty) => {
			helper[selectProperty] = user[selectProperty];
		});

		return helper;
	}
	return null;
}

/**
 * Returns the user with iIndex in the aUsers array with all its information
 */
function getUserObject(index: number, select: string[], expand: string[] | null | undefined, subSelects: string[][]): MockUser | null {
	let bestFriend: string | undefined;
	let friendIndex: number;
	let friends: string[] | undefined;
	let object: MockUser | null;
	let user: MockUser;
	let i: number;

	object = getUserByIndex(index, select);
	if (expand && object) {
		user = users[index];
		for (i = 0; i < expand.length; i++) {
			switch (expand[i]) {
				case "Friends":
					friends = user.Friends;
					object.Friends = createFriendsArray(friends, subSelects[i]) as unknown as string[];
					break;
				case "BestFriend":
					bestFriend = user.BestFriend;
					friendIndex = findUserIndex(bestFriend || "");
					object.BestFriend = getUserByIndex(friendIndex, subSelects[i]) as unknown as string;
					break;
				default:
					break;
			}
		}
	}
	return object;
}

/**
 * creates array of friends for a given user
 */
function createFriendsArray(friends: string[] | undefined, subSelects: string[]): MockUser[] {
	let array: (MockUser | null)[] = [];

	if (friends) {
		friends.forEach((friend) => {
			const friendIndex = findUserIndex(friend);
			array.push(getUserByIndex(friendIndex, subSelects));
		});

		array = array.filter((element) => element !== null);
	}

	return array as MockUser[];
}

/**
 * Handles PATCH requests for users and returns a fitting response.
 */
function handlePatchUserRequests(xhr: MockXhr): MockResponse {
	// Get the key of the person to change
	const key = getUserKeyFromUrl(xhr.url);

	// Get the list of changes
	const changes = getUserDataFromRequestBody(xhr.requestBody || "");

	// Check if the UserName is changed to a duplicate.
	// If the UserName is "changed" to its current value, that is not an error.
	if (Object.prototype.hasOwnProperty.call(changes, "UserName")
		&& changes.UserName !== key
		&& !isUnique(changes.UserName)) {
		// Error
		const responseBody = duplicateKeyError(changes.UserName);
		return [
			400,
			{
				"Content-Type": "application/json; charset=utf-8"
			},
			responseBody
		];
	}
	// No error: make the change(s)
	const user = users[findUserIndex(key || "")];
	for (const fieldName in changes) {
		if (Object.prototype.hasOwnProperty.call(changes, fieldName)) {
			user[fieldName] = changes[fieldName];
		}
	}

	// The response to PATCH requests is always http 204 (No Content)
	return [
		204,
		{
			"OData-Version": "4.0"
		},
		null
	];
}

/**
 * Handles DELETE requests for users and returns a fitting response.
 */
function handleDeleteUserRequests(xhr: MockXhr): MockResponse {
	const key = getUserKeyFromUrl(xhr.url);
	users.splice(findUserIndex(key || ""), 1);

	// The response to DELETE requests is always http 204 (No Content)
	return [
		204,
		{
			"OData-Version": "4.0"
		},
		null
	];
}

/**
 * Handles POST requests for users and returns a fitting response.
 */
function handlePostUserRequests(xhr: MockXhr): MockResponse {
	const user = getUserDataFromRequestBody(xhr.requestBody || "");

	// Check if that user already exists
	if (isUnique(user.UserName)) {
		users.push(user);

		let responseBody = '{"@odata.context": "' + getBaseUrl(xhr.url)
			+ '$metadata#People/$entity",';
		responseBody += JSON.stringify(user).slice(1);

		// The response to POST requests is http 201 (Created)
		return [
			201,
			{
				"Content-Type": "application/json; odata.metadata=minimal",
				"OData-Version": "4.0"
			},
			responseBody
		];
	}
	// Error
	const responseBody = duplicateKeyError(user.UserName);
	return [
		400,
		{
			"Content-Type": "application/json; charset=utf-8"
		},
		responseBody
	];
}

/**
 * Handles POST requests for resetting the data and returns a fitting response.
 */
function handleResetDataRequest(): MockResponse {
	void readData();

	return [
		204,
		{
			"OData-Version": "4.0"
		},
		null
	];
}

/**
 * Builds a response to direct (= non-batch) requests.
 * Supports GET, PATCH, DELETE and POST requests.
 */
function handleDirectRequest(xhr: MockXhr): MockResponse | undefined {
	let response2: MockResponse | undefined;

	switch (xhr.method) {
		case "GET":
			if (/\$metadata/.test(xhr.url)) {
				response2 = handleGetMetadataRequests();
			} else if (/\/\$count/.test(xhr.url)) {
				response2 = handleGetCountRequests();
			} else if (/People.*\?/.test(xhr.url)) {
				response2 = handleGetUserRequests(xhr, /\$count=true/.test(xhr.url));
			}
			break;
		case "PATCH":
			if (/People/.test(xhr.url)) {
				response2 = handlePatchUserRequests(xhr);
			}
			break;
		case "POST":
			if (/People/.test(xhr.url)) {
				response2 = handlePostUserRequests(xhr);
			} else if (/ResetDataSource/.test(xhr.url)) {
				response2 = handleResetDataRequest();
			}
			break;
		case "DELETE":
			if (/People/.test(xhr.url)) {
				response2 = handleDeleteUserRequests(xhr);
			}
			break;
		case "HEAD":
			response2 = [204, {}];
			break;
		default:
			break;
	}

	return response2;
}

/**
 * Builds a response to batch requests.
 * Unwraps batch request, gets a response for each individual part and
 * constructs a fitting batch response.
 */
function handleBatchRequest(xhr: MockXhr): MockResponse {
	let responseBody = "";
	const outerBoundary = (xhr.requestBody || "").match(/(.*)/)![1]; // First line of the body
	let innerBoundary: string | undefined;
	let partBoundary: string;
	// The individual requests
	const outerParts = (xhr.requestBody || "").split(outerBoundary).slice(1, -1);
	let parts: string[];
	let header: string;

	const matches = outerParts[0].match(/multipart\/mixed;boundary=(.+)/);
	// If this request has several change sets, then we need to handle the inner and outer
	// boundaries (change sets have an additional boundary)
	if (matches && matches.length > 0) {
		innerBoundary = matches[1];
		parts = outerParts[0].split("--" + innerBoundary).slice(1, -1);
	} else {
		parts = outerParts;
	}

	// If this request has several change sets, then the response must start with the outer
	// boundary and content header
	if (innerBoundary) {
		partBoundary = "--" + innerBoundary;
		responseBody += outerBoundary + "\r\n"
			+ "Content-Type: multipart/mixed; boundary=" + innerBoundary + "\r\n\r\n";
	} else {
		partBoundary = outerBoundary;
	}

	parts.forEach((part, index) => {
		// Construct the batch response body out of the single batch request parts.
		const matches0 = part.match(/(GET|DELETE|PATCH|POST) (\S+)(?:.|\r?\n)+\r?\n(.*)\r?\n$/)!;
		const partResponse = handleDirectRequest({
			method: matches0[1],
			url: getBaseUrl(xhr.url) + matches0[2],
			requestBody: matches0[3]
		})!;

		responseBody += partBoundary + "\r\n"
			+ "Content-Type: application/http\r\n";
		// If there are several change sets, we need to add a Content ID header
		if (innerBoundary) {
			responseBody += "Content-ID:" + index + ".0\r\n";
		}
		responseBody += "\r\nHttp/1.1 " + partResponse[0] + "\r\n";
		// Add any headers from the request - unless this response is 204 (no content)
		if (partResponse[1] && partResponse[0] !== 204) {
			for (header in partResponse[1]) {
				if (Object.prototype.hasOwnProperty.call(partResponse[1], header)) {
					responseBody += header + ": " + partResponse[1][header] + "\r\n";
				}
			}
		}
		responseBody += "\r\n";

		if (partResponse[2]) {
			responseBody += partResponse[2];
		}
		responseBody += "\r\n";
	});

	// Check if we need to add the inner boundary again at the end
	if (innerBoundary) {
		responseBody += "--" + innerBoundary + "--\r\n";
	}
	// Add a final boundary to the batch response body
	responseBody += outerBoundary + "--";

	// Build the final batch response
	return [
		200,
		{
			"Content-Type": "multipart/mixed;boundary=" + outerBoundary.slice(2),
			"OData-Version": "4.0"
		},
		responseBody
	];
}

/**
 * Handles any type of intercepted request and sends a fake response.
 * Logs the request and response to the console.
 * Manages batch requests.
 */
function handleAllRequests(xhr: MockXhr): void {
	let response2: MockResponse | undefined;

	// Log the request
	Log.info(
		"Mockserver: Received " + xhr.method + " request to URL " + xhr.url,
		(xhr.requestBody ? "Request body is:\n" + xhr.requestBody : "No request body.")
		+ "\n",
		logComponent
	);

	if (xhr.method === "POST" && /\$batch/.test(xhr.url)) {
		response2 = handleBatchRequest(xhr);
	} else {
		response2 = handleDirectRequest(xhr);
	}

	if (xhr.respond && response2) {
		xhr.respond(response2[0], response2[1], response2[2] || null);
	}

	// Log the response
	if (response2) {
		Log.info(
			"Mockserver: Sent response with return code " + response2[0],
			("Response headers: " + JSON.stringify(response2[1]) + "\n\nResponse body:\n"
				+ (response2[2] || "")) + "\n",
			logComponent
		);
	}
}

export default {

	/**
	 * Creates a Sinon fake service, intercepting all http requests to
	 * the URL defined in variable rBaseUrl above.
	 * @returns a promise that is resolved when the mock server is started
	 */
	init(): Promise<unknown> {
		// Load sinon lazily from the UI5 third-party shim
		return new Promise((resolve, reject) => {
			sap.ui.require(["sap/ui/thirdparty/sinon"], (lazySinon: any) => {
				sinon = lazySinon;
				sandbox = sinon.sandbox.create();

				// Read the mock data
				readData().then(() => {
					// Initialize the sinon fake server
					sandbox.useFakeServer();
					// Make sure that requests are responded to automatically. Otherwise we would need
					// to do that manually.
					sandbox.server.autoRespond = true;

					// Register the requests for which responses should be faked.
					sandbox.server.respondWith(rBaseUrl, handleAllRequests);

					// Apply a filter to the fake XmlHttpRequest.
					// Otherwise, ALL requests (e.g. for the component, views etc.) would be
					// intercepted.
					sinon.FakeXMLHttpRequest.useFilters = true;
					sinon.FakeXMLHttpRequest.addFilter((_sMethod: string, url: string) => {
						// If the filter returns true, the request will NOT be faked.
						// We only want to fake requests that go to the intended service.
						return !rBaseUrl.test(url);
					});

					// Set the logging level for console entries from the mock server
					Log.setLevel(Log.Level.INFO, logComponent);

					Log.info("Running the app with mock data", logComponent);
					resolve(undefined);
				}, reject);
			});
		});
	},

	/**
	 * Stops the request interception and deletes the Sinon fake server.
	 */
	stop(): void {
		if (sinon) {
			sinon.FakeXMLHttpRequest.filters = [];
			sinon.FakeXMLHttpRequest.useFilters = false;
		}
		if (sandbox) {
			sandbox.restore();
			sandbox = null;
		}
	}
};

// initMockServer.ts — bootstraps the mock server before the component starts
import MessageBox from "sap/m/MessageBox";
import mockserver from "./localService/mockserver";

// initialize the mock server
mockserver.init().catch((oError: Error) => {
	MessageBox.error(oError.message);
}).finally(() => {
	// initialize the embedded component on the HTML page
	void import("sap/ui/core/ComponentSupport");
});

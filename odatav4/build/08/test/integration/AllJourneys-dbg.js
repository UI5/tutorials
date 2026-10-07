sap.ui.define([
	"sap/ui/test/Opa5",
	"ui5/tutorial/odatav4/test/integration/arrangements/Startup",
	"ui5/tutorial/odatav4/test/integration/TutorialJourney"
], function (Opa5, Startup) {
	"use strict";

	Opa5.extendConfig({
		arrangements : new Startup(),
		viewNamespace : "ui5.tutorial.odatav4.view.",
		autoWait : true
	});
});

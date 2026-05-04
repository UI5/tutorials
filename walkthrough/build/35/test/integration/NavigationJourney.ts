import opaTest from "sap/ui/test/opaQunit";
import HelloPanelPage from "./pages/HelloPanelPage";

const onTheHelloPanelPage = new HelloPanelPage();

QUnit.module("Navigation");

opaTest("Should open the Hello dialog", function () {

	// Arrangements
	onTheHelloPanelPage.iStartMyUIComponent({
		componentConfig: {
			name: "ui5.walkthrough"
		}
	});

	// Actions
	onTheHelloPanelPage.iPressTheSayHelloWithDialogButton();

	// Assertions
	onTheHelloPanelPage.iShouldSeeTheHelloDialog();

	// Cleanup
	onTheHelloPanelPage.iTeardownMyApp();
});
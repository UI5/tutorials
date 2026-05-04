sap.ui.define(["sap/ui/test/opaQunit", "./pages/HelloPanelPage"], function (opaTest, __HelloPanelPage) {
  "use strict";

  function _interopRequireDefault(obj) {
    return obj && obj.__esModule && typeof obj.default !== "undefined" ? obj.default : obj;
  }
  const HelloPanelPage = _interopRequireDefault(__HelloPanelPage);
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
});
//# sourceMappingURL=NavigationJourney-dbg.js.map

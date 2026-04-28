sap.ui.define(["sap/ui/test/Opa5", "sap/ui/test/actions/Press"], function (Opa5, Press) {
  "use strict";

  const viewName = "ui5.walkthrough.view.HelloPanel";
  class HelloPanelPage extends Opa5 {
    // Actions
    iPressTheSayHelloWithDialogButton() {
      return this.waitFor({
        id: "helloDialogButton",
        viewName,
        actions: new Press(),
        errorMessage: "Did not find the 'Say Hello With Dialog' button on the HelloPanel view"
      });
    }

    // Assertions
    iShouldSeeTheHelloDialog() {
      return this.waitFor({
        controlType: "sap.m.Dialog",
        success: function () {
          // we set the view busy, so we need to query the parent of the app
          Opa5.assert.ok(true, "The dialog is open");
        },
        errorMessage: "Did not find the dialog control"
      });
    }
  }
  return HelloPanelPage;
});

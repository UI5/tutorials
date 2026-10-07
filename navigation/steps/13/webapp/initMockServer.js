sap.ui.define(["ui5/tutorial/navigation/localService/mockserver", "sap/m/MessageBox"], function (mockserver, MessageBox) {
  "use strict";

  mockserver.init().catch(error => {
    MessageBox.error(error.message);
  }).finally(() => {
    // initialize the embedded component on the HTML page
    sap.ui.require(["sap/ui/core/ComponentSupport"]);
  });
});

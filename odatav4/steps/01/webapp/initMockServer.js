sap.ui.define(["sap/m/MessageBox", "./localService/mockserver"], function (MessageBox, mockserver) {
  "use strict";

  // initialize the mock server
  mockserver.init().catch(oError => {
    MessageBox.error(oError.message);
  }).finally(() => {
    // initialize the embedded component on the HTML page
    void sap.ui.require(["sap/ui/core/ComponentSupport"]);
  });
});

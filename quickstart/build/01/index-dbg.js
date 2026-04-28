sap.ui.define(["sap/m/Button", "sap/m/MessageToast"], function (Button, MessageToast) {
  "use strict";

  new Button({
    text: "Ready...",
    press() {
      MessageToast.show("Hello World!");
    }
  }).placeAt("content");
});
//# sourceMappingURL=index-dbg.js.map

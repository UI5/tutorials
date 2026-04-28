sap.ui.define(["sap/ui/core/mvc/Controller", "sap/m/MessageToast"], function (Controller, MessageToast) {
  "use strict";

  const App = Controller.extend("ui5.quickstart.App", {
    onPress() {
      MessageToast.show("Hello App!");
    }
  });
  return App;
});

sap.ui.define(["sap/ui/core/mvc/Controller", "sap/m/MessageToast"], function (Controller, MessageToast) {
  "use strict";

  /**
   * @namespace ui5.quickstart
   */
  const App = Controller.extend("ui5.quickstart.App", {
    onPress: function _onPress() {
      MessageToast.show("Hello App!");
    }
  });
  return App;
});
//# sourceMappingURL=App-dbg.controller.js.map

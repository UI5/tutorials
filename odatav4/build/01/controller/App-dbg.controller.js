sap.ui.define(["sap/ui/core/mvc/Controller", "sap/ui/model/json/JSONModel"], function (Controller, JSONModel) {
  "use strict";

  /**
   * @namespace ui5.tutorial.odatav4.controller
   */
  const App = Controller.extend("ui5.tutorial.odatav4.controller.App", {
    /**
     *  Hook for initializing the controller
     */
    onInit: function _onInit() {
      const jsonData = {
        busy: false
      };
      const model = new JSONModel(jsonData);
      this.getView().setModel(model, "appView");
    }
  });
  return App;
});
//# sourceMappingURL=App-dbg.controller.js.map

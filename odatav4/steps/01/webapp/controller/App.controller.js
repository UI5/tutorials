sap.ui.define(["sap/ui/core/mvc/Controller", "sap/ui/model/json/JSONModel"], function (Controller, JSONModel) {
  "use strict";

  const App = Controller.extend("ui5.tutorial.odatav4.controller.App", {
    /**
     *  Hook for initializing the controller
     */
    onInit() {
      const jsonData = {
        busy: false
      };
      const model = new JSONModel(jsonData);
      this.getView().setModel(model, "appView");
    }
  });
  return App;
});

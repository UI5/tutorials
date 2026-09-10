sap.ui.define(["sap/ui/core/mvc/Controller", "sap/ui/core/routing/History", "sap/ui/core/UIComponent"], function (Controller, History, UIComponent) {
  "use strict";

  const BaseController = Controller.extend("ui5.tutorial.navigation.controller.BaseController", {
    getRouter() {
      return UIComponent.getRouterFor(this);
    },
    onNavBack() {
      const history = History.getInstance();
      const previousHash = history.getPreviousHash();
      if (previousHash !== undefined) {
        window.history.go(-1);
      } else {
        this.getRouter().navTo("appHome", {}, true /*no history*/);
      }
    }
  });
  return BaseController;
});

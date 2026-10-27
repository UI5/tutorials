sap.ui.define(["sap/ui/core/mvc/Controller", "sap/ui/core/routing/History", "sap/ui/core/UIComponent"], function (Controller, History, UIComponent) {
  "use strict";

  /**
   * @namespace ui5.tutorial.navigation.controller
   */
  const BaseController = Controller.extend("ui5.tutorial.navigation.controller.BaseController", {
    getRouter: function _getRouter() {
      return UIComponent.getRouterFor(this);
    },
    onNavBack: function _onNavBack() {
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
//# sourceMappingURL=BaseController-dbg.js.map

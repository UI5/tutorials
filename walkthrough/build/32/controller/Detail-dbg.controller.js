sap.ui.define(["sap/ui/core/mvc/Controller", "sap/ui/core/routing/History", "sap/ui/core/UIComponent"], function (Controller, History, UIComponent) {
  "use strict";

  /**
   * @namespace ui5.walkthrough.controller
   */
  const Detail = Controller.extend("ui5.walkthrough.controller.Detail", {
    onInit: function _onInit() {
      const router = UIComponent.getRouterFor(this);
      router.getRoute("detail").attachPatternMatched(this.onObjectMatched, this);
    },
    onObjectMatched: function _onObjectMatched(event) {
      this.getView()?.bindElement({
        path: "/" + window.decodeURIComponent(event.getParameter("arguments").invoicePath),
        model: "invoice"
      });
    },
    onNavBack: function _onNavBack() {
      const history = History.getInstance();
      const previousHash = history.getPreviousHash();
      if (previousHash !== undefined) {
        window.history.go(-1);
      } else {
        const router = UIComponent.getRouterFor(this);
        router.navTo("overview", {}, true);
      }
    }
  });
  ;
  return Detail;
});
//# sourceMappingURL=Detail-dbg.controller.js.map

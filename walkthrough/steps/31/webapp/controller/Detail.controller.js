sap.ui.define(["sap/ui/core/mvc/Controller", "sap/ui/core/UIComponent"], function (Controller, UIComponent) {
  "use strict";

  const Detail = Controller.extend("ui5.walkthrough.controller.Detail", {
    onInit() {
      const router = UIComponent.getRouterFor(this);
      router.getRoute("detail").attachPatternMatched(this.onObjectMatched, this);
    },
    onObjectMatched(event) {
      this.getView()?.bindElement({
        path: "/" + window.decodeURIComponent(event.getParameter("arguments").invoicePath),
        model: "invoice"
      });
    }
  });
  return Detail;
});

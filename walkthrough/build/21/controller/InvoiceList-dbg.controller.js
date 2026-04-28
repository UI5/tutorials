sap.ui.define(["sap/ui/core/mvc/Controller", "sap/ui/model/json/JSONModel"], function (Controller, JSONModel) {
  "use strict";

  /**
   * @namespace ui5.walkthrough.controller
   */
  const App = Controller.extend("ui5.walkthrough.controller.App", {
    onInit: function _onInit() {
      const viewModel = new JSONModel({
        currency: "EUR"
      });
      this.getView()?.setModel(viewModel, "view");
    }
  });
  ;
  return App;
});
//# sourceMappingURL=InvoiceList-dbg.controller.js.map

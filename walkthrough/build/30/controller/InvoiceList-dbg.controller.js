sap.ui.define(["sap/ui/core/mvc/Controller", "sap/ui/model/json/JSONModel", "sap/ui/model/Filter", "sap/ui/model/FilterOperator", "sap/ui/core/UIComponent"], function (Controller, JSONModel, Filter, FilterOperator, UIComponent) {
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
    },
    onFilterInvoices: function _onFilterInvoices(event) {
      // build filter array
      const filter = [];
      const query = event.getParameter("query");
      if (query) {
        filter.push(new Filter("ProductName", FilterOperator.Contains, query));
      }

      // filter binding
      const list = this.byId("invoiceList");
      const binding = list?.getBinding("items");
      binding?.filter(filter);
    },
    onPress: function _onPress() {
      const router = UIComponent.getRouterFor(this);
      router.navTo("detail");
    }
  });
  ;
  return App;
});
//# sourceMappingURL=InvoiceList-dbg.controller.js.map

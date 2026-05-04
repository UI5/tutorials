sap.ui.define(["sap/ui/core/mvc/Controller", "sap/ui/model/json/JSONModel", "sap/ui/model/Filter", "sap/ui/model/FilterOperator", "sap/ui/core/UIComponent"], function (Controller, JSONModel, Filter, FilterOperator, UIComponent) {
  "use strict";

  const App = Controller.extend("ui5.walkthrough.controller.App", {
    onInit() {
      const viewModel = new JSONModel({
        currency: "EUR"
      });
      this.getView()?.setModel(viewModel, "view");
    },
    onFilterInvoices(event) {
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
    onPress(event) {
      const item = event.getSource();
      const router = UIComponent.getRouterFor(this);
      router.navTo("detail", {
        invoicePath: window.encodeURIComponent(item.getBindingContext("invoice").getPath().substring(1))
      });
    }
  });
  return App;
});

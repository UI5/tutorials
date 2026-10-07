sap.ui.define(["sap/ui/core/mvc/Controller", "sap/m/MessageToast", "sap/m/MessageBox", "sap/ui/model/Sorter", "sap/ui/model/Filter", "sap/ui/model/FilterOperator", "sap/ui/model/FilterType", "sap/ui/model/json/JSONModel"], function (Controller, MessageToast, MessageBox, Sorter, Filter, FilterOperator, FilterType, JSONModel) {
  "use strict";

  const App = Controller.extend("ui5.tutorial.odatav4.controller.App", {
    /**
     *  Hook for initializing the controller
     */
    onInit() {
      const jsonData = {
        busy: false,
        order: 0
      };
      const model = new JSONModel(jsonData);
      this.getView().setModel(model, "appView");
    },
    /* =========================================================== */
    /*           begin: event handlers                             */
    /* =========================================================== */
    /**
     * Refresh the data.
     */
    onRefresh() {
      const binding = this.byId("peopleList").getBinding("items");
      if (binding.hasPendingChanges()) {
        MessageBox.error(this._getText("refreshNotPossibleMessage"));
        return;
      }
      binding.refresh();
      MessageToast.show(this._getText("refreshSuccessMessage"));
    },
    /**
     * Search for the term in the search field.
     */
    onSearch() {
      const view = this.getView();
      const value = view.byId("searchField").getValue();
      const filter = new Filter("LastName", FilterOperator.Contains, value);
      view.byId("peopleList").getBinding("items").filter(filter, FilterType.Application);
    },
    /**
     * Sort the table according to the last name.
     * Cycles between the three sorting states "none", "ascending" and "descending"
     */
    onSort() {
      const view = this.getView();
      const states = [undefined, "asc", "desc"];
      const stateTextIds = ["sortNone", "sortAscending", "sortDescending"];
      let order = view.getModel("appView").getProperty("/order");

      // Cycle between the states
      order = (order + 1) % states.length;
      const order2 = states[order];
      view.getModel("appView").setProperty("/order", order);
      view.byId("peopleList").getBinding("items").sort(order2 ? new Sorter("LastName", order2 === "desc") : []);
      const message = this._getText("sortMessage", [this._getText(stateTextIds[order])]);
      MessageToast.show(message);
    },
    /* =========================================================== */
    /*           end: event handlers                               */
    /* =========================================================== */
    /**
     * Convenience method for retrieving a translatable text.
     * @param sTextId - the ID of the text to be retrieved.
     * @param aArgs - optional array of texts for placeholders.
     * @returns the text belonging to the given ID.
     */
    _getText(textId, args) {
      const bundle = this.getOwnerComponent().getModel("i18n").getResourceBundle();
      return bundle.getText(textId, args);
    }
  });
  return App;
});

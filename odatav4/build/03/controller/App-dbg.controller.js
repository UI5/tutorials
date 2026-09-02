sap.ui.define(["sap/ui/core/mvc/Controller", "sap/m/MessageToast", "sap/m/MessageBox", "sap/ui/model/json/JSONModel"], function (Controller, MessageToast, MessageBox, JSONModel) {
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
    },
    /* =========================================================== */
    /*           begin: event handlers                             */
    /* =========================================================== */
    /**
     * Refresh the data.
     */
    onRefresh: function _onRefresh() {
      const binding = this.byId("peopleList").getBinding("items");
      if (binding.hasPendingChanges()) {
        MessageBox.error(this._getText("refreshNotPossibleMessage"));
        return;
      }
      binding.refresh();
      MessageToast.show(this._getText("refreshSuccessMessage"));
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
    _getText: function _getText(textId, args) {
      const bundle = this.getOwnerComponent().getModel("i18n").getResourceBundle();
      return bundle.getText(textId, args);
    }
  });
  return App;
});
//# sourceMappingURL=App-dbg.controller.js.map

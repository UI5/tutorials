sap.ui.define(["sap/m/library", "sap/ui/core/mvc/Controller", "sap/ui/model/type/Currency"], function (sap_m_library, Controller, Currency) {
  "use strict";

  const URLHelper = sap_m_library["URLHelper"];
  /**
   * @namespace ui5.tutorial.databinding.controller
   */
  const App = Controller.extend("ui5.tutorial.databinding.controller.App", {
    formatMail: async function _formatMail(firstName, lastName) {
      const bundle = await this.getView().getModel("i18n").getResourceBundle();
      return URLHelper.normalizeEmail(`${firstName}.${lastName}@example.com`, bundle.getText("mailSubject", [firstName]), bundle.getText("mailBody"));
    },
    formatStockValue: function _formatStockValue(unitPrice, stockLevel, currencyCode) {
      const currency = new Currency();
      return currency.formatValue([unitPrice * stockLevel, currencyCode], "string");
    },
    onItemSelected: function _onItemSelected(event) {
      const bindingPath = event.getSource().getBindingContext("products").getPath();
      this.byId("productDetailsPanel")?.bindElement({
        path: bindingPath,
        model: "products"
      });
    }
  });
  return App;
});
//# sourceMappingURL=App-dbg.controller.js.map

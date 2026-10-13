sap.ui.define(["sap/m/library", "sap/m/ObjectAttribute", "sap/ui/core/mvc/Controller", "sap/ui/model/type/Currency"], function (sap_m_library, ObjectAttribute, Controller, Currency) {
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
    },
    productListFactory: function _productListFactory(id, context) {
      let uiControl;
      // Decide based on the data which dependent to clone
      if (context.getProperty("UnitsInStock") === 0 && context.getProperty("Discontinued")) {
        // The item is discontinued, so use a StandardListItem
        uiControl = this.byId("productSimple").clone(id);
      } else {
        // The item is available, so we will create an ObjectListItem
        uiControl = this.byId("productExtended").clone(id);

        // The item is temporarily out of stock, so we will add a status
        if (context.getProperty("UnitsInStock") < 1) {
          uiControl.addAttribute(new ObjectAttribute({
            text: {
              path: "i18n>outOfStock"
            }
          }));
        }
      }
      return uiControl;
    }
  });
  return App;
});
//# sourceMappingURL=App-dbg.controller.js.map

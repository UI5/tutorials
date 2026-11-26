sap.ui.define(["sap/m/library", "sap/ui/core/mvc/Controller"], function (sap_m_library, Controller) {
  "use strict";

  const URLHelper = sap_m_library["URLHelper"];
  const App = Controller.extend("ui5.tutorial.databinding.controller.App", {
    async formatMail(firstName, lastName) {
      const bundle = await this.getView().getModel("i18n").getResourceBundle();
      return URLHelper.normalizeEmail(`${firstName}.${lastName}@example.com`, bundle.getText("mailSubject", [firstName]), bundle.getText("mailBody"));
    }
  });
  return App;
});

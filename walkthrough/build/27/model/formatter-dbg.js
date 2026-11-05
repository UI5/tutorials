sap.ui.define([], function () {
  "use strict";

  var __exports = {
    statusText: function (status) {
      const resourceBundle = this?.getOwnerComponent()?.getModel("i18n")?.getResourceBundle();
      switch (status) {
        case "A":
          return resourceBundle.getText("invoiceStatusA");
        case "B":
          return resourceBundle.getText("invoiceStatusB");
        case "C":
          return resourceBundle.getText("invoiceStatusC");
        default:
          return status;
      }
    }
  };
  return __exports;
});
//# sourceMappingURL=formatter-dbg.js.map

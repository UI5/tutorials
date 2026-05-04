sap.ui.define(["sap/ui/core/mvc/Controller", "sap/m/MessageToast"], function (Controller, MessageToast) {
  "use strict";

  const AppController = Controller.extend("ui5.walkthrough.controller.App", {
    onShowHello() {
      // read msg from i18n model
      const recipient = this.getView()?.getModel()?.getProperty("/recipient/name");
      const resourceBundle = this.getView()?.getModel("i18n")?.getResourceBundle();
      const msg = resourceBundle.getText("helloMsg", [recipient]);
      // show message
      MessageToast.show(msg);
    }
  });
  return AppController;
});

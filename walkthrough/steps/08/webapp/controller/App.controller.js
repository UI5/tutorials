sap.ui.define(["sap/m/MessageToast", "sap/ui/core/mvc/Controller", "sap/ui/model/json/JSONModel", "sap/ui/model/resource/ResourceModel"], function (MessageToast, Controller, JSONModel, ResourceModel) {
  "use strict";

  const AppController = Controller.extend("ui5.walkthrough.controller.App", {
    onInit() {
      // set data model on view
      const data = {
        recipient: {
          name: "World"
        }
      };
      const dataModel = new JSONModel(data);
      this.getView()?.setModel(dataModel);

      // set i18n model on view
      const i18nModel = new ResourceModel({
        bundleName: "ui5.walkthrough.i18n.i18n"
      });
      this.getView()?.setModel(i18nModel, "i18n");
    },
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

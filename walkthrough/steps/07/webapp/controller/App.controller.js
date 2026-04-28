sap.ui.define(["sap/m/MessageToast", "sap/ui/core/mvc/Controller", "sap/ui/model/json/JSONModel"], function (MessageToast, Controller, JSONModel) {
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
    },
    onShowHello() {
      MessageToast.show("Hello World");
    }
  });
  return AppController;
});

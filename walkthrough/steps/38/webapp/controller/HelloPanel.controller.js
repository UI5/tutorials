sap.ui.define(["sap/ui/core/mvc/Controller", "sap/m/MessageToast"], function (Controller, MessageToast) {
  "use strict";

  const HelloPanel = Controller.extend("ui5.walkthrough.controller.HelloPanel", {
    onShowHello() {
      // read msg from i18n model
      const recipient = this.getView()?.getModel()?.getProperty("/recipient/name");
      const resourceBundle = this.getView()?.getModel("i18n")?.getResourceBundle();
      const msg = resourceBundle.getText("helloMsg", [recipient]);
      // show message
      MessageToast.show(msg);
    },
    async onOpenDialog() {
      this.dialog ??= await this.loadFragment({
        name: "ui5.walkthrough.view.HelloDialog"
      });
      this.dialog.open();
    },
    onCloseDialog() {
      // note: We don't need to chain to the pDialog promise, since this event-handler
      // is only called from within the loaded dialog itself.
      this.byId("helloDialog")?.close();
    }
  });
  return HelloPanel;
});

sap.ui.define(["sap/ui/core/mvc/Controller", "sap/m/MessageToast"], function (Controller, MessageToast) {
  "use strict";

  /**
   * @namespace ui5.walkthrough.controller
   */
  const HelloPanel = Controller.extend("ui5.walkthrough.controller.HelloPanel", {
    onShowHello: function _onShowHello() {
      // read msg from i18n model
      const recipient = this.getView()?.getModel()?.getProperty("/recipient/name");
      const resourceBundle = this.getView()?.getModel("i18n")?.getResourceBundle();
      const msg = resourceBundle.getText("helloMsg", [recipient]);
      // show message
      MessageToast.show(msg);
    },
    onOpenDialog: async function _onOpenDialog() {
      this.dialog ??= await this.loadFragment({
        name: "ui5.walkthrough.view.HelloDialog"
      });
      this.dialog.open();
    }
  });
  ;
  return HelloPanel;
});
//# sourceMappingURL=HelloPanel-dbg.controller.js.map

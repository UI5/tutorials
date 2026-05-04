sap.ui.define(["sap/m/MessageToast", "sap/ui/core/mvc/Controller"], function (MessageToast, Controller) {
  "use strict";

  /**
   * @name ui5.walkthrough.controller.App
   */
  const AppController = Controller.extend("ui5.walkthrough.controller.App", {
    onShowHello: function _onShowHello() {
      // read msg from i18n model
      // functions with generic return values require casting
      const resourceBundle = this.getView()?.getModel("i18n")?.getResourceBundle();
      const recipient = this.getView()?.getModel()?.getProperty("/recipient/name");
      const msg = resourceBundle.getText("helloMsg", [recipient]);
      // show message
      MessageToast.show(msg);
    }
  });
  ;
  return AppController;
});
//# sourceMappingURL=App-dbg.controller.js.map

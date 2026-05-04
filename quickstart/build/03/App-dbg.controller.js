sap.ui.define(["sap/ui/core/mvc/Controller", "sap/m/MessageToast", "sap/ui/model/json/JSONModel"], function (Controller, MessageToast, JSONModel) {
  "use strict";

  /**
   * @namespace ui5.quickstart
   */
  const AppController = Controller.extend("ui5.quickstart.AppController", {
    onPress: function _onPress() {
      MessageToast.show("Hello UI5!");
      this.byId("app").to(this.byId("intro"));
    },
    onInit: function _onInit() {
      this.getView().setModel(new JSONModel({
        features: ["Enterprise-Ready Web Toolkit", "Powerful Development Concepts", "Feature-Rich UI Controls", "Consistent User Experience", "Free and Open Source", "Responsive Across Browsers and Devices"]
      }));
    },
    onChange: function _onChange(oEvent) {
      const bState = oEvent.getParameter("state");
      this.byId("ready").setVisible(bState);
    }
  });
  return AppController;
});
//# sourceMappingURL=App-dbg.controller.js.map

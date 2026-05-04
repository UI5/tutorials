sap.ui.define(["sap/ui/core/UIComponent", "sap/ui/model/json/JSONModel", "sap/ui/Device"], function (UIComponent, JSONModel, Device) {
  "use strict";

  const Component = UIComponent.extend("ui5.walkthrough.Component", {
    metadata: {
      "interfaces": ["sap.ui.core.IAsyncContentCreation"],
      "manifest": "json"
    },
    init() {
      // call the init function of the parent
      UIComponent.prototype.init.call(this);

      // set data model
      const data = {
        recipient: {
          name: "World"
        }
      };
      const model = new JSONModel(data);
      this.setModel(model);

      // set device model
      const deviceModel = new JSONModel(Device);
      deviceModel.setDefaultBindingMode("OneWay");
      this.setModel(deviceModel, "device");

      // create the views based on the url/hash
      this.getRouter().initialize();
    },
    getContentDensityClass() {
      return Device.support.touch ? "sapUiSizeCozy" : "sapUiSizeCompact";
    }
  });
  return Component;
});

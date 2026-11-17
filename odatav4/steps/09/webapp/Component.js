sap.ui.define(["sap/ui/core/UIComponent", "./model/models"], function (UIComponent, ___model_models) {
  "use strict";

  const createDeviceModel = ___model_models["createDeviceModel"];
  const Component = UIComponent.extend("ui5.tutorial.odatav4.Component", {
    metadata: {
      interfaces: ["sap.ui.core.IAsyncContentCreation"],
      manifest: "json"
    },
    /**
     * The component is initialized by UI5 automatically during the startup of the app and calls
     * the init method once.
     * @public
     * @override
     */
    init() {
      // call the base component's init function
      UIComponent.prototype.init.call(this);

      // set the device model
      this.setModel(createDeviceModel(), "device");
    }
  });
  return Component;
});

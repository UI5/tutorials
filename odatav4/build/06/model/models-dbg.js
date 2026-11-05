sap.ui.define(["sap/ui/model/json/JSONModel", "sap/ui/Device"], function (JSONModel, Device) {
  "use strict";

  function createDeviceModel() {
    const model = new JSONModel(Device);
    model.setDefaultBindingMode("OneWay");
    return model;
  }
  var __exports = {
    __esModule: true
  };
  __exports.createDeviceModel = createDeviceModel;
  return __exports;
});
//# sourceMappingURL=models-dbg.js.map

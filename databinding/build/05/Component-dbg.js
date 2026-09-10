sap.ui.define(["sap/ui/core/UIComponent", "sap/ui/model/BindingMode"], function (UIComponent, BindingMode) {
  "use strict";

  /**
   * @namespace ui5.tutorial.databinding
   */
  const Component = UIComponent.extend("ui5.tutorial.databinding.Component", {
    metadata: {
      interfaces: ["sap.ui.core.IAsyncContentCreation"],
      manifest: "json"
    },
    init: function _init() {
      UIComponent.prototype.init.call(this);
      this.getModel().setDefaultBindingMode(BindingMode.OneWay);
    }
  });
  return Component;
});
//# sourceMappingURL=Component-dbg.js.map

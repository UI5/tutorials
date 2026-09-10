sap.ui.define(["sap/ui/core/UIComponent"], function (UIComponent) {
  "use strict";

  /**
   * @namespace ui5.tutorial.navigation
   */
  const Component = UIComponent.extend("ui5.tutorial.navigation.Component", {
    metadata: {
      interfaces: ["sap.ui.core.IAsyncContentCreation"],
      manifest: "json"
    },
    init: function _init() {
      UIComponent.prototype.init.call(this);

      // create the views based on the url/hash
      this.getRouter().initialize();
    }
  });
  return Component;
});
//# sourceMappingURL=Component-dbg.js.map

sap.ui.define(["sap/ui/core/UIComponent"], function (UIComponent) {
  "use strict";

  const Component = UIComponent.extend("ui5.tutorial.navigation.Component", {
    metadata: {
      interfaces: ["sap.ui.core.IAsyncContentCreation"],
      manifest: "json"
    }
  });
  return Component;
});

sap.ui.define(["sap/ui/core/UIComponent", "sap/ui/core/mvc/XMLView", "sap/ui/model/json/JSONModel", "sap/ui/model/resource/ResourceModel"], function (UIComponent, XMLView, JSONModel, ResourceModel) {
  "use strict";

  /**
   * @namespace ui5.walkthrough
   */
  const Component = UIComponent.extend("ui5.walkthrough.Component", {
    metadata: {
      "interfaces": ["sap.ui.core.IAsyncContentCreation"]
    },
    init: function _init() {
      // call the init function of the parent
      UIComponent.prototype.init.call(this);
      // set data model
      const data = {
        recipient: {
          name: "World"
        }
      };
      const dataModel = new JSONModel(data);
      this.setModel(dataModel);

      // set i18n model
      const i18nModel = new ResourceModel({
        "bundleName": "ui5.walkthrough.i18n.i18n",
        "supportedLocales": [""],
        "fallbackLocale": ""
      });
      this.setModel(i18nModel, "i18n");
    },
    createContent: function _createContent() {
      return XMLView.create({
        "viewName": "ui5.walkthrough.view.App",
        "id": "app"
      });
    }
  });
  ;
  return Component;
});
//# sourceMappingURL=Component-dbg.js.map

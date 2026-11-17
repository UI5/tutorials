import UIComponent from "sap/ui/core/UIComponent";

/**
 * @namespace ui5.tutorial.navigation
 */
export default class Component extends UIComponent {

  public static metadata = {
    interfaces: ["sap.ui.core.IAsyncContentCreation"],
    manifest: "json"
  };

  public init(): void {
    super.init();

    // create the views based on the url/hash
    this.getRouter().initialize();
  }
}

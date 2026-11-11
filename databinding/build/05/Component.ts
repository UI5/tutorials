import UIComponent from "sap/ui/core/UIComponent";
import BindingMode from "sap/ui/model/BindingMode";

/**
 * @namespace ui5.tutorial.databinding
 */
export default class Component extends UIComponent {
  public static metadata = {
    interfaces: ["sap.ui.core.IAsyncContentCreation"],
    manifest: "json"
  };

  public init(): void {
    super.init();
    this.getModel().setDefaultBindingMode(BindingMode.OneWay);
  }
}

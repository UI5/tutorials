// Component.ts — UI5 OData V4 Tutorial
import UIComponent from "sap/ui/core/UIComponent";
import { createDeviceModel } from "./model/models";

/**
 * @namespace ui5.tutorial.odatav4
 */
export default class Component extends UIComponent {
	public static metadata = {
		interfaces: ["sap.ui.core.IAsyncContentCreation"],
		manifest: "json"
	};

	/**
	 * The component is initialized by UI5 automatically during the startup of the app and calls
	 * the init method once.
	 * @public
	 * @override
	 */
	init(): void {
		// call the base component's init function
		super.init();

		// set the device model
		this.setModel(createDeviceModel(), "device");
	}
}

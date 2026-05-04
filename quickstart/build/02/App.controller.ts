import Controller from "sap/ui/core/mvc/Controller";
import MessageToast from "sap/m/MessageToast";

/**
 * @namespace ui5.quickstart
 */
export default class App extends Controller {
	onPress(): void {
		MessageToast.show("Hello App!");
	}
}

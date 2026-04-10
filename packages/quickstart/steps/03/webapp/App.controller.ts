import Controller from "sap/ui/core/mvc/Controller";
import MessageToast from "sap/m/MessageToast";
import JSONModel from "sap/ui/model/json/JSONModel";
import App from "sap/m/App";
import HorizontalLayout from "sap/ui/layout/HorizontalLayout";
import { Switch$ChangeEvent } from "sap/m/Switch";

/**
 * @namespace ui5.quickstart
 */
export default class AppController extends Controller {
	onPress(): void {
		MessageToast.show("Hello UI5!");
		(this.byId("app") as App).to(this.byId("intro") as App);
	}

	onInit(): void {
		this.getView()!.setModel(new JSONModel({
			features: [
				"Enterprise-Ready Web Toolkit",
				"Powerful Development Concepts",
				"Feature-Rich UI Controls",
				"Consistent User Experience",
				"Free and Open Source",
				"Responsive Across Browsers and Devices"
			]
		}));
	}

	onChange(oEvent: Switch$ChangeEvent): void {
		const bState = oEvent.getParameter("state");
		(this.byId("ready") as HorizontalLayout).setVisible(bState);
	}
}

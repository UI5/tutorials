import Controller from "sap/ui/core/mvc/Controller";
import JSONModel from "sap/ui/model/json/JSONModel";

/**
 * @namespace ui5.tutorial.walkthrough.controller
 */
export default class App extends Controller {
	
	onInit(): void {
		const viewModel = new JSONModel({
			currency: "EUR"
		});
		this.getView()?.setModel(viewModel, "view");        
	} 
};

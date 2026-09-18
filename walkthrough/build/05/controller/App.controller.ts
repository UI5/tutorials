import Controller from "sap/ui/core/mvc/Controller";

/**
 * @name ui5.tutorial.walkthrough.controller.App
 */
export default class AppController extends Controller {
	onShowHello(): void {
		// show a native JavaScript alert
		alert("Hello World");
	 }
};

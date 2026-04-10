import Controller from "sap/ui/core/mvc/Controller";
import Component from "../Component";

/**
 * @namespace ui5.walkthrough.controller
 */
export default class App extends Controller {
	onInit(): void {
        this.getView().addStyleClass((this.getOwnerComponent() as Component).getContentDensityClass())
    }
};

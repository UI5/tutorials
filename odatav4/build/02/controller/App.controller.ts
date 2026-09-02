import Controller from "sap/ui/core/mvc/Controller";
import MessageToast from "sap/m/MessageToast";
import MessageBox from "sap/m/MessageBox";
import JSONModel from "sap/ui/model/json/JSONModel";
import ResourceModel from "sap/ui/model/resource/ResourceModel";
import ResourceBundle from "sap/base/i18n/ResourceBundle";
import Component from "sap/ui/core/Component";
import List from "sap/m/List";
import type ListBinding from "sap/ui/model/ListBinding";

/**
 * @namespace ui5.tutorial.odatav4.controller
 */
export default class App extends Controller {

	/**
	 *  Hook for initializing the controller
	 */
	onInit(): void {
		const jsonData = {
			busy: false
		};
		const model = new JSONModel(jsonData);

		this.getView().setModel(model, "appView");
	}

	/* =========================================================== */
	/*           begin: event handlers                             */
	/* =========================================================== */

	/**
	 * Refresh the data.
	 */
	onRefresh(): void {
		const binding = (this.byId("peopleList") as List).getBinding("items") as unknown as { hasPendingChanges(): boolean; refresh(): void };

		if (binding.hasPendingChanges()) {
			MessageBox.error(this._getText("refreshNotPossibleMessage"));
			return;
		}
		binding.refresh();
		MessageToast.show(this._getText("refreshSuccessMessage"));
	}

	/* =========================================================== */
	/*           end: event handlers                               */
	/* =========================================================== */

	/**
	 * Convenience method for retrieving a translatable text.
	 * @param sTextId - the ID of the text to be retrieved.
	 * @param aArgs - optional array of texts for placeholders.
	 * @returns the text belonging to the given ID.
	 */
	_getText(textId: string, args?: unknown[]): string {
		const bundle = ((this.getOwnerComponent() as Component).getModel("i18n") as ResourceModel).getResourceBundle() as ResourceBundle;
		return bundle.getText(textId, args as string[]);
	}
}

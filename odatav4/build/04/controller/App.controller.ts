import Controller from "sap/ui/core/mvc/Controller";
import MessageToast from "sap/m/MessageToast";
import MessageBox from "sap/m/MessageBox";
import Sorter from "sap/ui/model/Sorter";
import Filter from "sap/ui/model/Filter";
import FilterOperator from "sap/ui/model/FilterOperator";
import FilterType from "sap/ui/model/FilterType";
import JSONModel from "sap/ui/model/json/JSONModel";
import ResourceModel from "sap/ui/model/resource/ResourceModel";
import ResourceBundle from "sap/base/i18n/ResourceBundle";
import Component from "sap/ui/core/Component";
import List from "sap/m/List";
import type SearchField from "sap/m/SearchField";
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
			busy: false,
			order: 0
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

	/**
	 * Search for the term in the search field.
	 */
	onSearch(): void {
		const view = this.getView();
		const value = (view.byId("searchField") as SearchField).getValue();
		const filter = new Filter("LastName", FilterOperator.Contains, value);

		((view.byId("peopleList") as List).getBinding("items") as ListBinding).filter(filter, FilterType.Application);
	}

	/**
	 * Sort the table according to the last name.
	 * Cycles between the three sorting states "none", "ascending" and "descending"
	 */
	onSort(): void {
		const view = this.getView();
		const states: (string | undefined)[] = [undefined, "asc", "desc"];
		const stateTextIds = ["sortNone", "sortAscending", "sortDescending"];
		let order = (view.getModel("appView") as JSONModel).getProperty("/order") as number;

		// Cycle between the states
		order = (order + 1) % states.length;
		const order2 = states[order];

		(view.getModel("appView") as JSONModel).setProperty("/order", order);
		((view.byId("peopleList") as List).getBinding("items") as ListBinding)
			.sort(order2 ? new Sorter("LastName", order2 === "desc") : []);

		const message = this._getText("sortMessage", [this._getText(stateTextIds[order])]);
		MessageToast.show(message);
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

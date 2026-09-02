import Messaging from "sap/ui/core/Messaging";
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
import type ColumnListItem from "sap/m/ColumnListItem";
import type SearchField from "sap/m/SearchField";
import type ListBinding from "sap/ui/model/ListBinding";
import type Event from "sap/ui/base/Event";
import type Input from "sap/m/Input";
import type Context from "sap/ui/model/odata/v4/Context";
import type ODataModel from "sap/ui/model/odata/v4/ODataModel";
import type ODataListBinding from "sap/ui/model/odata/v4/ODataListBinding";

/**
 * @namespace ui5.tutorial.odatav4.controller
 */
export default class App extends Controller {

	private _bTechnicalErrors = false;

	/**
	 *  Hook for initializing the controller
	 */
	onInit(): void {
		const messageModel = Messaging.getMessageModel();
		const messageModelBinding = messageModel.bindList("/", undefined, [],
			new Filter("technical", FilterOperator.EQ, true));
		const viewModel = new JSONModel({
			busy: false,
			hasUIChanges: false,
			usernameEmpty: true,
			order: 0
		});

		this.getView().setModel(viewModel, "appView");
		this.getView().setModel(messageModel, "message");

		messageModelBinding.attachChange(this.onMessageBindingChange, this);
		this._bTechnicalErrors = false;
	}

	/* =========================================================== */
	/*           begin: event handlers                             */
	/* =========================================================== */

	/**
	 * Create a new entry.
	 */
	onCreate(): void {
		const list = this.byId("peopleList") as List;
		const binding = list.getBinding("items") as ODataListBinding;
		// Create a new entry through the table's list binding
		const context = binding.create({ Age: "18" });

		this._setUIChanges(true);
		(this.getView().getModel("appView") as JSONModel).setProperty("/usernameEmpty", true);

		// Select and focus the table row that contains the newly created entry
		list.getItems().some((item) => {
			const columnItem = item as ColumnListItem;
			if (columnItem.getBindingContext() === context) {
				columnItem.focus();
				columnItem.setSelected(true);
				return true;
			}
			return false;
		});
	}

	/**
	 * Lock UI when changing data in the input controls
	 */
	onInputChange(evt: Event): void {
		if ((evt as unknown as { getParameter(n: string): unknown }).getParameter("escPressed")) {
			this._setUIChanges();
		} else {
			this._setUIChanges(true);
			// Check if the username in the changed table row is empty and set the appView
			// property accordingly
			const ctx = (evt.getSource() as Input).getParent()?.getBindingContext();
			if (ctx && ctx.getProperty("UserName")) {
				(this.getView().getModel("appView") as JSONModel).setProperty("/usernameEmpty", false);
			}
		}
	}

	/**
	 * Refresh the data.
	 */
	onRefresh(): void {
		const binding = (this.byId("peopleList") as List).getBinding("items") as ODataListBinding;

		if (binding.hasPendingChanges()) {
			MessageBox.error(this._getText("refreshNotPossibleMessage"));
			return;
		}
		binding.refresh();
		MessageToast.show(this._getText("refreshSuccessMessage"));
	}

	/**
	 * Reset any unsaved changes.
	 */
	onResetChanges(): void {
		((this.byId("peopleList") as List).getBinding("items") as ODataListBinding).resetChanges();
		// If there were technical errors, cancelling changes resets them.
		this._bTechnicalErrors = false;
		this._setUIChanges(false);
	}

	/**
	 * Save changes to the source.
	 */
	onSave(): void {
		const success = () => {
			this._setBusy(false);
			MessageToast.show(this._getText("changesSentMessage"));
			this._setUIChanges(false);
		};
		const error = (error2: Error) => {
			this._setBusy(false);
			this._setUIChanges(false);
			MessageBox.error(error2.message);
		};

		this._setBusy(true); // Lock UI until submitBatch is resolved.
		(this.getView().getModel() as ODataModel).submitBatch("peopleGroup").then(success, error);
		// If there were technical errors, a new save resets them.
		this._bTechnicalErrors = false;
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

	onMessageBindingChange(event: Event): void {
		const contexts = (event.getSource() as ListBinding).getContexts();
		let messageOpen = false;

		if (messageOpen || !contexts.length) {
			return;
		}

		// Extract and remove the technical messages
		const messages = contexts.map((context: Context) => context.getObject());
		Messaging.removeMessages(messages);

		this._setUIChanges(true);
		this._bTechnicalErrors = true;
		MessageBox.error((messages[0] as { message: string }).message, {
			id: "serviceErrorMessageBox",
			onClose: () => {
				messageOpen = false;
			}
		});

		messageOpen = true;
	}

	/* =========================================================== */
	/*           end: event handlers                               */
	/* =========================================================== */

	/**
	 * Convenience method for retrieving a translatable text.
	 */
	_getText(textId: string, args?: unknown[]): string {
		const bundle = ((this.getOwnerComponent() as Component).getModel("i18n") as ResourceModel).getResourceBundle() as ResourceBundle;
		return bundle.getText(textId, args as string[]);
	}

	/**
	 * Set hasUIChanges flag in View Model
	 * @param bHasUIChanges - set or clear hasUIChanges; if undefined, the hasPendingChanges-function
	 * of the OdataV4 model determines the result
	 */
	_setUIChanges(hasUIChanges?: boolean): void {
		if (this._bTechnicalErrors) {
			// If there is currently a technical error, then force 'true'.
			hasUIChanges = true;
		} else if (hasUIChanges === undefined) {
			hasUIChanges = (this.getView().getModel() as ODataModel).hasPendingChanges();
		}
		const model = this.getView().getModel("appView") as JSONModel;
		model.setProperty("/hasUIChanges", hasUIChanges);
	}

	/**
	 * Set busy flag in View Model
	 */
	_setBusy(isBusy: boolean): void {
		const model = this.getView().getModel("appView") as JSONModel;
		model.setProperty("/busy", isBusy);
	}
}

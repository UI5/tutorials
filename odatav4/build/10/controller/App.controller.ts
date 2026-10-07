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
			usernameEmpty: false,
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
	 * Delete an entry.
	 */
	onDelete(): void {
		const peopleList = this.byId("peopleList") as List;
		const selected = peopleList.getSelectedItem() as ColumnListItem | null;

		if (selected) {
			const context = selected.getBindingContext() as Context;
			const userName = context.getProperty("UserName") as string;
			void context.delete().then(() => {
				MessageToast.show(this._getText("deletionSuccessMessage", [userName]));
			}, (error2: Error & { canceled?: boolean }) => {
				const currentSelected = peopleList.getSelectedItem() as ColumnListItem | null;
				if (currentSelected && context === currentSelected.getBindingContext()) {
					this._setDetailArea(context);
				}
				this._setUIChanges();
				if (error2.canceled) {
					MessageToast.show(this._getText("deletionRestoredMessage", [userName]));
					return;
				}
				MessageBox.error(error2.message + ": " + userName);
			});
			this._setDetailArea();
			this._setUIChanges();
		}
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
	 * Reset the data source.
	 */
	onResetDataSource(): void {
		const model = this.getView().getModel() as ODataModel;
		const operation = model.bindContext("/ResetDataSource(...)");

		void operation.invoke().then(() => {
			model.refresh();
			MessageToast.show(this._getText("sourceResetSuccessMessage"));
		}, (error2: Error) => {
			MessageBox.error(error2.message);
		});
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

	onSelectionChange(event: Event): void {
		const listItem = (event as unknown as { getParameter(n: string): unknown }).getParameter("listItem") as ColumnListItem;
		this._setDetailArea(listItem.getBindingContext() as Context);
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

	/**
	 * Toggles the visibility of the detail area
	 * @param oUserContext - the current user context
	 */
	_setDetailArea(userContext?: Context): void {
		const detailArea = this.byId("detailArea");
		const layout = this.byId("defaultLayout") as unknown as { setSize(s: string): void; setResizable(b: boolean): void };
		const searchField = this.byId("searchField") as SearchField;

		if (!detailArea) {
			return; // do nothing during view destruction
		}

		const oldContext = (detailArea as unknown as { getBindingContext(): Context | null }).getBindingContext();
		if (oldContext && !oldContext.isTransient()) {
			oldContext.setKeepAlive(false);
		}
		if (userContext && !userContext.isTransient()) {
			userContext.setKeepAlive(true,
				// hide details if kept entity was refreshed but does not exist any more
				this._setDetailArea.bind(this));
		}
		(detailArea as unknown as { setBindingContext(c: Context | null): void }).setBindingContext(userContext || null);
		// resize view
		(detailArea as unknown as { setVisible(b: boolean): void }).setVisible(!!userContext);
		layout.setSize(userContext ? "60%" : "100%");
		layout.setResizable(!!userContext);
		searchField.setWidth(userContext ? "40%" : "20%");
	}
}

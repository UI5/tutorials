sap.ui.define(["sap/ui/core/Messaging", "sap/ui/core/mvc/Controller", "sap/m/MessageToast", "sap/m/MessageBox", "sap/ui/model/Sorter", "sap/ui/model/Filter", "sap/ui/model/FilterOperator", "sap/ui/model/FilterType", "sap/ui/model/json/JSONModel"], function (Messaging, Controller, MessageToast, MessageBox, Sorter, Filter, FilterOperator, FilterType, JSONModel) {
  "use strict";

  const App = Controller.extend("ui5.tutorial.odatav4.controller.App", {
    constructor() {
      Controller.prototype.constructor.apply(this, arguments);
      this._bTechnicalErrors = false;
    },
    /**
     *  Hook for initializing the controller
     */
    onInit() {
      const messageModel = Messaging.getMessageModel();
      const messageModelBinding = messageModel.bindList("/", undefined, [], new Filter("technical", FilterOperator.EQ, true));
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
    },
    /* =========================================================== */
    /*           begin: event handlers                             */
    /* =========================================================== */
    /**
     * Create a new entry.
     */
    onCreate() {
      const list = this.byId("peopleList");
      const binding = list.getBinding("items");
      // Create a new entry through the table's list binding
      const context = binding.create({
        Age: "18"
      });
      this._setUIChanges(true);
      this.getView().getModel("appView").setProperty("/usernameEmpty", true);

      // Select and focus the table row that contains the newly created entry
      list.getItems().some(item => {
        const columnItem = item;
        if (columnItem.getBindingContext() === context) {
          columnItem.focus();
          columnItem.setSelected(true);
          return true;
        }
        return false;
      });
    },
    /**
     * Delete an entry.
     */
    onDelete() {
      const peopleList = this.byId("peopleList");
      const selected = peopleList.getSelectedItem();
      if (selected) {
        const context = selected.getBindingContext();
        const userName = context.getProperty("UserName");
        void context.delete().then(() => {
          MessageToast.show(this._getText("deletionSuccessMessage", [userName]));
        }, error2 => {
          const currentSelected = peopleList.getSelectedItem();
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
    },
    /**
     * Lock UI when changing data in the input controls
     */
    onInputChange(evt) {
      if (evt.getParameter("escPressed")) {
        this._setUIChanges();
      } else {
        this._setUIChanges(true);
        // Check if the username in the changed table row is empty and set the appView
        // property accordingly
        const ctx = evt.getSource().getParent()?.getBindingContext();
        if (ctx && ctx.getProperty("UserName")) {
          this.getView().getModel("appView").setProperty("/usernameEmpty", false);
        }
      }
    },
    /**
     * Refresh the data.
     */
    onRefresh() {
      const binding = this.byId("peopleList").getBinding("items");
      if (binding.hasPendingChanges()) {
        MessageBox.error(this._getText("refreshNotPossibleMessage"));
        return;
      }
      binding.refresh();
      MessageToast.show(this._getText("refreshSuccessMessage"));
    },
    /**
     * Reset any unsaved changes.
     */
    onResetChanges() {
      this.byId("peopleList").getBinding("items").resetChanges();
      // If there were technical errors, cancelling changes resets them.
      this._bTechnicalErrors = false;
      this._setUIChanges(false);
    },
    /**
     * Reset the data source.
     */
    onResetDataSource() {
      const model = this.getView().getModel();
      const operation = model.bindContext("/ResetDataSource(...)");
      void operation.invoke().then(() => {
        model.refresh();
        MessageToast.show(this._getText("sourceResetSuccessMessage"));
      }, error2 => {
        MessageBox.error(error2.message);
      });
    },
    /**
     * Save changes to the source.
     */
    onSave() {
      const success = () => {
        this._setBusy(false);
        MessageToast.show(this._getText("changesSentMessage"));
        this._setUIChanges(false);
      };
      const error = error2 => {
        this._setBusy(false);
        this._setUIChanges(false);
        MessageBox.error(error2.message);
      };
      this._setBusy(true); // Lock UI until submitBatch is resolved.
      this.getView().getModel().submitBatch("peopleGroup").then(success, error);
      // If there were technical errors, a new save resets them.
      this._bTechnicalErrors = false;
    },
    /**
     * Search for the term in the search field.
     */
    onSearch() {
      const view = this.getView();
      const value = view.byId("searchField").getValue();
      const filter = new Filter("LastName", FilterOperator.Contains, value);
      view.byId("peopleList").getBinding("items").filter(filter, FilterType.Application);
    },
    /**
     * Sort the table according to the last name.
     * Cycles between the three sorting states "none", "ascending" and "descending"
     */
    onSort() {
      const view = this.getView();
      const states = [undefined, "asc", "desc"];
      const stateTextIds = ["sortNone", "sortAscending", "sortDescending"];
      let order = view.getModel("appView").getProperty("/order");

      // Cycle between the states
      order = (order + 1) % states.length;
      const order2 = states[order];
      view.getModel("appView").setProperty("/order", order);
      view.byId("peopleList").getBinding("items").sort(order2 ? new Sorter("LastName", order2 === "desc") : []);
      const message = this._getText("sortMessage", [this._getText(stateTextIds[order])]);
      MessageToast.show(message);
    },
    onMessageBindingChange(event) {
      const contexts = event.getSource().getContexts();
      let messageOpen = false;
      if (messageOpen || !contexts.length) {
        return;
      }

      // Extract and remove the technical messages
      const messages = contexts.map(context => context.getObject());
      Messaging.removeMessages(messages);
      this._setUIChanges(true);
      this._bTechnicalErrors = true;
      MessageBox.error(messages[0].message, {
        id: "serviceErrorMessageBox",
        onClose: () => {
          messageOpen = false;
        }
      });
      messageOpen = true;
    },
    onSelectionChange(event) {
      const listItem = event.getParameter("listItem");
      this._setDetailArea(listItem.getBindingContext());
    },
    /* =========================================================== */
    /*           end: event handlers                               */
    /* =========================================================== */
    /**
     * Convenience method for retrieving a translatable text.
     */
    _getText(textId, args) {
      const bundle = this.getOwnerComponent().getModel("i18n").getResourceBundle();
      return bundle.getText(textId, args);
    },
    /**
     * Set hasUIChanges flag in View Model
     * @param bHasUIChanges - set or clear hasUIChanges; if undefined, the hasPendingChanges-function
     * of the OdataV4 model determines the result
     */
    _setUIChanges(hasUIChanges) {
      if (this._bTechnicalErrors) {
        // If there is currently a technical error, then force 'true'.
        hasUIChanges = true;
      } else if (hasUIChanges === undefined) {
        hasUIChanges = this.getView().getModel().hasPendingChanges();
      }
      const model = this.getView().getModel("appView");
      model.setProperty("/hasUIChanges", hasUIChanges);
    },
    /**
     * Set busy flag in View Model
     */
    _setBusy(isBusy) {
      const model = this.getView().getModel("appView");
      model.setProperty("/busy", isBusy);
    },
    /**
     * Toggles the visibility of the detail area
     * @param oUserContext - the current user context
     */
    _setDetailArea(userContext) {
      const detailArea = this.byId("detailArea");
      const layout = this.byId("defaultLayout");
      const searchField = this.byId("searchField");
      if (!detailArea) {
        return; // do nothing during view destruction
      }
      detailArea.setBindingContext(userContext || null);
      // resize view
      detailArea.setVisible(!!userContext);
      layout.setSize(userContext ? "60%" : "100%");
      layout.setResizable(!!userContext);
      searchField.setWidth(userContext ? "40%" : "20%");
    }
  });
  return App;
});

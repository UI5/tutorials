sap.ui.define(["sap/ui/core/Messaging", "sap/ui/core/mvc/Controller", "sap/m/MessageToast", "sap/m/MessageBox", "sap/ui/model/Sorter", "sap/ui/model/Filter", "sap/ui/model/FilterOperator", "sap/ui/model/FilterType", "sap/ui/model/json/JSONModel"], function (Messaging, Controller, MessageToast, MessageBox, Sorter, Filter, FilterOperator, FilterType, JSONModel) {
  "use strict";

  /**
   * @namespace ui5.tutorial.odatav4.controller
   */
  const App = Controller.extend("ui5.tutorial.odatav4.controller.App", {
    constructor: function constructor() {
      Controller.prototype.constructor.apply(this, arguments);
      this._bTechnicalErrors = false;
    },
    /**
     *  Hook for initializing the controller
     */
    onInit: function _onInit() {
      const messageModel = Messaging.getMessageModel();
      const messageModelBinding = messageModel.bindList("/", undefined, [], new Filter("technical", FilterOperator.EQ, true));
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
    },
    /* =========================================================== */
    /*           begin: event handlers                             */
    /* =========================================================== */
    /**
     * Create a new entry.
     */
    onCreate: function _onCreate() {
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
     * Lock UI when changing data in the input controls
     */
    onInputChange: function _onInputChange(evt) {
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
    onRefresh: function _onRefresh() {
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
    onResetChanges: function _onResetChanges() {
      this.byId("peopleList").getBinding("items").resetChanges();
      // If there were technical errors, cancelling changes resets them.
      this._bTechnicalErrors = false;
      this._setUIChanges(false);
    },
    /**
     * Save changes to the source.
     */
    onSave: function _onSave() {
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
    onSearch: function _onSearch() {
      const view = this.getView();
      const value = view.byId("searchField").getValue();
      const filter = new Filter("LastName", FilterOperator.Contains, value);
      view.byId("peopleList").getBinding("items").filter(filter, FilterType.Application);
    },
    /**
     * Sort the table according to the last name.
     * Cycles between the three sorting states "none", "ascending" and "descending"
     */
    onSort: function _onSort() {
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
    onMessageBindingChange: function _onMessageBindingChange(event) {
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
    /* =========================================================== */
    /*           end: event handlers                               */
    /* =========================================================== */
    /**
     * Convenience method for retrieving a translatable text.
     */
    _getText: function _getText(textId, args) {
      const bundle = this.getOwnerComponent().getModel("i18n").getResourceBundle();
      return bundle.getText(textId, args);
    },
    /**
     * Set hasUIChanges flag in View Model
     * @param bHasUIChanges - set or clear hasUIChanges; if undefined, the hasPendingChanges-function
     * of the OdataV4 model determines the result
     */
    _setUIChanges: function _setUIChanges(hasUIChanges) {
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
    _setBusy: function _setBusy(isBusy) {
      const model = this.getView().getModel("appView");
      model.setProperty("/busy", isBusy);
    }
  });
  return App;
});
//# sourceMappingURL=App-dbg.controller.js.map

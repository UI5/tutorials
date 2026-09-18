sap.ui.define(["sap/m/ViewSettingsDialog", "sap/m/ViewSettingsItem", "ui5/tutorial/navigation/controller/BaseController", "sap/ui/model/Filter", "sap/ui/model/FilterOperator", "sap/ui/model/Sorter"], function (ViewSettingsDialog, ViewSettingsItem, __BaseController, Filter, FilterOperator, Sorter) {
  "use strict";

  function _interopRequireDefault(obj) {
    return obj && obj.__esModule && typeof obj.default !== "undefined" ? obj.default : obj;
  }
  const BaseController = _interopRequireDefault(__BaseController);
  /**
   * @namespace ui5.tutorial.navigation.controller.employee.overview
   */
  const EmployeeOverviewContent = BaseController.extend("ui5.tutorial.navigation.controller.employee.overview.EmployeeOverviewContent", {
    constructor: function constructor() {
      BaseController.prototype.constructor.apply(this, arguments);
      this.sortField = null;
      this.sortDescending = false;
      this.validSortFields = ["EmployeeID", "FirstName", "LastName"];
      this.searchQuery = null;
      this.routerArgs = null;
    },
    onInit: function _onInit() {
      const router = this.getRouter();
      this.table = this.byId("employeesTable");
      this._initViewSettingsDialog();

      // make the search bookmarkable
      router.getRoute("employeeOverview").attachMatched(this._onRouteMatched, this);
    },
    _onRouteMatched: function _onRouteMatched(event) {
      // save the current query state
      this.routerArgs = event.getParameter("arguments");
      this.routerArgs["?query"] ||= {};
      const queryParameter = this.routerArgs["?query"];

      // search/filter via URL hash
      this._applySearchFilter(queryParameter.search);

      // sorting via URL hash
      this._applySorter(queryParameter.sortField, queryParameter.sortDescending);
    },
    onSortButtonPressed: function _onSortButtonPressed() {
      this.viewSettingsDialog.open();
    },
    onSearchEmployeesTable: function _onSearchEmployeesTable(event) {
      const router = this.getRouter();

      // update the hash with the current search term
      this.routerArgs["?query"].search = event.getSource().getValue();
      router.navTo("employeeOverview", this.routerArgs, true /*no history*/);
    },
    _initViewSettingsDialog: function _initViewSettingsDialog() {
      const router = this.getRouter();
      this.viewSettingsDialog = new ViewSettingsDialog("vsd", {
        confirm: event => {
          const sortItem = event.getParameter("sortItem");
          this._applySorter(sortItem.getKey(), event.getParameter("sortDescending"));
          this.routerArgs["?query"].sortField = sortItem.getKey();
          this.routerArgs["?query"].sortDescending = event.getParameter("sortDescending");
          router.navTo("employeeOverview", this.routerArgs, true /*without history*/);
        }
      });

      // init sorting (with simple sorters as custom data for all fields)
      this.viewSettingsDialog.addSortItem(new ViewSettingsItem({
        key: "EmployeeID",
        text: "Employee ID",
        selected: true // by default the MockData is sorted by EmployeeID
      }));
      this.viewSettingsDialog.addSortItem(new ViewSettingsItem({
        key: "FirstName",
        text: "First Name",
        selected: false
      }));
      this.viewSettingsDialog.addSortItem(new ViewSettingsItem({
        key: "LastName",
        text: "Last Name",
        selected: false
      }));
    },
    _applySearchFilter: function _applySearchFilter(searchQuery) {
      // first check if we already have this search value
      if (this.searchQuery === searchQuery) {
        return;
      }
      this.searchQuery = searchQuery;
      this.byId("searchField").setValue(searchQuery);
      let filter = null;

      // add filters for search
      if (searchQuery?.length > 0) {
        const filters = [];
        filters.push(new Filter("FirstName", FilterOperator.Contains, searchQuery));
        filters.push(new Filter("LastName", FilterOperator.Contains, searchQuery));
        filter = new Filter({
          filters: filters,
          and: false
        }); // OR filter
      }

      // update list binding
      const binding = this.table.getBinding("items");
      binding.filter(filter, "Application");
    },
    /**
     * Applies sorting on our table control.
     * @param {string} fieldName the name of the field used for sorting
     * @param {boolean} sortDescending whether to sort descending
     * @private
     */
    _applySorter: function _applySorter(fieldName, sortDescending) {
      // only continue if we have a valid sort field
      if (fieldName && this.validSortFields.includes(fieldName)) {
        // sort only if the sorter has changed
        if (this.sortField && this.sortField === fieldName && this.sortDescending === sortDescending) {
          return;
        }
        this.sortField = fieldName;
        this.sortDescending = sortDescending;
        const sorter = new Sorter(fieldName, sortDescending);

        // sync with View Settings Dialog
        this._syncViewSettingsDialogSorter(fieldName, sortDescending);
        const binding = this.table.getBinding("items");
        binding.sort(sorter);
      }
    },
    _syncViewSettingsDialogSorter: function _syncViewSettingsDialogSorter(sortField, sortDescending) {
      // the possible keys are: "EmployeeID" | "FirstName" | "LastName"
      // Note: no input validation is implemented here
      this.viewSettingsDialog.setSelectedSortItem(sortField);
      this.viewSettingsDialog.setSortDescending(sortDescending);
    }
  });
  return EmployeeOverviewContent;
});
//# sourceMappingURL=EmployeeOverviewContent-dbg.controller.js.map

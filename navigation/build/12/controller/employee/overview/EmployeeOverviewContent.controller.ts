import SearchField, { SearchField$SearchEvent } from "sap/m/SearchField";
import Table from "sap/m/Table";
import ViewSettingsDialog, { ViewSettingsDialog$ConfirmEvent } from "sap/m/ViewSettingsDialog";
import ViewSettingsItem from "sap/m/ViewSettingsItem";
import BaseController from "ui5/tutorial/navigation/controller/BaseController";
import Filter from "sap/ui/model/Filter";
import FilterOperator from "sap/ui/model/FilterOperator";
import ListBinding from "sap/ui/model/ListBinding";
import Sorter from "sap/ui/model/Sorter";
import { Route$MatchedEvent } from "sap/ui/core/routing/Route";

/**
 * @namespace ui5.tutorial.navigation.controller.employee.overview
 */
export default class EmployeeOverviewContent extends BaseController {

  private table: Table;
  private viewSettingsDialog: ViewSettingsDialog;
  private sortField: string | null = null;
  private sortDescending: boolean = false;
  private validSortFields: string[] = ["EmployeeID", "FirstName", "LastName"];
  private searchQuery: string | null = null;
  private routerArgs: any = null;

  public onInit(): void {
    const router = this.getRouter();

    this.table = (<Table> this.byId("employeesTable"));
    this._initViewSettingsDialog();

    // make the search bookmarkable
    router.getRoute("employeeOverview").attachMatched(this._onRouteMatched, this);
  }

  private _onRouteMatched(event: Route$MatchedEvent): void {
    // save the current query state
    this.routerArgs = event.getParameter("arguments");
    this.routerArgs["?query"] ||= {};

    // search/filter via URL hash
    this._applySearchFilter(this.routerArgs["?query"].search);
  }

  public onSortButtonPressed(): void {
    this.viewSettingsDialog.open();
  }

  public onSearchEmployeesTable(event: SearchField$SearchEvent): void {
    const router = this.getRouter();

    // update the hash with the current search term
    this.routerArgs["?query"].search = event.getSource().getValue();
    router.navTo("employeeOverview", this.routerArgs, true /*no history*/);
  }

  private _initViewSettingsDialog(): void {
    this.viewSettingsDialog = new ViewSettingsDialog("vsd", {
      confirm: (event: ViewSettingsDialog$ConfirmEvent) => {
        const sortItem = event.getParameter("sortItem");

        this._applySorter(sortItem.getKey(), event.getParameter("sortDescending"));
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
  }

  private _applySearchFilter(searchQuery: string): void {
    // first check if we already have this search value
    if (this.searchQuery === searchQuery) {
      return;
    }
    this.searchQuery = searchQuery;
    (<SearchField> this.byId("searchField")).setValue(searchQuery);

    let filter: Filter | null = null;

    // add filters for search
    if (searchQuery?.length > 0) {
      const filters: Filter[] = [];

      filters.push(new Filter("FirstName", FilterOperator.Contains, searchQuery));
      filters.push(new Filter("LastName", FilterOperator.Contains, searchQuery));
      filter = new Filter({ filters: filters, and: false }); // OR filter
    }

    // update list binding
    const binding = (<ListBinding> this.table.getBinding("items"));
    binding.filter(filter, "Application");
  }

  /**
   * Applies sorting on our table control.
   * @param {string} fieldName the name of the field used for sorting
   * @param {boolean} sortDescending whether to sort descending
   * @private
   */
  private _applySorter(fieldName: string, sortDescending: boolean): void {
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

      const binding = (<ListBinding> this.table.getBinding("items"));
      binding.sort(sorter);
    }
  }

  private _syncViewSettingsDialogSorter(sortField: string, sortDescending: boolean): void {
    // the possible keys are: "EmployeeID" | "FirstName" | "LastName"
    // Note: no input validation is implemented here
    this.viewSettingsDialog.setSelectedSortItem(sortField);
    this.viewSettingsDialog.setSortDescending(sortDescending);
  }
}

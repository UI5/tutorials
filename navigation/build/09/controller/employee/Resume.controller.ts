import { IconTabBar$SelectEvent } from "sap/m/IconTabBar";
import BaseController from "ui5/tutorial/navigation/controller/BaseController";
import { Route$MatchedEvent } from "sap/ui/core/routing/Route";
import JSONModel from "sap/ui/model/json/JSONModel";

const validTabKeys = ["Info", "Projects", "Hobbies", "Notes"];

/**
 * @namespace ui5.tutorial.navigation.controller.employee
 */
export default class Resume extends BaseController {

  public onInit(): void {
    const router = this.getRouter();

    this.getView().setModel(new JSONModel(), "view");
    router.getRoute("employeeResume").attachMatched(this._onRouteMatched, this);
  }

  private _onRouteMatched(event: Route$MatchedEvent): void {
    const eventArguments = (<any> event.getParameter("arguments"));
    const view = this.getView();

    view.bindElement({
      path: "/Employees(" + eventArguments.employeeId + ")",
      events: {
        change: this._onBindingChange.bind(this),
        dataRequested: () => {
          view.setBusy(true);
        },
        dataReceived: () => {
          view.setBusy(false);
        }
      }
    });

    const query = eventArguments["?query"];

    if (query && validTabKeys.includes(query.tab)) {
      (<JSONModel> view.getModel("view")).setProperty("/selectedTabKey", query.tab);
    } else {
      // the default query param should be visible at all time
      this.getRouter().navTo("employeeResume", {
        employeeId: eventArguments.employeeId,
        "?query": {
          tab: validTabKeys[0]
        }
      }, true /*no history*/);
    }
  }

  private _onBindingChange(): void {
    // No data for the binding
    if (!this.getView().getBindingContext()) {
      this.getRouter().getTargets().display("notFound");
    }
  }

  /**
   * We use this event handler to update the hash in case a new tab is selected.
   * @param event
   */
  public onTabSelect(event: IconTabBar$SelectEvent): void {
    const context = this.getView().getBindingContext();

    this.getRouter().navTo("employeeResume", {
      employeeId: context.getProperty("EmployeeID"),
      "?query": {
        tab: event.getParameter("selectedKey")
      }
    }, true /*without history*/);
  }
}

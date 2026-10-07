import BaseController from "ui5/tutorial/navigation/controller/BaseController";
import { Route$MatchedEvent } from "sap/ui/core/routing/Route";

/**
 * @namespace ui5.tutorial.navigation.controller.employee
 */
export default class Employee extends BaseController {

  public onInit(): void {
    const router = this.getRouter();

    router.getRoute("employee").attachMatched(this._onRouteMatched, this);
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
  }

  private _onBindingChange(): void {
    // No data for the binding
    if (!this.getView().getBindingContext()) {
      this.getRouter().getTargets().display("notFound");
    }
  }

  public onShowResume(): void {
    const context = this.getView().getBindingContext();

    this.getRouter().navTo("employeeResume", {
      employeeId: context.getProperty("EmployeeID")
    });
  }
}

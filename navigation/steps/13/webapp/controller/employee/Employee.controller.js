sap.ui.define(["ui5/tutorial/navigation/controller/BaseController"], function (BaseController) {
  "use strict";

  const Employee = BaseController.extend("ui5.tutorial.navigation.controller.employee.Employee", {
    onInit() {
      const router = this.getRouter();
      router.getRoute("employee").attachMatched(this._onRouteMatched, this);
    },
    _onRouteMatched(event) {
      const eventArguments = event.getParameter("arguments");
      const view = this.getView();
      view.bindElement({
        path: "/Employees(" + eventArguments.employeeId + ")",
        events: {
          change: this._onBindingChange.bind(this),
          dataRequested: function () {
            view.setBusy(true);
          },
          dataReceived: function () {
            view.setBusy(false);
          }
        }
      });
    },
    _onBindingChange() {
      // No data for the binding
      if (!this.getView().getBindingContext()) {
        this.getRouter().getTargets().display("notFound");
      }
    },
    onShowResume() {
      const context = this.getView().getBindingContext();
      this.getRouter().navTo("employeeResume", {
        employeeId: context.getProperty("EmployeeID")
      });
    }
  });
  return Employee;
});

sap.ui.define(["ui5/tutorial/navigation/controller/BaseController"], function (BaseController) {
  "use strict";

  const Resume = BaseController.extend("ui5.tutorial.navigation.controller.employee.Resume", {
    onInit() {
      const router = this.getRouter();
      router.getRoute("employeeResume").attachMatched(this._onRouteMatched, this);
    },
    _onRouteMatched(event) {
      const eventArguments = event.getParameter("arguments");
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
    },
    _onBindingChange() {
      // No data for the binding
      if (!this.getView().getBindingContext()) {
        this.getRouter().getTargets().display("notFound");
      }
    }
  });
  return Resume;
});

sap.ui.define(["ui5/tutorial/navigation/controller/BaseController", "sap/ui/model/json/JSONModel"], function (BaseController, JSONModel) {
  "use strict";

  const validTabKeys = ["Info", "Projects", "Hobbies", "Notes"];

  const Resume = BaseController.extend("ui5.tutorial.navigation.controller.employee.Resume", {
    onInit() {
      const router = this.getRouter();
      this.getView().setModel(new JSONModel(), "view");
      router.getRoute("employeeResume").attachMatched(this._onRouteMatched, this);
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
      const query = eventArguments["?query"];
      if (query && validTabKeys.includes(query.tab)) {
        view.getModel("view").setProperty("/selectedTabKey", query.tab);
        // support lazy loading for the hobbies and notes tab
        if (query.tab === "Hobbies" || query.tab === "Notes") {
          // the target is either "resumeTabHobbies" or "resumeTabNotes"
          this.getRouter().getTargets().display("resumeTab" + query.tab);
        }
      } else {
        // the default query param should be visible at all time
        this.getRouter().navTo("employeeResume", {
          employeeId: eventArguments.employeeId,
          "?query": {
            tab: validTabKeys[0]
          }
        }, true /*no history*/);
      }
    },
    _onBindingChange() {
      // No data for the binding
      if (!this.getView().getBindingContext()) {
        this.getRouter().getTargets().display("notFound");
      }
    },
    /**
     * We use this event handler to update the hash in case a new tab is selected.
     * @param event
     */
    onTabSelect(event) {
      const context = this.getView().getBindingContext();
      this.getRouter().navTo("employeeResume", {
        employeeId: context.getProperty("EmployeeID"),
        "?query": {
          tab: event.getParameter("selectedKey")
        }
      }, true /*without history*/);
    }
  });
  return Resume;
});

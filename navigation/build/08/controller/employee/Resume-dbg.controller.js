sap.ui.define(["ui5/tutorial/navigation/controller/BaseController"], function (__BaseController) {
  "use strict";

  function _interopRequireDefault(obj) {
    return obj && obj.__esModule && typeof obj.default !== "undefined" ? obj.default : obj;
  }
  const BaseController = _interopRequireDefault(__BaseController);
  /**
   * @namespace ui5.tutorial.navigation.controller.employee
   */
  const Resume = BaseController.extend("ui5.tutorial.navigation.controller.employee.Resume", {
    onInit: function _onInit() {
      const router = this.getRouter();
      router.getRoute("employeeResume").attachMatched(this._onRouteMatched, this);
    },
    _onRouteMatched: function _onRouteMatched(event) {
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
    _onBindingChange: function _onBindingChange() {
      // No data for the binding
      if (!this.getView().getBindingContext()) {
        this.getRouter().getTargets().display("notFound");
      }
    }
  });
  return Resume;
});
//# sourceMappingURL=Resume-dbg.controller.js.map

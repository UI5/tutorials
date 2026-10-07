sap.ui.define(["ui5/tutorial/navigation/controller/BaseController"], function (__BaseController) {
  "use strict";

  function _interopRequireDefault(obj) {
    return obj && obj.__esModule && typeof obj.default !== "undefined" ? obj.default : obj;
  }
  const BaseController = _interopRequireDefault(__BaseController);
  /**
   * @namespace ui5.tutorial.navigation.controller
   */
  const Home = BaseController.extend("ui5.tutorial.navigation.controller.Home", {
    onDisplayNotFound: function _onDisplayNotFound() {
      // display the "notFound" target without changing the hash
      this.getRouter().getTargets().display("notFound", {
        fromTarget: "home"
      });
    },
    onNavToEmployees: function _onNavToEmployees() {
      this.getRouter().navTo("employeeList");
    },
    onNavToEmployeeOverview: function _onNavToEmployeeOverview() {
      this.getRouter().navTo("employeeOverview");
    }
  });
  return Home;
});
//# sourceMappingURL=Home-dbg.controller.js.map

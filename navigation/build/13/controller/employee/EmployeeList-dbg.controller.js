sap.ui.define(["ui5/tutorial/navigation/controller/BaseController"], function (__BaseController) {
  "use strict";

  function _interopRequireDefault(obj) {
    return obj && obj.__esModule && typeof obj.default !== "undefined" ? obj.default : obj;
  }
  const BaseController = _interopRequireDefault(__BaseController);
  /**
   * @namespace ui5.tutorial.navigation.controller.employee
   */
  const EmployeeList = BaseController.extend("ui5.tutorial.navigation.controller.employee.EmployeeList", {
    onListItemPressed: function _onListItemPressed(event) {
      const listItem = event.getSource();
      const context = listItem.getBindingContext();
      this.getRouter().navTo("employee", {
        employeeId: context.getProperty("EmployeeID")
      });
    }
  });
  return EmployeeList;
});
//# sourceMappingURL=EmployeeList-dbg.controller.js.map

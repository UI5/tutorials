sap.ui.define(["ui5/tutorial/navigation/controller/BaseController"], function (BaseController) {
  "use strict";

  const EmployeeList = BaseController.extend("ui5.tutorial.navigation.controller.employee.EmployeeList", {
    onListItemPressed(event) {
      const listItem = event.getSource();
      const context = listItem.getBindingContext();
      this.getRouter().navTo("employee", {
        employeeId: context.getProperty("EmployeeID")
      });
    }
  });
  return EmployeeList;
});

import StandardListItem from "sap/m/StandardListItem";
import BaseController from "ui5/tutorial/navigation/controller/BaseController";
import Event from "sap/ui/base/Event";

/**
 * @namespace ui5.tutorial.navigation.controller.employee
 */
export default class EmployeeList extends BaseController {

  public onListItemPressed(event: Event): void {
    const listItem = (<StandardListItem> event.getSource());
    const context = listItem.getBindingContext();

    this.getRouter().navTo("employee", {
      employeeId: context.getProperty("EmployeeID")
    });
  }
}

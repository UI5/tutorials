import BaseController from "ui5/tutorial/navigation/controller/BaseController";

/**
 * @namespace ui5.tutorial.navigation.controller
 */
export default class Home extends BaseController {

  public onDisplayNotFound(): void {
    // display the "notFound" target without changing the hash
    this.getRouter().getTargets().display("notFound", {
      fromTarget: "home"
    });
  }

  public onNavToEmployees(): void {
    this.getRouter().navTo("employeeList");
  }
}

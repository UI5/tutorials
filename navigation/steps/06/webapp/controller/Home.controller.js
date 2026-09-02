sap.ui.define(["ui5/tutorial/navigation/controller/BaseController"], function (BaseController) {
  "use strict";

  const Home = BaseController.extend("ui5.tutorial.navigation.controller.Home", {
    onDisplayNotFound() {
      // display the "notFound" target without changing the hash
      this.getRouter().getTargets().display("notFound", {
        fromTarget: "home"
      });
    },
    onNavToEmployees() {
      this.getRouter().navTo("employeeList");
    }
  });
  return Home;
});

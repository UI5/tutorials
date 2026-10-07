sap.ui.define(["ui5/tutorial/navigation/controller/BaseController"], function (BaseController) {
  "use strict";

  const NotFound = BaseController.extend("ui5.tutorial.navigation.controller.NotFound", {
    onInit() {
      const router = this.getRouter();
      const target = router.getTarget("notFound");
      target.attachDisplay(event => {
        this.data = event.getParameter("data"); // store the data
      }, this);
    },
    // override the parent's onNavBack (inherited from BaseController)
    onNavBack() {
      // in some cases we could display a certain target when the back button is pressed
      if (this.data?.fromTarget) {
        this.getRouter().getTargets().display(this.data.fromTarget);
        delete this.data.fromTarget;
        return;
      }

      // call the parent's onNavBack
      BaseController.prototype.onNavBack.call(this);
    }
  });
  return NotFound;
});

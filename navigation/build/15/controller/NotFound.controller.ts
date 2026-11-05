import BaseController from "ui5/tutorial/navigation/controller/BaseController";
import Target, { Target$DisplayEvent } from "sap/ui/core/routing/Target";

/**
 * @namespace ui5.tutorial.navigation.controller
 */
export default class NotFound extends BaseController {

  private data: any;

  public onInit(): void {
    const router = this.getRouter();
    const target = (<Target> router.getTarget("notFound"));

    target.attachDisplay((event: Target$DisplayEvent) => {
      this.data = event.getParameter("data"); // store the data
    }, this);
  }

  // override the parent's onNavBack (inherited from BaseController)
  public onNavBack(): void {
    // in some cases we could display a certain target when the back button is pressed
    if (this.data?.fromTarget) {
      this.getRouter().getTargets().display(this.data.fromTarget);
      delete this.data.fromTarget;

      return;
    }

    // call the parent's onNavBack
    super.onNavBack();
  }
}

import Controller from "sap/ui/core/mvc/Controller";
import History from "sap/ui/core/routing/History";
import Router from "sap/ui/core/routing/Router";
import UIComponent from "sap/ui/core/UIComponent";

/**
 * @namespace ui5.tutorial.navigation.controller
 */
export default class BaseController extends Controller {

  public getRouter(): Router {
    return UIComponent.getRouterFor(this);
  }

  public onNavBack(): void {
    const history = History.getInstance();
    const previousHash = history.getPreviousHash();

    if (previousHash !== undefined) {
      window.history.go(-1);
    } else {
      this.getRouter().navTo("appHome", {}, true /*no history*/);
    }
  }
}

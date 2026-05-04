import MessageToast from "sap/m/MessageToast";
import Controller from "sap/ui/core/mvc/Controller";
import JSONModel from "sap/ui/model/json/JSONModel";

/**
 * @name ui5.walkthrough.controller.App
 */
export default class AppController extends Controller {
    onInit(): void {
        // set data model on view
        const data = {
           recipient: {
              name: "World"
           }
        };
        const dataModel = new JSONModel(data);

        this.getView()?.setModel(dataModel);
    }

    onShowHello(): void {
        MessageToast.show("Hello World");
     }
};

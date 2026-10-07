import ResourceBundle from "sap/base/i18n/ResourceBundle";
import { URLHelper } from "sap/m/library";
import { ListItemBase$DetailPressEvent } from "sap/m/ListItemBase";
import ObjectAttribute from "sap/m/ObjectAttribute";
import ObjectListItem from "sap/m/ObjectListItem";
import StandardListItem from "sap/m/StandardListItem";
import Control from "sap/ui/core/Control";
import Controller from "sap/ui/core/mvc/Controller";
import Context from "sap/ui/model/Context";
import ResourceModel from "sap/ui/model/resource/ResourceModel";
import Currency from "sap/ui/model/type/Currency";

/**
 * @namespace ui5.tutorial.databinding.controller
 */
export default class App extends Controller {
  public async formatMail(firstName: string, lastName: string): Promise<string> {
    const bundle: ResourceBundle = await (this.getView().getModel("i18n") as ResourceModel).getResourceBundle() as ResourceBundle;

    return URLHelper.normalizeEmail(
      `${firstName}.${lastName}@example.com`,
      bundle.getText("mailSubject", [firstName]),
      bundle.getText("mailBody")
    );
  }

  public formatStockValue(unitPrice: number, stockLevel: number, currencyCode: string): string {
    const currency: Currency = new Currency();
    return currency.formatValue([unitPrice * stockLevel, currencyCode], "string");
  }

  public onItemSelected(event: ListItemBase$DetailPressEvent): void {
    const bindingPath: string = (event.getSource() as ObjectListItem).getBindingContext("products").getPath();
    this.byId("productDetailsPanel")?.bindElement({ path: bindingPath, model: "products" });
  }

  public productListFactory(id: string, context: Context): Control {
    let uiControl;
    // Decide based on the data which dependent to clone
    if (context.getProperty("UnitsInStock") === 0 && context.getProperty("Discontinued")) {
      // The item is discontinued, so use a StandardListItem
      uiControl = (this.byId("productSimple") as StandardListItem).clone(id);
    } else {
      // The item is available, so we will create an ObjectListItem
      uiControl = (this.byId("productExtended") as ObjectListItem).clone(id);

      // The item is temporarily out of stock, so we will add a status
      if (context.getProperty("UnitsInStock") < 1) {
        uiControl.addAttribute(new ObjectAttribute({
          text : {
            path: "i18n>outOfStock"
          }
        }));
      }
    }

    return uiControl;
  }
}

import ResourceBundle from "sap/base/i18n/ResourceBundle";
import { URLHelper } from "sap/m/library";
import Controller from "sap/ui/core/mvc/Controller";
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

  public formatStockValue(unitPrice: float, stockLevel: number, currencyCode: string): string {
    const currency: Currency = new Currency();
    return currency.formatValue([unitPrice * stockLevel, currencyCode], "string");
  }
}

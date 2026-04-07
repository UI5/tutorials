## Step 24: Sorting and Grouping

To make our list of invoices even more user-friendly, we sort it alphabetically instead of just showing the order from the data model. Additionally, we introduce groups and add the company that ships the products so that the data is easier to consume.

&nbsp;

***

### Preview
  

![](assets/loio33f71b44bb644d1fa2a0ab14f1fcc02a_LowRes.png "The list is now sorted and grouped by the shipping company")

<sup>*The list is now sorted and grouped by the shipping company*</sup>

You can access the live preview by clicking on this link: [🔗 Live Preview of Step 24](https://sap-samples.github.io/ui5-typescript-walkthrough/walkthrough/build/24/index-cdn.html).

***

### Coding

<details class="ts-only">

You can download the solution for this step here: [📥 Download step 24](https://sap-samples.github.io/ui5-typescript-walkthrough/walkthrough/walkthrough-step-24.zip).

</details>

<details class="js-only">

You can download the solution for this step here: [📥 Download step 24](https://sap-samples.github.io/ui5-typescript-walkthrough/walkthrough/walkthrough-step-24-js.zip).

</details>
***

### webapp/view/InvoiceList.view.xml

We add a declarative sorter to the binding syntax of the list control. Therefore, we transform the simple binding syntax to the object notation, specify the path to the data, and now add an additional `sorter` property. In the path of the sorter, we specify that the invoice items should be sorted by Product Name, and OpenUI5 will take care of the rest. 

```xml
<mvc:View
   controllerName="ui5.walkthrough.controller.InvoiceList"
   xmlns="sap.m"
   xmlns:mvc="sap.ui.core.mvc">
   <List
      id="invoiceList"
      class="sapUiResponsiveMargin"
      width="auto"
      items="{
         path: 'invoice>/Invoices',
         sorter: {
				path: 'ProductName',
			}
      }" >
      ...
</mvc:View>
```

By default, the sorting is ascending, but you could also add a property `descending` with the value `true` inside the sorter property to change the sorting order.
  
If we run the app now we can see a list of invoices sorted by the name of the products.

### webapp/view/InvoiceList.view.xml

We modify the view and change the sorter so the path addresses to the `ShipperName` data field instead of `ProductName`. This groups the invoice items by the shipping company. In addition set the sorter attribute `group` to true.

As with the sorter, no further action is required. The list and the data binding features of OpenUI5 will do the trick to display group headers automatically and categorize the items in the groups.

```xml
<mvc:View
   controllerName="ui5.walkthrough.controller.InvoiceList"
   xmlns="sap.m"
   xmlns:mvc="sap.ui.core.mvc">
   <List
      id="invoiceList"
      class="sapUiResponsiveMargin"
      width="auto"
      items="{
         path: 'invoice>/Invoices',
         sorter: {
				path: 'ShipperName',
				group: true
			}
      }" >
      ...
```    
  
We could define a custom group header factory if we wanted by setting the `groupHeaderFactory` property, but the result looks already fine.

&nbsp; 

***

**Next:** [Step 25: Remote OData Service](../25/README.md "So far we have worked with local JSON data, but now we will access a real OData service to visualize remote data.")

**Previous:** [Step 23: Remote OData Service](../23/README.md "In this step, we add a search field for our product list and define a filter that represents the search term. When searching, the list is automatically updated to show only the items that match the search term.")

***

**Related Information**  

[API Reference: `sap.ui.model.Sorter`](https://sdk.openui5.org/#/api/sap.ui.model.Sorter)

[Sample: List - Grouping](https://sdk.openui5.org/#/entity/sap.m.List/sample/sap.m.sample.ListGrouping)

## Step 31: Routing with Parameters

We can now navigate between the overview and the detail page, but the actual item that we selected in the overview is not displayed on the detail page yet. A typical use case for our app is to show additional information for the selected item on the detail page.

To make this work, we have to pass over the information which item has been selected to the detail page and show the details for the item there.

&nbsp;

***

### Preview
  
  
![](assets/loio31da9d48ae204c36a991146b90648c21_LowRes.png "The selected invoice details are now shown in the details page")

<sup>*The selected invoice details are now shown in the details page*</sup>

You can access the live preview by clicking on this link: [🔗 Live Preview of Step 31](https://ui5.github.io/tutorials/walkthrough/build/31/test/mockServer-cdn.html).

***

### Coding

<details class="ts-only" markdown="1">

You can download the solution for this step here: [📥 Download step 31](https://ui5.github.io/tutorials/walkthrough/walkthrough-step-31.zip).

</details>

<details class="js-only" markdown="1">

You can download the solution for this step here: [📥 Download step 31](https://ui5.github.io/tutorials/walkthrough/walkthrough-step-31-js.zip).

</details>

***

### webapp/manifest.json

We want to hand over the information for the selected item when navigating to the detail view. To achieve that, we add the navigation parameter `invoicePath` to the detail route in the app descriptor. There, we add a navigation parameter `invoicePath` to the detail route so that we can hand over the information for the selected item to the detail page.

> 📝 **Note:** <br>
> Mandatory navigation parameters are defined with curly brackets.

```json
{
  	…
    "sap.ui5": {
		…
        "routing": {
          "config": {
            "routerClass": "sap.m.routing.Router",
            "type": "View",
            "viewType": "XML",
            "path": "ui5.walkthrough.view",
            "controlId": "app",
            "controlAggregation": "pages"
          },
          "routes": [
            {
              "pattern": "",
              "name": "overview",
              "target": "overview"
            },
            {
              "pattern": "detail/{invoicePath}",
              "name": "detail",
              "target": "detail"
            }
          ],
          "targets": {
            "overview": {
              "id": "overview",
              "name": "Overview"
            },
            "detail": {
              "id": "detail",
              "name": "Detail"
            }
          }
        }
    }
}
```

### webapp/controller/InvoiceList.controller.?s

In the controller for the invoice list view, we extend the `onPress` event handler in such a way, it not only triggers the navigation to the detail view but also passes the selected item to the routing.

For that we have to pass the event object to our `onPress` method. This way we get access to the information about the event that occurred. By calling the `getSource` method we retrieve the source of the event. This method is available for all OpenUI5 events. In our case it will return the `ObjectListItem` that has been clicked. We use it to pass the information of the clicked item to the detail page so that the same item can be displayed there.

In the `navTo` method we now add a configuration object to fill the navigation parameter `invoicePath` with the current information of the item. This will update the URL and navigate to the detail view at the same time. On the detail page, we can access this navigation parameter again and display the corresponding item.

Typically we woudl use the key of the item in the back-end system to identify the selected object, because it is short and precise. For our invoice items however, we do not have a simple key. Therefore we directly use the binding path to keep the example short and simple. The path to the item is part of the binding context which is a helper object of OpenUI5 to manage the binding information for controls. The binding context can be accessed by calling the `getBindingContext` method with the model name on any bound OpenUI5 control. We need to remove the first `/` from the binding path by calling `.substr(1)` on the string because this is a special character in URLs and is not allowed, we need to add it again on the detail page. Also, the binding path might contain special characters which are not allowed in URLs, so we have to encode the path with `encodeURIComponent`.


```ts
import Controller from "sap/ui/core/mvc/Controller";
import JSONModel from "sap/ui/model/json/JSONModel";
import { SearchField$SearchEvent } from "sap/m/SearchField";
import Filter from "sap/ui/model/Filter";
import FilterOperator from "sap/ui/model/FilterOperator";
import ListBinding from "sap/ui/model/ListBinding";
import Event from "sap/ui/base/Event";
import ObjectListItem from "sap/m/ObjectListItem";
import UIComponent from "sap/ui/core/UIComponent";

/**
 * @namespace ui5.walkthrough.controller
 */
export default class App extends Controller {
	
    //...

    onPress(event: Event): void {
        const item = event.getSource() as ObjectListItem;
        const router = UIComponent.getRouterFor(this);
        router.navTo("detail", {
            invoicePath: window.encodeURIComponent(item.getBindingContext("invoice").getPath().substring(1))
        });
    }     
};

```

```js
sap.ui.define(["sap/ui/core/mvc/Controller", "sap/ui/model/json/JSONModel", "sap/ui/model/Filter", "sap/ui/model/FilterOperator", "sap/ui/core/UIComponent"], function (Controller, JSONModel, Filter, FilterOperator, UIComponent) {
  "use strict";

  const App = Controller.extend("ui5.walkthrough.controller.App", {
    
    //...

    onPress(event) {
      const item = event.getSource();
      const router = UIComponent.getRouterFor(this);
      router.navTo("detail", {
        invoicePath: window.encodeURIComponent(item.getBindingContext("invoice").getPath().substring(1))
      });
    }
  });
  ;
  return App;
});

```

### webapp/controller/Detail.controller.?s \(New\)

Now we need to create a new detail controller to set the content we passed in with the URL parameter `invoicePath` on the detail view. This will allow us to access the data of the selected item and display them on the view.

In addition to the (base) controller and our local component we import the `Route$PatternMatchedEvent` type from `sap/ui/core/routing/Route`. This event is triggered whenever a route pattern is matched, so we need it to catch any navigation with route pattern "detail/{invoicePath}".

In the `onInit` method, we receive the router instance from the owner component and attach a listener to the `details` route's "patternMatched" event by calling the method `attachPatternMatched`. The `onObjectMatched` method is the event handler for the "patternMatched" event. When the `detail` route is matched, it will trigger the `onObjectMatched` method.

In the `onObjectMatched` method we bind the view's element to a specific path in the "invoice" model. We get the path from the `invoicePath` argument from the event that was set in the invoice list controller. Because we have encoded the binding path part in the URL in the invoice list controller, we have to decode it again with `decodeURIComponent` and also add the root `/` in front of the path again that was removed for passing on the path as a URL parameter.

The `bindElement` function is creating a binding context for a OpenUI5 control and receives the model name as well as the path to an item in a configuration object. This will trigger an update of the UI controls that we connected with fields of the invoice model. 


```ts
import Controller from "sap/ui/core/mvc/Controller";
import UIComponent from "sap/ui/core/UIComponent";
import { Route$PatternMatchedEvent } from "sap/ui/core/routing/Route";

/**
 * @namespace ui5.walkthrough.controller
 */
export default class Detail extends Controller {

    onInit(): void {
        const router = UIComponent.getRouterFor(this);
        router.getRoute("detail").attachPatternMatched(this.onObjectMatched, this);
    }

    onObjectMatched(event: Route$PatternMatchedEvent): void {
        this.getView().bindElement({
            path: "/" + window.decodeURIComponent( (event.getParameter("arguments") as any).invoicePath),
            model: "invoice"
        });
    }
};

```

```js
sap.ui.define(["sap/ui/core/mvc/Controller", "sap/ui/core/UIComponent"], function (Controller, UIComponent) {
  "use strict";

  const Detail = Controller.extend("ui5.walkthrough.controller.Detail", {
    onInit() {
      const router = UIComponent.getRouterFor(this);
      router.getRoute("detail").attachPatternMatched(this.onObjectMatched, this);
    },
    onObjectMatched(event) {
      this.getView().bindElement({
        path: "/" + window.decodeURIComponent(event.getParameter("arguments").invoicePath),
        model: "invoice"
      });
    }
  });
  ;
  return Detail;
});

```

### webapp/view/Detail.view.xml

Our last piece to fit the puzzle together is the detail view. We replace the app controller by the new detail controller that will take care of setting the item's context on the view and bind the properties `intro` and `title` of the `ObjectHeader` to the fields `ShipperName` and `ProductName` of our `invoice` model to display display those two fields of an invoice on the view. We could add more detailed information from the `invoice` object here, but for simplicity reasons we just display these two fields for now.

```xml
<mvc:View
	controllerName="ui5.walkthrough.controller.Detail"
	xmlns="sap.m"
	xmlns:mvc="sap.ui.core.mvc">
	<Page
		title="{i18n>detailPageTitle}">
		<ObjectHeader
			intro="{invoice>ShipperName}"
			title="{invoice>ProductName}"/>
	</Page>
</mvc:View>
```

You should now see the invoice details on a separate page when you click on an item in the list of invoices.

***
&nbsp;
### Conventions

-   Define the routing configuration in the `manifest.json` / app descriptor

-   Initialize the router at the end of your `Component#init` function

&nbsp;

***

**Next:** [Step 32: Routing Back and History](../32/README.md "Now we can navigate to our detail page and display an invoice, but we cannot go back to the overview page yet. We'll add a back button to the detail page and implement a function that shows our overview page again.")

**Previous:** [Step 30: Routing and Navigation](../30/README.md "So far, we have put all app content on one single page. As we add more and more features, we want to split the content and put it on separate pages.")

***

**Related Information**  

[Routing and Navigation](https://sdk.openui5.org/topic/3d18f20bd2294228acb6910d8e8a5fb5.html "OpenUI5 offers hash-based navigation, which allows you to build single-page apps where the navigation is done by changing the hash. In this way the browser does not have to reload the page; instead there is a callback to which the app and especially the affected view can react. A hash string is parsed and matched against patterns which will then inform the handlers.")

[Tutorial: Navigation and Routing](https://sdk.openui5.org/topic/1b6dcd39a6a74f528b27ddb22f15af0d.html "OpenUI5 comes with a powerful routing API that helps you control the state of your application efficiently. This tutorial will illustrate all major features and APIs related to navigation and routing in OpenUI5 apps by creating a simple and easy to understand mobile app. It represents a set of best practices for applying the navigation and routing features of OpenUI5 to your applications.")

[API Reference: `sap.m.routing.Router`](https://sdk.openui5.org/api/sap.m.routing.Router)

[Samples: `sap.m.routing.Router`](https://sdk.openui5.org/entity/sap.m.routing.Router)

[API Reference: `sap.m.routing.Route`](https://sdk.openui5.org/api/sap.m.routing.Route)

[Samples: `sap.m.routing.Route`](https://sdk.openui5.org/entity/sap.m.routing.Route)

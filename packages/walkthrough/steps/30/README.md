## Step 30: Routing and Navigation

So far, we have put all app content on one single page. As we add more and more features, we want to split the content and put it on separate pages.

In this step, we will use the OpenUI5 navigation features to load and show a separate detail page that we can later use to display details for an invoice. In the previous steps, we defined the page directly in the app view so that it is displayed when the app is loaded. We will now use the OpenUI5 router class to load the pages and update the URL for us automatically. We specify a routing configuration for our app and create a separate view for each page of the app, then we connect the views by triggering navigation events.

&nbsp;

***

### Preview
  
  
![](assets/loio94152a595fe24d45b12223e0abcccb9c_LowRes.png "A second page is added to display the invoice")

<sup>*A second page is added to display the invoice*</sup>

You can access the live preview by clicking on this link: [🔗 Live Preview of Step 30](https://ui5.github.io/tutorials/walkthrough/build/30/test/mockServer-cdn.html).

***


### Coding

<details class="ts-only" markdown="1">

You can download the solution for this step here: [📥 Download step 30](https://ui5.github.io/tutorials/walkthrough/walkthrough-step-30.zip).

</details>

<details class="js-only" markdown="1">

You can download the solution for this step here: [📥 Download step 30](https://ui5.github.io/tutorials/walkthrough/walkthrough-step-30-js.zip).

</details>
***

### webapp/i18n/i18n.properties

First, we add a new text value pair to our resource bundle to define a title for the new detail page we plan to create.

```ini
…
# Invoice List
invoiceListTitle=Invoices
invoiceStatusA=New
invoiceStatusB=In Progress
invoiceStatusC=Done

# Detail Page
detailPageTitle=UI5 TypeScript Walkthrough - Details
```

### webapp/view/Detail.view.xml \(New\)

Now we add the new `Detail.view.xml` file to our view folder. Beside of the the root node of the XML structure and the required namespaces, it only contains a `Page` control that displays the title we just defined in our resource boundle and an `ObjectHeader` control with a static text *Invoice* assigned to the `title` attribute (this we will change in the next step).

```xml
<mvc:View
	xmlns="sap.m"
	xmlns:mvc="sap.ui.core.mvc">
	<Page
		title="{i18n>detailPageTitle}">
		<ObjectHeader
			title="Invoice"/>
	</Page>
</mvc:View>
```

### webapp/view/Overview.view.xml \(New\)

Next, we create another view in the view folder, called `Overview.view.xml`. We add the root node of the XML structure including the required namespaces to it. Then we copy and paste from the app view everything between and including the `Page` control to our new view.

For simplicity, we reuse the controller `ui5.walkthrough.controller.App` for our new view as it only contains our helper method to open the dialog.

```xml
<mvc:View
    controllerName="ui5.walkthrough.controller.App"
    xmlns="sap.m"
    xmlns:mvc="sap.ui.core.mvc"
    displayBlock="true">
    <Page title="{i18n>homePageTitle}">
        <content>
            <mvc:XMLView viewName="ui5.walkthrough.view.HelloPanel" />
            <mvc:XMLView viewName="ui5.walkthrough.view.InvoiceList" />
        </content>
    </Page>
</mvc:View>
```
&nbsp;
As we reuse the controller `ui5.walkthrough.controller.App` for two different views \(for the new overview and for the app view\), two instances of that controller are instantiated at runtime. In general, one instance of a controller is instantiated for each view that references the controller.

### webapp/view/App.view.xml

In the app view, we now remove everything and between the control aggregation `pages` in the app view as this found its new home in the overview view we just created. We provide an `id` to the app control, as we want to use this control for our router configuration in the app descriptor in the next step.

```xml
<mvc:View
    controllerName="ui5.walkthrough.controller.App"
    xmlns="sap.m"
    xmlns:mvc="sap.ui.core.mvc"
    displayBlock="true">
    <Shell>
        <App
            class="myAppDemoWT"
            id="app"/>
    </Shell>
</mvc:View>
```

### webapp/manifest.json

We thus have everything we need to define a routing from the starting view to the details view we just defined. We want to start with the app view loading our new overview view by default and being replaced by the detail view when a specific route has been hit.

We add a new “routing" section to the `sap.ui5` part of the descriptor. There are three subsections that define the routing and navigation structure of the app:

-   `config`
    This section contains the global router configuration and default values that apply for all routes and targets. The property routerClass is special as it determines the router implementation. The default value is `sap.ui.core.routing.Router`. Here, we set the `routerClass` to `sap.m.routing.Router`, because our app is based on `sap.m`. All other properties in config are given to the router instance. For example, we define in `path` where our views are located in the app. As we want to specify view to view navigation and we only use XML views in our app we preset also the paramter `type` and `viewType`. To load and display views automatically, we also specify the `controlId` of the control that will contain the views and the aggregation (`controlAggregation`) of the control where the views will be added. Here we specify that the views are loaded into the `pages` aggregation of the control with the id we provided in the app view. 

    > 📌 **Important:**
    > The possible values for `routerClass` are `sap.ui.core.routing.Router`, `sap.m.routing.Router`, or any other subclasses of `sap.ui.core.routing.Router`. Compared to `sap.ui.core.routing.Router` the `sap.m.routing.Router` is optimized for mobile apps and adds the properties `level`, `transition` and `transitionParameters` which can be specified for each route or target created by the `sap.m.routing.Router`. 

-   `routes`
    Each route defines a name, a pattern, and one or more targets to navigate to when the route has been hit. The pattern is basically the URL part that matches to the route, we define two routes for our app. The first one is a default route that will show the overview page with the content from the previous steps, and the second is the detail route with the URL pattern `detail` that will show our new detail page.

-   `targets`
    A target defines a view, or even another component, that is displayed; it is associated with one or more routes, and it can also be displayed manually from within the app. Whenever a target is displayed, the corresponding view is loaded and shown in the app. In our app we simply define two targets with a view name that corresponds to the target name.
    
```json
{
    ...
    "sap.ui5": {
        ...
        "resources": {
            "css": [
              {
                "uri": "css/style.css"
              }
            ]
        },          
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
              "pattern": "detail",
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
&nbsp;
The router will automatically add the view that corresponds to the current URL into the app control. The router identifies the app control with the ID that corresponds to the property `controlId: “app”` in the `AppDescriptor`.

The overview view is always shown when the hash is empty. The detail view is shown when the hash matches the pattern `detail`.

> 📌 **Important:** <br>
> The sequence of the routes in the routes definition is important. As soon as a pattern is matched, the following patterns are ignored. To prevent this for a specific route, you use the `greedy` parameter. If set to `true`, the route is always taken into account.

### webapp/Component.?s

In the component initialization method, we now add a call to initialize the router. 

```ts
import UIComponent from "sap/ui/core/UIComponent";
import JSONModel from "sap/ui/model/json/JSONModel";

/**
 * @namespace ui5.walkthrough
 */
export default class Component extends UIComponent {
    public static metadata = {
        "interfaces": ["sap.ui.core.IAsyncContentCreation"],
        "manifest": "json"
    };
    init(): void {
        // call the init function of the parent
        super.init();
        
        // set data model
        const data = {
            recipient: {
                name: "World"
            }
        };
        const model = new JSONModel(data);
        this.setModel(model);

        // create the views based on the url/hash
        this.getRouter().initialize();
    };
};

```

```js
sap.ui.define(["sap/ui/core/UIComponent", "sap/ui/model/json/JSONModel"], function (UIComponent, JSONModel) {
  "use strict";

  const Component = UIComponent.extend("ui5.walkthrough.Component", {
    metadata: {
      "interfaces": ["sap.ui.core.IAsyncContentCreation"],
      "manifest": "json"
    },
    init() {
      // call the init function of the parent
      UIComponent.prototype.init.call(this);

      // set data model
      const data = {
        recipient: {
          name: "World"
        }
      };
      const model = new JSONModel(data);
      this.setModel(model);

      // create the views based on the url/hash
      this.getRouter().initialize();
    }
  });
  ;
  return Component;
});

```
&nbsp;
We do not need to instantiate the router manually, it is automatically instantiated based on our configuration in the app descriptor and assigned to the component.

Initializing the router will evaluate the current URL and load the corresponding view automatically. This is done with the help of the routes and targets that have been configured in the `manifest.json`. If a route has been hit, the view of its corresponding target is loaded and displayed.

***

### webapp/controller/InvoiceList.controller.?s

What is still missing is the event handler that performs a navigation to the detail page by clicking an item in the invoice list: To access the router instance for our app use the static method `getRouterFor()` on the `UIComponent` module. On the router we call the `navTo` method passing the pattern name we defined in our app descriptor for routing to the details page.

```ts
import Controller from "sap/ui/core/mvc/Controller";
import JSONModel from "sap/ui/model/json/JSONModel";
import { SearchField$SearchEvent } from "sap/m/SearchField";
import Filter from "sap/ui/model/Filter";
import FilterOperator from "sap/ui/model/FilterOperator";
import ListBinding from "sap/ui/model/ListBinding";
import UIComponent from "sap/ui/core/UIComponent";

/**
 * @namespace ui5.walkthrough.controller
 */
export default class App extends Controller {
	
    //...

    onPress(): void {
        const router = UIComponent.getRouterFor(this);
        router.navTo("detail");
    }    
};
```

```js
sap.ui.define(["sap/ui/core/mvc/Controller", "sap/ui/model/json/JSONModel", "sap/ui/model/Filter", "sap/ui/model/FilterOperator", "sap/ui/core/UIComponent"], function (Controller, JSONModel, Filter, FilterOperator, UIComponent) {
  "use strict";

  const App = Controller.extend("ui5.walkthrough.controller.App", {
    
    //...

    onPress() {
      const router = UIComponent.getRouterFor(this);
      router.navTo("detail");
    }
  });
  ;
  return App;
});

```

### webapp/view/InvoiceList.view.xml

In the invoice list view we finally add the press event to the list item we just defined in the controller and set the item type to `Navigation` so that the item can actually be clicked.

```xml
<mvc:View
    controllerName="ui5.walkthrough.controller.InvoiceList"
    xmlns="sap.m"
    xmlns:core="sap.ui.core"
    xmlns:mvc="sap.ui.core.mvc">
    ...
        <items>
            <ObjectListItem
                core:require="{
                    Currency: 'sap/ui/model/type/Currency'
                }"
                title="{invoice>Quantity} x {invoice>ProductName}"
                number="{
                    parts: [
                        'invoice>ExtendedPrice',
                        'view>/currency'
                    ],
                    type: 'Currency',
                    formatOptions: {
                        showMeasure: false
                    }
                }"
                numberUnit="{view>/currency}"
                numberState="{= ${invoice>ExtendedPrice} > 50 ? 'Error' : 'Success' }"
                type="Navigation"
                press=".onPress">
                <firstStatus>
                    <ObjectStatus
                        text="{
                            path: 'invoice>Status',
                            formatter: '.formatter.statusText'
                        }"/>
                </firstStatus>
            </ObjectListItem>
        </items>
    </List>
</mvc:View>
```
&nbsp;
If you now open the app, you should now see the detail page when clicking an item in the list of invoices.

***

### Conventions

-   Define the routing configuration in the descriptor

-   Initialize the router at the end of your `Component#init` function

&nbsp;

***

**Next:** [Step 31: Routing and Navigation](../31/README.md "We can now navigate between the overview and the detail page, but the actual item that we selected in the overview is not displayed on the detail page yet. A typical use case for our app is to show additional information for the selected item on the detail page.")

**Previous:** [Step 29: Debugging Tools](../29/README.md "Even though we have added a basic test coverage in the previous steps, it seems like we accidentally broke our app, because it does not display prices to our invoices anymore. We need to debug the issue and fix it before someone finds out.")

***

**Related Information**  

[Routing Configuration](https://sdk.openui5.org/topic/902313063d6f45aeaa3388cc4c13c34e "Routing configuration consists of routes, targets, config, and owner.")

[Methods and Events for Navigation](sdk.openui5.org/topic/516e477e7e0b4e188b19a406e7528c1e "OpenUI5 provides a method and events for navigation.")

[Initializing and Accessing a Routing Instance](https://sdk.openui5.org/topic/acdb6cd408ec4b9eb5e1fe45e607abdd "This topic describes how to initialize routing in a component and access the routing functions.")

[Tutorial: Navigation and Routing](https://sdk.openui5.org/topic/1b6dcd39a6a74f528b27ddb22f15af0d.html "OpenUI5 comes with a powerful routing API that helps you control the state of your application efficiently. This tutorial will illustrate all major features and APIs related to navigation and routing in OpenUI5 apps by creating a simple and easy to understand mobile app. It represents a set of best practices for applying the navigation and routing features of OpenUI5 to your applications.")

[API Reference: `sap.m.routing.Router`](https://sdk.openui5.org/api/sap.m.routing.Router)

[Samples: `sap.m.routing.Router` ](https://sdk.openui5.org/entity/sap.m.routing.Router)

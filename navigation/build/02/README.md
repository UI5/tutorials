---
title: OpenUI5 Tutorials
permalink: navigation/build/02/README.html
---

<nav class="tutorial-breadcrumb"><a href="../../../index.html">UI5 Tutorials</a> <span class="tutorial-breadcrumb-sep">&rsaquo;</span> <a href="../../index.html">Navigation and Routing Tutorial</a></nav>

## Step 2: Enable Routing

In this step we will modify the app and introduce routing. Instead of having the home page of the app hard coded we will configure a router to wire multiple views together when our app is called. The routing configuration controls the application flow when the user triggers a navigation action or opens a link to the application directly.

### Preview

#### Views are wired together using the router

![Views are wired together using the router](assets/Tutorial_Navigation_and_Routing_Step_02a.png "Views are wired together using the router")

You can view this step live: [🔗 Live Preview of Step 2](https://ui5.github.io/tutorials/navigation/build/02/index-cdn.html).

### Coding

You can download the solution for this step here: <span class="ts-only">[📥 Download step 2](https://ui5.github.io/tutorials/navigation/navigation-step-02.zip)<span class="lang-suffix"> (TS)</span></span><span class="js-only">[📥 Download step 2](https://ui5.github.io/tutorials/navigation/navigation-step-02-js.zip)<span class="lang-suffix"> (JS)</span></span>.

#### Folder structure for this step

{% raw %}
```text
webapp/
├── controller/
│   ├── App.controller.ts/.js
│   └── Home.controller.ts/.js
├── i18n/
│   └── i18n.properties
├── localService/
│   ├── mockdata/
│   │   ├── Employees.json
│   │   └── Resumes.json
│   ├── metadata.xml
│   └── mockserver.ts/.js
├── view/
│   ├── App.view.xml
│   └── Home.view.xml
├── Component.ts/.js
├── index.html
├── initMockServer.ts/.js
└── manifest.json
```
{% endraw %}

### webapp/manifest.json

{% raw %}
```json
{
  "_version": "2.8.0",
  "sap.app": {
    ...
  },
  "sap.ui": {
    ...
  },
  "sap.ui5": {

    "rootView": {
      "viewName": "ui5.tutorial.navigation.view.App",
      "type": "XML",
      "id": "app"
    },
    "dependencies": {
      ...
    },
    "models": {
      ...
    },
    "routing": {
      "config": {
        "routerClass": "sap.m.routing.Router",
        "type": "View",
        "viewType": "XML",
        "path": "ui5.tutorial.navigation.view",
        "controlId": "app",
        "controlAggregation": "pages",
        "transition": "slide"
      },
      "routes": [{
        "pattern": "",
        "name": "appHome",
        "target": "home"
      }],
      "targets": {
        "home": {
          "id": "home",
          "name": "Home",
          "level": 1
        }
      }
    }
  }
}

```
{% endraw %}

Single-page applications based on OpenUI5 can use a so-called “router” to dispatch hash-based URLs to one or more views of the app. Therefore, the router needs to know how to address and show the views. In OpenUI5, we can simply add a `routing` section to our existing `sap.ui5` section in the descriptor file to configure the router. There are three properties that can be used to configure the routing of your application:

- `config`

    This section contains the global router configuration and default values that apply for all routes and targets. The property `routerClass` is special as it determines the router implementation. The default value is `sap.ui.core.routing.Router`. Here, we set the `routerClass` to `sap.m.routing.Router`, because we implement an app based on `sap.m`. All other properties in `config` are given to the router instance. For example, we define where our views are located in the app. To load and display views automatically, we also specify the `controlId` of the control that is used to display the pages and the aggregation \(`controlAggregation`\) that will be filled when a new page is displayed. We will create only XMLviews in this tutorial, so we can set the `viewType` property to `XML`. All our views will be available in the `view` folder of the namespace `ui5.tutorial.navigation`, so we can set the `path` to `ui5.tutorial.navigation.view`. The `transition` allows us to set a default value for how the transition should happen; you can choose between `slide` \(default\), `flip`, `fade`, and `show`. All parameters of the config section can be overruled in the individual route and target definitions if needed.

    > 📝
    > The possible values for `routerClass` are `sap.ui.core.routing.Router`, `sap.m.routing.Router`, or any other subclasses of `sap.ui.core.routing.Router`. Compared to `sap.ui.core.routing.Router` the `sap.m.routing.Router` is optimized for mobile apps and adds the properties `level`, `transition` and `transitionParameters` which can be specified for each route or target created by the `sap.m.routing.Router`. The `transitionParameters` can also be used for custom transitions. Please check the *API Reference* for more information.

- `routes`

    Each route defines a name, a pattern, and one or more targets to navigate to when the route has been hit. The pattern is basically the hash part of the URL that matches the route. The sequence of the routes is important because only the first matched route is used by the router. In our case, we have an empty pattern to match the empty hash. The `name` property allows you to choose a unique route name that helps you to navigate a specific route or to determine the matched route in one of the matched handlers \(we'll explain that in a later step\). The target property references one or more targets from the section below that will be displayed when the route has been matched.

- `targets`

    A target defines either a **view** that is displayed or a **component** that can be loaded and placed through its routing. In order to distinguish between these two target types, it is required to define the `type` property and set it either to `View` or `Component`. In this sample, we will focus on view targets and define the `type` property as `View`. A target is associated with one or more routes, or it can be displayed manually from within the app. Whenever a target is displayed, the corresponding view is loaded and added to the aggregation configured with the `controlAggregation` option of the control. This option is configured using `controlId`. Each target has a unique key \(`home`\). The `name` defines which view shall be loaded. In our little example, the absolute view path to be loaded for our `home` target is determined by the default `"path": "ui5.tutorial.navigation.view"` and `"name": "Home"`. This leads to `"ui5.tutorial.navigation.view.Home"`. The `level` property is especially relevant for `flip` and `slide` transitions. It helps the router to determine the direction of the transition from one page to another. \(This will also be explained later.\) A target can be assigned to a route, but it's not necessary. Targets can be displayed directly in the app without hitting a route.

    This basic routing configuration was easy enough. However, you can’t see it in action until you have initialized the router.

> 📝
> As of OpenUI5 version 1.30, we recommend that you define the routing in the `manifest.json` descriptor file using routes and targets. In older versions of OpenUI5, the routing configuration had to be done directly in the metadata section of the component, and with different syntax.

### webapp/Component.ts/.js

{% raw %}
```ts
// webapp/Component.ts
import UIComponent from "sap/ui/core/UIComponent";

/**
 * @namespace ui5.tutorial.navigation
 */
export default class Component extends UIComponent {

	public static metadata = {
		interfaces: ["sap.ui.core.IAsyncContentCreation"],
		manifest: "json"
	};

	public init(): void {
		super.init();

		// create the views based on the url/hash
		this.getRouter().initialize();
	}
}
```
{% endraw %}

{% raw %}
```js
// webapp/Component.js
sap.ui.define(["sap/ui/core/UIComponent"], function (UIComponent) {
	"use strict";

	const Component = UIComponent.extend("ui5.tutorial.navigation.Component", {
		metadata: {
			interfaces: ["sap.ui.core.IAsyncContentCreation"],
			manifest: "json"
		},
		init: function _init() {
			UIComponent.prototype.init.call(this);

			// create the views based on the url/hash
			this.getRouter().initialize();
		}
	});
	return Component;
});
```
{% endraw %}

We override the `init` function and call the parent’s `init` function first. We get a reference to the router and call `initialize()`on it. The router is instantiated automatically with the configuration loaded in the descriptor. The routing events and our configuration in the descriptor are now automatically enabled in the app. Running the app at this point would lead to an error, because the home view is not implemented yet.

### webapp/view/App.view.xml

{% raw %}
```xml
<mvc:View
  controllerName="ui5.tutorial.navigation.controller.App"
  xmlns="sap.m"
  xmlns:mvc="sap.ui.core.mvc"
  displayBlock="true">
  <Shell>
    <App id="app"/>
  </Shell>
</mvc:View>

```
{% endraw %}

In the `App` view, we remove the content of `App` control. The pages will be added dynamically the way we have configured it in the descriptor. The view configured with the property `rootView` is automatically instantiated when the app is called initially.

### webapp/view/Home.view.xml \(New\)

{% raw %}
```xml
<mvc:View
  controllerName="ui5.tutorial.navigation.controller.Home"
  xmlns="sap.m"
  xmlns:mvc="sap.ui.core.mvc">
  <Page
    title="{i18n>homePageTitle}"
    titleAlignment="Center"
    class="sapUiResponsiveContentPadding">
    <content>
      <Button text="{i18n>iWantToNavigate}" class="sapUiTinyMarginEnd"/>
    </content>
  </Page>
</mvc:View>
```
{% endraw %}

Create a file `Home.view.xml` in the `webapp/view` folder. The home view only contains a page control that displays a button. For illustration, we bind the title of the page to the `i18n>homePageTitle`, you can use data binding just the way you are used to it.

### webapp/controller/Home.controller.ts/.js \(New\)

{% raw %}
```ts
// webapp/controller/Home.controller.ts
import Controller from "sap/ui/core/mvc/Controller";

/**
 * @namespace ui5.tutorial.navigation.controller
 */
export default class Home extends Controller {

}
```
{% endraw %}

{% raw %}
```js
// webapp/controller/Home.controller.js
sap.ui.define(["sap/ui/core/mvc/Controller"], function (Controller) {
	"use strict";

	const Home = Controller.extend("ui5.tutorial.navigation.controller.Home", {});
	return Home;
});
```
{% endraw %}

Create a file `Home.controller.ts` in the `webapp/controller` folder. The controller for the home view does not contain any custom logic in this step, but we will add some features to it soon. Finally, run the app by calling the `webapp/index.html` file. This will be the entry point for our app in all the next steps. As you can see, the app is initially displaying the home view that we configured as the default pattern in the routing configuration. We have now successfully enabled routing in the app.

> 📝
> We think of routing as a set of features that dispatch hash-based URLs to an app's views and manage the views' states.
>
> Based on the routing configuration, you define the navigation between pages and pass parameters to the target views.

### Conventions

- Configure the router in the `manifest.json` descriptor file

- Initialize the router exactly once

- Initialize the router in the component

***

**Next:** [Step 3: Catch Invalid Hashes](../03/index.html)

**Previous:** [Step 1: Set Up the Initial App](../01/index.html)

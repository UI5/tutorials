## Step 10: Manifest (Descriptor for Applications)

All application-specific configuration settings will now be put into the manifest. This clearly separates the application coding from the configuration settings and makes our app even more flexible.

Instead of relying on a local HTML file for the bootstrap, the manifest is parsed and the component is loaded directly into the current HTML page. This allows multiple apps to be displayed in the same context. Each app can define its own local settings, such as language properties and supported devices. Additionally, the manifest can be used to load additional resources and instantiate models, such as the `i18n` resource bundle.

&nbsp;

***

### Preview
![](assets/loio7b2aef85c016485da4a31c087bf4c0f0_LowRes.png "An input field and a description displaying the value of the input field \(No visual changes to last step\)")  

<sup>*An input field and a description displaying the value of the input field \(No visual changes to last step\)*</sub>

You can access the live preview by clicking on this link: [🔗 Live Preview of Step 10](https://ui5.github.io/tutorials/walkthrough/build/10/index-cdn.html).

***

### Coding

<details class="ts-only" markdown="1">

You can download the solution for this step here: [📥 Download step 10](https://ui5.github.io/tutorials/walkthrough/walkthrough-step-10.zip).

</details>

<details class="js-only" markdown="1">

You can download the solution for this step here: [📥 Download step 10](https://ui5.github.io/tutorials/walkthrough/walkthrough-step-10-js.zip).

</details>
***

### webapp/i18n/i18n.properties

In our resource bundle, we include two new name-value pairs: `appTitle` for the title of our app and `appDescription` for a short description. We'll use these texts in our manifest file at a later stage. 

To improve readability, we also add comments to separate the bundle texts based on their meaning.

```ini
# Manifest
appTitle=Hello World
appDescription=A simple walkthrough app that explains the most important concepts of OpenUI5

# Hello Panel
showHelloButtonText=Say Hello
helloMsg=Hello {0}
```
***

### webapp/manifest.json

As mentioned in [Step 1](../01/README.md#webappmanifestjson-new), the manifest is used by OpenUI5 to instantiate the component. We have already configured the essential attributes of the file so that it can be used with the UI5 CLI. Now, we'll add further attributes that are important for creating a proper UI component in OpenUI5.

We enhance the **`sap.app`** namespace by adding configuration for the following application-specific attributes:
    
-   `i18n`: The `i18n` property is an attribute to configure internationalization settings. It is optional and only necessary if the manifest contains text symbols (placeholders in {{...}} syntax). The `i18n` property has the following sub-settings:

    -   The `bundleName` parameter specifies the name of the resource bundle file that contains the text symbols for the manifest. The file is referenced using a dot notation namespace. In our case, we stored the texts for the manifest in the same resource bundle as the remaining texts, so we reference the properties file stored in the `i18n` folder.
    
    -   The `supportedLocales` property defines an array of locales supported by the application (for example en_GB, en-GB, or en). This helps optimize the loading performance of resource bundles. It controls the language fallback chain and prevents unnecessary and potentially failing requests. In our application, we only use the base `i18n.properties` file for simplicity, so we set this property to an empty string. This ensures that the browser does not attempt to load additional `i18n_*.properties` files based on the browser's language setting and locale.

    -   The `fallbackLocale` property specifies the fallback locale to be used in case the user's locale is not present in the list of supported locales or the required text can't be found in any other resource bundle. The fallback locale must be listed in the `supportedLocales`. Also here, we specify an empty string as per default `fallbackLocale` is set to "en".

-   `title`: In [Step 1](../01/README.md#webappmanifestjson-new), we recommended making the title language-dependent. We now implement this by referencing the `appTitle` text from the resource bundle using the handlebar syntax: {{key}}

-   `description`: Similarly, we make the description text language-dependent by referencing the `appDescription` text from the resource bundle using the handlebar syntax: {{key}}

> :warning: **Remember:** <br>
> Properties of the resource bundle are enclosed in two curly brackets in the manifest. This is not an OpenUI5 data binding syntax but a variable reference to the resource bundle in the manifest in handlebars syntax.

In addition to the `sap.app` namespace, there are two other important namespaces:
The **`sap.ui`** namespace is used for UI-specific attributes and comes with the following main attributes:

-   `technology` \(mandatory\): This property specifies the technology used for the application; its value must be `UI5`.

-   `deviceTypes` \(mandatory\): This property defines the supported device types for the application. It is an object that contains three boolean properties: `desktop`, `tablet`, and `phone`. Each property indicates whether the application is designed to be used on that particular device type. We define all three device types as "true", which means that our application is intended to be used on desktops, tablets, and phones.
        
> 📝 **Note:** <br>
> By configuring the `deviceTypes` property, developers can ensure that the application's user interface is optimized for different device types, providing a consistent and responsive experience across various devices.

The **`sap.ui5`** namespace adds OpenUI5-specific configuration parameters that are automatically processed by OpenUI5. The following parameters are important:

-   `dependencies`\(mandatory\): This section defines the dependencies of the component. It comes with the following sub-settings:

    -   The `minUI5Version` property is mandatory as it specifies the minimum version of OpenUI5 that the component requires to function properly. Following the guideline discussed in step 1, our component should be designed to work with the long-term support (LTS) version 1.120 of OpenUI5.
    
    -    The `libs` settings is used to declare all OpenUI5 libraries that the component depends on. It's crucial to list every library within the component here for correct dependency management.<br>
    In our component we currenetly only use the `sap.ui.core` and `sap.m` liibraries. The `sap.ui.core` library provides the basic framework functionality and is required for any OpenUI5 application.<br>
    By default, loading of libraries is set to `"lazy": false`, which means they are loaded immediately when the component initializes. For libraries that are essential for your app to function from the start, like `sap.ui.core` and in our case also `sap.m` (since it is used in the root view), we can keep the default setting of `"lazy": false`.

    > 📌 **Important:** <br>
    > It is crucial to be mindful of the lazy loading configuration for libraries. Only libraries that are absolutely necessary for your component to start should be declared with `"lazy": false`. For libraries that are not required immediately, it is recommended to override the default setting and set `"lazy": true`. This approach allows for better performance and faster initial loading of the component by deferring the loading of non-essential libraries until they are actually needed. 
    > For more information on loading libraries, refer to the [sap.ui.core.Lib.load](https://sdk.openui5.org/api/sap.ui.core.Lib#methods/sap.ui.core.Lib.load) API reference. 
    > If your component requires a minimum version of the library, you need to specify the `minVersion` for information purposes.

-   `rootView`: This section defines the root view of the application. The root view is the initial view that is displayed when the component is loaded. It specifies view name as a string for XML views, or the view configuration object with `viewName` for the view name as string and `type` for the view type, `id`, `async`, and other properties of `sap.ui.core.mvc.view`. We configure our app view as root view and add the ID "app" to it.

-   `models`: This section is used to define the models that will be created or destroyed during the lifecycle of the app. Each model is identified by a unique key, and an empty string ("") as key is used to represent the default model. For each model you need to specify its type, and depending on the chosen model type, you may also need to provide additional settings. <br>
In our current scenario, we only have one model called `i18n`, which is a resource model. To configure this model, we set its name as the key and specify the type as "sap.ui.model.resource.ResourceModel". Additionally, we can use the same settings that we have defined for the `i18n` properties in the `sap.app` namespace.

```json
{
    "_version": "1.60.0",
    "sap.app": {
        "id": "ui5.walkthrough",
        "type": "application",
        "i18n": {
            "bundleName": "ui5.walkthrough.i18n.i18n",
            "supportedLocales": [
                ""
            ],
            "fallbackLocale": ""
        },
        "title": "{{appTitle}}",
        "description": "{{appDescription}}",
        "applicationVersion": {
            "version": "1.0.0"
        }
    },
    "sap.ui": {
        "technology": "UI5",
        "deviceTypes": {
            "desktop": true,
            "tablet": true,
            "phone": true
        }
    },
    "sap.ui5": {
        "dependencies": {
            "minUI5Version": "1.132",
            "libs": {
                "sap.ui.core": {},
                "sap.m": {}
            }
        },
        "rootView": {
            "viewName": "ui5.walkthrough.view.App",
            "type": "XML",
            "id": "app"
        },
        "models": {
            "i18n": {
                "type": "sap.ui.model.resource.ResourceModel",
                "settings": {
                    "bundleName": "ui5.walkthrough.i18n.i18n",
                    "supportedLocales": [
                        ""
                    ],
                    "fallbackLocale": ""
                }
            }
        }
    }
}
```   

> 📝 **Note:** <br>
> In this tutorial, we only introduce the most important settings and parameters of the manifest. In some development environments you may get validation errors because some settings are missing - you can ignore those in this context.

***

### webapp/Component.?s

To apply the settings specified in the manifest to the component, we need to include the manifest in the component's metadata. To do this, we add a `manifest` property to the `metadata` section of the component and set it to "json". This property acts as a reference to the `manifest.json` file, which will be loaded and used.

Now that the resource model is automatically instantiated based on the configuration in the manifest, we can safely remove the corresponding code block from the `init` method in our component controller. This also means that we can remove the import statement for the `ResourceModel` module from `sap/ui/model/resource/ResourceModel`, as it is no longer needed. Additionally, we can remove the `createContent` call since the configuration of the rootView is specified in the manifest and therefore makes the implementation in this method unnecessary.

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
        const dataModel = new JSONModel(data);
        this.setModel(dataModel);
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
      const dataModel = new JSONModel(data);
      this.setModel(dataModel);
    }
  });
  ;
  return Component;
});

```

***

### webapp/index.html

Let's explore how we can create a component in a simple and straightforward way directly in the HTML markup of our `index.html` file. To do this, we need to make a few changes in our HTML document.

First, we need to remove the reference to the `ui5/walkthrough/index` module from the `data-sap-ui-on-init` attribute. Instead, we set it to the `sap/ui/core/ComponentSupport` module. Next, we add a `div` tag to the body of our HTML file. Inside this `div` tag, we add a special data attribute called `data-sap-ui-component`. This attribute is important because the `sap/ui/core/ComponentSupport` module scans the HTML elements with this attribute. Any element marked with this attribute will be considered a container element into which a `sap/ui/core/ComponentContainer` is inserted. We can also use additional data attributes to define the constructor arguments for the `ComponentContainer` instance. We transfer the arguments used to configure the `CompontentContainer `instance in the `index.ts` file to data attributes on our `div` tag. 

It's worth noting that the `ComponentSupport` module enforces asynchronous loading of the respective component, so we don't need to set the `async` attribute to "true" in this case. It also sets the `autoPrefixId` property to "true" by default, so we don't need to set this attribute here either.

```html
<!DOCTYPE html>
<html>
<head>
	<meta charset="utf-8">
	<title>UI5 TypeScript Walkthrough</title>
	<script
		id="sap-ui-bootstrap"
		src="resources/sap-ui-core.js"
		data-sap-ui-theme="sap_horizon"
		data-sap-ui-compat-version="edge"
		data-sap-ui-async="true"
		data-sap-ui-on-init="module:sap/ui/core/ComponentSupport"
		data-sap-ui-resource-roots='{
			"ui5.walkthrough": "./"
		}'>
	</script>
</head>
<body class="sapUiBody" id="content">
	<div data-sap-ui-component data-name="ui5.walkthrough" data-id="container" data-settings='{"id" : "walkthrough"}'></div>	
</body>
</html>
```

We can now delete our `index.?s` file, because our component is now initiated directly in the HTML markup.

***

### Conventions

-   The manifest file is named `manifest` and stored as a JSON file.

-   The manifest file is located in the `webapp` folder.

-   Use translatable texts for the title and the description of the app.

&nbsp;

***

**Next:** [Step 11: Pages and Panels](../11/README.md "After all the work on the app structure it’s time to improve the look of our app. We will use two controls from the sap.m library to add a bit more bling to our UI. You will also learn about control aggregations in this step.")

**Previous:** [Step 9: Component Configuration](../09/README.md "After we have introduced all three parts of the Model-View-Controller \(MVC\) concept, we now come to another important structural aspect of OpenUI5.")

***

**Related Information**  


[Descriptor for Applications, Components, and Libraries \(manifest.json\)](https://sdk.openui5.org/topic/be0cf40f61184b358b5faedaec98b2da.html "The descriptor for applications, components, and libraries (in short: app descriptor) is inspired by the WebApplication Manifest concept introduced by the W3C. The descriptor provides a central, machine-readable, and easy-to-access location for storing metadata associated with an application, an application component, or a library.")

[Supported Locales and Fallback Chain](https://sdk.openui5.org/topic/be0cf40f61184b358b5faedaec98b2da "You can configure a list of supported locales and a fallback locale in your app’s manifest to control the loading of resource bundles and avoid ‘404 Not Found’ network responses.")

[Terminologies](https://sdk.openui5.org/topic/eba8d25a31ef416ead876e091e67824e.html "By defining terminologies together with additional resource bundles, an application can easily be switched from one scenario or industry to another.")

[Declarative API for Initial Components](https://sdk.openui5.org/topic/82a0fcecc3cb427c91469bc537ebdddf.html "The declarative API enables you to define the initially started component directly in the HTML markup.")

[API Reference: `sap.ui.core.ComponentSupport`](https://sdk.openui5.org/api/sap.ui.core.ComponentSupport)

[Make Your App CSP Compliant](https://sdk.openui5.org/topic/1f81a093a9f3433983dcb2ebe11cd4cd.html "CSP stands for Content Security Policy and is a security standard to prevent cross-site scripting or other code injection attacks.")

---
title: UI5 Tutorials
permalink: walkthrough/build/03/README.html
---

## Step 3: Controls

Now it is time to build our first little UI by replacing the “Hello World” text in the HTML body by the OpenUI5 control `sap/m/Text`. In the beginning, we will create an OpenUI5 control instance and place into the HTML body.

&nbsp;

***

### Preview

![](assets/loio30a42d381b9e4388bf7fdc0b941e5381_LowRes.png "The &quot;Hello World&quot; text is now displayed by a OpenUI5 control")

<sup>*The &quot;Hello World&quot; text is now displayed by an OpenUI5 control*</sup>


You can access the live preview by clicking on this link: [🔗 Live Preview of Step 3](https://ui5.github.io/tutorials/walkthrough/build/03/index-cdn.html).

***
### Coding
<details class="ts-only" markdown="1">

You can download the solution for this step here: [📥 Download step 3](https://ui5.github.io/tutorials/walkthrough/walkthrough-step-03.zip).

</details>

<details class="js-only" markdown="1">

You can download the solution for this step here: [📥 Download step 3](https://ui5.github.io/tutorials/walkthrough/walkthrough-step-03-js.zip).

</details>
***

<details class="ts-only" markdown="1">

### Development Environment

To get the type definitions for OpenUI5, we need to install them to our project. We open a terminal in the root folder of our app and exectue the following command:

```sh
npm install @types/openui5 --save-dev
```

***

</details>

### webapp/index.?s

<details class="ts-only" markdown="1">

We will replace the native script in our file with the OpenUI5 Text control displaying "Hello Word". 
For this, we will create a new instance of the Text control, setting its `text` property to "Hello World" by passing it as an object to the constructor.

</details>

<details class="js-only" markdown="1">

We will replace the native script in our file with the OpenUI5 Text control displaying "Hello Word". 
For this, we will first use OpenUI5's module definition `sap.ui.define` to create a module. To instantiate and render the Text control, we will define the `sap/m/Text` module as a dependency to this module. We will then create a new instance of the Text control and set its `text` property to "Hello World".

</details>

To place the text control to our HTML document, we chain the constructor call of the control with the `placeAt` method. This method is used to position OpenUI5 controls. In our case, we add the Text control to the DOM element with the ID `content`.

<details class="js-only" markdown="1">

> 📌 **Important:** <br>
> It is best practice to use of Anynchronous Module Loading (AMD) style for defining modules and their dependencies. This ensures better performance, proper dependency tracking between modules and helps avoid issues related to loading order.

</details>

```ts
import Text from "sap/m/Text";

new Text({
    text: "Hello World"
}).placeAt("content");
```

```js
sap.ui.define(["sap/m/Text"], function (Text) {
  "use strict";

  new Text({
    text: "Hello World"
  }).placeAt("content");
});
```

All controls of OpenUI5 have a fixed set of properties, aggregations, and associations for configuration. You can find their descriptions in the Demo Kit. In addition, each control comes with a set of public functions that you can look up in the API reference.

> 📌 **Important:** <br>
> Only instances of `sap.ui.core.Control` or their subclasses can be rendered stand-alone and have a `placeAt` function. Each control extends `sap.ui.core.Element` that can only be rendered inside controls. Check the API reference to learn more about the inheritance hierarchy of controls. The API documentation of each control refers to the directly known subclasses.

***

### webapp/index.html

We replace the `<div>` tag in our `webapp/index.html` file with a `<body>` tag and assign it the ID `content`. The body tag of the HTML document thus becomes the target node for the text control we defined in the `index` script.

We also add the `sapUiBody` class, which provides additional theme-dependent styles.

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
		data-sap-ui-on-init="module:ui5/walkthrough/index"
		data-sap-ui-resource-roots='{
            "ui5.walkthrough": "./"
		}'>
	</script>
</head>
<body class="sapUiBody" id="content">
    </body>
</html>
```

In the example above, the callback of the `on-init` event is where we now instantiate an OpenUI5 text control. 

***


### Development Environment

As we now use the `sap.m` library with our app, we need to add the dependency to this library to our UI5 CLI setup. 

We open a terminal in the root folder of our app and exectue the following command:

```sh
ui5 add sap.m 
```

&nbsp;

***

**Next:** [Step 4: XML Views](../04/index.html "Putting all our UI into the index.html file will very soon result in a messy setup and there is quite a bit of work ahead of us. So let’s do a first modularization by putting the sap/m/Text control into a dedicated view.")

**Previous:** [Step 2: Bootstrap](../02/index.html "Before we can do something with OpenUI5, we need to load and initialize it. This process of loading and initializing OpenUI5 is called bootstrapping. Once this bootstrapping is finished, we simply display an alert.")

***

**Related Information** 

[Working with Controls](https://sdk.openui5.org/topic/91f0a22d6f4d1014b6dd926db0e91070.html "Controls are used to define the appearance and behavior of screen areas.")

[API Reference: `sap.m.Text`](https://sdk.openui5.orgapi/sap.m.Text)

[Samples: `sap.m.Text` ](https://sdk.openui5.orgentity/sap.m.Text)

[API Reference: `sap.ui.core.Control`](https://sdk.openui5.orgapi/sap.ui.core.Control)

[API Reference: `sap.ui.core.Element`](https://sdk.openui5.orgapi/sap.ui.core.Element)

[API Reference: `sap.ui.base.ManagedObject`](https://sdk.openui5.orgapi/sap.ui.base.ManagedObject)

<details class="ts-only" markdown="1">

[TypeScript definitions for OpenUI5](https://www.npmjs.com/package/@types/openui5)

</details>

<details class="js-only" markdown="1">

[Best Practices for Loading Modules](https://sdk.openui5.org/topic/00737d6c1b864dc3ab72ef56611491c4 "This section provides best practices for OpenUI5 module loading patterns.")

</details>

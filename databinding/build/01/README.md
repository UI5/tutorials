---
title: OpenUI5 Tutorials
permalink: databinding/build/01/README.html
---

<nav class="tutorial-breadcrumb"><a href="../../../index.html">UI5 Tutorials</a> <span class="tutorial-breadcrumb-sep">&rsaquo;</span> <a href="../../index.html">Data Binding Tutorial</a></nav>


## Step 1: No Data Binding

In this step, we create a basic application and simply place some text on the screen using a standard `sap.m.Text` control. The text in this control is a hard-coded part of the control's definition; therefore, this is not an example of data binding!

### Preview

![The browser shows the text "Hi, my name is Harry Hawk"](assets/Tutorial_Data_Binding_Step_1_6d391d5.png "The browser shows the text &quot;Hi, my name is Harry Hawk&quot;")

You can view this step live: [🔗 Live Preview of Step 1](https://ui5.github.io/tutorials/databinding/build/01/index-cdn.html).

### Setup

Open a terminal and install UI5 Tooling globally on your machine by executing the following command:

{% raw %}
```sh
npm install --global @ui5/cli
```
{% endraw %}

### Coding

You can download the solution for this step here: <span class="ts-only">[📥 Download step 1](https://ui5.github.io/tutorials/databinding/databinding-step-01.zip)<span class="lang-suffix"> (TS)</span></span><span class="js-only">[📥 Download step 1](https://ui5.github.io/tutorials/databinding/databinding-step-01-js.zip)<span class="lang-suffix"> (JS)</span></span>.

#### Folder structure for this step

{% raw %}
```text
webapp/
├── view/
│   └── App.view.xml
├── Component.ts/.js
├── index.html
└── manifest.json
```
{% endraw %}

1. Create a folder on your local machine which will contain all the sources of the app we're going to build. We'll refer to this folder as the “app root folder”.

2. Create a new file called `package.json` which will enable you to execute commands and consume packages from the [npm registry](https://www.npmjs.com/) via the npm command line interface. Enter the following content:

### package.json \(New\)

{% raw %}
```json
{
  "name": "ui5.tutorial.databinding",
  "private": true,
  "version": "1.0.0",
  "author": "SAP SE",
  "description": "UI5 Demo App - Data Binding Tutorial",
  "scripts": {
    "start": "ui5 serve -o index.html"
  }
}
```
{% endraw %}

3. Create a new folder named `webapp` in the app root folder. It will contain all the sources that become available in the browser later. We'll refer to this folder as the "webapp folder".

4. Create a new HTML file named `index.html` in your webapp folder and enter the following content:

### webapp/index.html \(New\)

{% raw %}
```html
<!DOCTYPE html>
<html>
<head>
	<meta charset="utf-8">
	<meta name="viewport" content="width=device-width, initial-scale=1.0">
	<title>Data Binding Tutorial</title>
	<script
		id="sap-ui-bootstrap"
		src="resources/sap-ui-core.js"
		data-sap-ui-theme="sap_horizon"
		data-sap-ui-compat-version="edge"
		data-sap-ui-async="true"
		data-sap-ui-on-init="module:sap/ui/core/ComponentSupport"
		data-sap-ui-resource-roots='{
			"ui5.tutorial.databinding": "./"
		}'>
	</script>
</head>
<body class="sapUiBody" id="content">
	<div data-sap-ui-component data-name="ui5.tutorial.databinding" data-id="container" data-settings='{"id" : "databinding"}'></div>
</body>
</html>
```
{% endraw %}

5. Create a new file named `manifest.json` in the webapp folder; it's also known as the "app descriptor". All application-specific configuration options which we'll introduce in this tutorial will be added to this file. Enter the following content:

### webapp/manifest.json \(New\)

{% raw %}
```json
{
  "_version": "2.8.0",
  "sap.app": {
    "id": "ui5.tutorial.databinding",
    "type": "application",
    "applicationVersion": {
      "version": "1.0.0"
    },
    "title": "Data Binding Tutorial",
    "description": "A simple app that explains how to use data binding features of OpenUI5"
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
      "minUI5Version": "1.148",
      "libs": {
        "sap.m": {},
        "sap.ui.core": {}
      }
    },
    "contentDensities": {
      "compact": true,
      "cozy": true
    },
    "rootView": {
      "viewName": "ui5.tutorial.databinding.view.App",
      "type": "XML",
      "id": "app"
    }
  }
}
```
{% endraw %}

6. Create a new file named `Component.ts/.js` in the webapp folder. Enter the following content:

### webapp/Component.ts/.js \(New\)

{% raw %}
```ts
// webapp/Component.ts
import UIComponent from "sap/ui/core/UIComponent";

/**
 * @namespace ui5.tutorial.databinding
 */
export default class Component extends UIComponent {
	public static metadata = {
		interfaces: ["sap.ui.core.IAsyncContentCreation"],
		manifest: "json"
	};
}
```
{% endraw %}

{% raw %}
```js
// webapp/Component.js
sap.ui.define(["sap/ui/core/UIComponent"], function (UIComponent) {
	"use strict";

	return UIComponent.extend("ui5.tutorial.databinding.Component", {
		metadata: {
			interfaces: ["sap.ui.core.IAsyncContentCreation"],
			manifest: "json"
		}
	});
});
```
{% endraw %}

7. Create a new folder named `view` in the webapp folder. Then, create a new file `App.view.xml` within the `view` folder. We start by placing the `sap.m.Text` control into the XML view. Since the value of the control's text property is hard-coded, it doesn't relate to any data that might exist within a model object. Therefore, data binding is **not** used here.

### webapp/view/App.view.xml \(New\)

{% raw %}
```xml
<mvc:View
	xmlns="sap.m"
	xmlns:mvc="sap.ui.core.mvc">
	<Text text="Hi, my name is Harry Hawk"/>
</mvc:View>
```
{% endraw %}

8. Open a terminal in the app root folder and execute `npm i -D @ui5/cli` to install UI5 Tooling in the app root folder.

9. Execute `ui5 init` in the app root folder.

10. Execute `ui5 use OpenUI5`

11. Execute `ui5 add sap.m sap.ui.core sap.ui.layout themelib_sap_horizon`

12. Configure the tooling extensions we installed from npm in our UI5 Tooling setup, so we can use them in our project:

### ui5.yaml

{% raw %}
```yaml
specVersion: "4.0"
metadata:
  name: "ui5.tutorial.databinding"
type: application
framework:
  name: OpenUI5
  version: "1.148.1"
  libraries:
    - name: sap.m
    - name: sap.ui.core
    - name: sap.ui.layout
    - name: themelib_sap_horizon
builder:
  customTasks:
  - name: ui5-tooling-transpile-task
    afterTask: replaceVersion
server:
  customMiddleware:
  - name: ui5-tooling-transpile-middleware
    afterMiddleware: compression
  - name: ui5-middleware-serveframework
    afterMiddleware: compression
  - name: ui5-middleware-livereload
    afterMiddleware: compression
```
{% endraw %}

13. Execute `npm start` to start the web server and to open a new browser window hosting your newly created `index.html`.

***

**Next:** [Step 2: Creating a Model](../02/index.html)

***

**Related Information**

[Data Binding](https://sdk.openui5.org/topic/68b9644a253741e8a4b9e4279a35c247.html "You use data binding to bind UI elements to data sources to keep the data in sync and allow data editing on the UI.")

[Model View Controller \(MVC\)](https://sdk.openui5.org/topic/91f233476f4d1014b6dd926db0e91070.html "The Model View Controller (MVC) concept is used in OpenUI5 to separate the representation of information from the user interaction. This separation facilitates development and the changing of parts independently.")

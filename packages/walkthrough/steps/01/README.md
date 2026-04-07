## Step 1: Hello World!

As you know, OpenUI5 is all about HTML5. Let's get started with building a first "Hello World" with only HTML. In addition we'll initialize the UI5 CLI, so we can benefit from it from the beginning.

&nbsp;

***

### Preview


![](assets/loio1dd456361379431aab7e5bcdaaeff00f_LowRes.png "The browser shows the text &quot;Hello World&quot;")

<sup>*The browser shows the text &quot;Hello World&quot;*</sup>

You can access the live preview by clicking on this link: [🔗 Live Preview of Step 1](https://sap-samples.github.io/ui5-typescript-walkthrough/walkthrough/build/01/index.html).

***

### Coding

<details class="ts-only">

You can download the solution for this step here: [📥 Download step 1](https://sap-samples.github.io/ui5-typescript-walkthrough/walkthrough/walkthrough-step-01.zip). 

</details>

<details class="js-only">

You can download the solution for this step here: [📥 Download step 1](https://sap-samples.github.io/ui5-typescript-walkthrough/walkthrough/walkthrough-step-01-js.zip).

</details>
***

### webapp \(New\)

We create a folder on our local machine which will contain all the sources of the app we're going to build. We'll refer to this folder as the “app root directory".

***

### webapp/index.html \(New\)

In the app root directory, we create a new folder named `webapp`. This folder exists to store all the sources that become available in the browser later. We refer to this folder as the "webapp folder".

In our webapp folder, we create a new HTML file named `index.html` and copy the following content to it:

```html
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <title>UI5 TypeScript Walkthrough</title>
</head>
<body>
  <div>Hello World</div>
</body>
</html>
```

> 📝 **Note:** <br>
> An HTML document consists basically of two sections: head and body. The head part will be used by the browser to process the document.
> 
> Using meta tags, we can influence the behavior of the browser. In this case, we tell the browser to use `UTF-8` as the document character set.
> 
> We also give our app a title that will be displayed in the browser. Our hard-coded title can be overruled by the app, for example to show a title in the language of the user. The body part describes the layout of the page. In our case, we simply display “Hello World” by using a `div` tag.

***

### webapp/manifest.json \(New\)

The manifest serves as a crucial configuration file for applications, components, and libraries. For applications, the manifest file is stored in the `webapp` folder and is read by OpenUI5 to instantiate a component. Although we haven't created a component yet (which is part of [Step 9: Component Configuration](../09/README.md)), creating the manifest now is necessary due to the UI5 CLI requirements for development.

Let's start by creating a new file named `manifest.json` in the webapp folder and define its essential attributes:

-   The `_version` attribute in the root is mandatory in the manifest. It indicates the format version of the manifest, which is crucial for identifying application settings whenever the file is read by various tools. As new features or changes are introduced in future versions, maintaining the correct version number ensures compatibility and precise interpretation of the manifest's contents. 

Since we want our app to support not only the latest OpenUI5 version but rather the latest long-term maintenance version, which is OpenUI5 1.120, we set the format version to `1.60.0`.

  > 📝  **Note:** <br>
  > The manifest version should not necessarily align directly with the OpenUI5 version being used. Instead, choose the descriptor version that matches the requirements or supports the features you intend to use in your application. 
  
  To find the appropriate `_version` for each OpenUI5 release, refer to [Descriptor for Applications, Components, and Libraries \(manifest.json\)](https://sdk.openui5.org/topic/be0cf40f61184b358b5faedaec98b2da.html) or the [mapping.json](https://github.com/SAP/ui5-manifest/blob/main/mapping.json) file of the [ui5-manifest](https://github.com/SAP/ui5-manifest/) project.

-   The **`sap.app`**  namespace defines properties specific to the application. It includes the following required attributes:

    -   `id`: This specifies an identifier for the application. It is provided in dot notation and is limited to 70 characters. It must be unique and must correspond to the component ID/namespace.

    -   `type`: This property defines the nature of the project and specifies whether it is an `application`, `component`, `library`, or `card`. It provides a clear classification, helping to identify the project's purpose and ensuring the correct loading and handling of the project within the system.

    -   `title`: This defines the title of the application, which appears in application management tools like the SAP Fiori launchpad.

        > 📝 **Note:** <br>
        > It is advisable to make the title language-dependent. We'll cover implementing language-dependent titles in [Step 10: Manifest (Descriptor for Applications)](../10/README.md), but for now we'll use a static title.

    -   `applicationVersion`: This is used to denote the version of the application using semantic versioning principles. It's typically used for tracking and managing changes to the application over time.

```json
{
    "_version": "1.60.0",
    "sap.app": {
        "id": "ui5.walkthrough",
        "type": "application",
        "title": "OpenUI5 TypeScript Walkthrough",
        "applicationVersion": {
            "version": "1.0.0"
        }
    }
}
```

> 📝 **Note:** <br>
> In this tutorial step, we focus on adding the absolute minimum configuration to the app descriptor file. In certain development environments you might encounter validation errors due to missing settings. However, for the purposes of this tutorial you can safely ignore these errors. In [Step 10: Descriptor for Applications](../10/README.md) we'll examine the purpose of the file in detail and configure some further options.

***

### Development Environment

The following steps are tailored for using this project with [UI5 CLI](https://ui5.github.io/cli/stable/pages/CLI/#local-vs-global-installation).

***

### package.json \(New\)

We create a new file called `package.json` in the app root directory. It allows us to execute commands and consume packages from the [npm registry](https://www.npmjs.com/) via the npm command line interface.

Enter the following content:

```json
{
  "name": "ui5.walkthrough",
  "version": "1.0.0",
  "description": "OpenUI5 TypeScript Walkthrough",
  "private": true,
  "scripts": {
    "start": "ui5 serve -o index.html"
  }
}

```

Next, we install the UI5 CLI and add it as development dependency to our project. For this, we open a terminal in the app root folder and execute the following command:

```sh
npm install --save-dev @ui5/cli
```

Finally, we initialize the UI5 CLI configuration for our project by executing the following command on the app root folder: 

```sh
ui5 init
```

This will generate a `ui5.yaml` file in the app root directory, which is essential for using UI5 CLI with our project.
&nbsp;

To start the web server, execute the following command:

```sh
npm start 
```

This will open a new browser window hosting your newly created `index.html`.

***

### Conventions

-   The `index.html` file is located in the `webapp` folder.

&nbsp;

***

**Next:** [Step 2: Bootstrap](../02/README.md "Before we can do something with UI5, we need to laod and initialize it. This process of loading and initializing UI5 is called bootstrapping. Once this bootstrapping is finished, we simply display an alert.")

***

**Related Information**  

[Descriptor for Applications, Components, and Libraries \(manifest.json\)](https://sdk.openui5.org/topic/be0cf40f61184b358b5faedaec98b2da.html "The descriptor for applications, components, and libraries (in short: app descriptor) is inspired by the WebApplication Manifest concept introduced by the W3C. The descriptor provides a central, machine-readable, and easy-to-access location for storing metadata associated with an application, an application component, or a library.")

[ui5-manifest](https://github.com/SAP/ui5-manifest/tree/main)

[Development Environment](https://sdk.openui5.org/topic/7bb04e05f9484e1b95b38a2e48ecef4f.html "This part of the documentation introduces you to some common and recommended use cases for the installation, configuration, and setup of OpenUI5 development environments.")

[App Development](https://sdk.openui5.org/topic/b1fbe1a22f8d4a5bbb601591e27b68d1 "There are several ways to develop OpenUI5 applications. Select the one that meets the requirements of your projects and your expectations best.")

[UI5 CLI: Getting Started](https://ui5.github.io/cli/stable/pages/GettingStarted/)

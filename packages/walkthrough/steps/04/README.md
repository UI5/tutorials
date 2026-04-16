## Step 4: XML Views

Putting all our UI into the `index.ts` file will very soon result in a messy setup and there is quite a bit of work ahead of us. So let’s do a first modularization by putting the `sap/m/Text` control into a dedicated `view`.

When working with OpenUI5, we recommend the use of XML views, as this produces the most readable code and will force us to separate the view declaration from the controller logic. Yet the look of our UI will not change.

&nbsp;

***
### Preview


![](assets/loio05f6775a39d3409ea673f4acc3812142_LowRes.png "The &quot;Hello World&quot; text is now displayed by a OpenUI5 control  \(No visual changes to last step\)")

<sup>*The &quot;Hello World&quot; text is now displayed by an OpenUI5 control \(No visual changes to last step\)*</sup>

You can access the live preview by clicking on this link: [🔗 Live Preview of Step 4](https://ui5.github.io/tutorials/walkthrough/build/04/index-cdn.html).

***

### Coding

<details class="ts-only" markdown="1">

You can download the solution for this step here: [📥 Download step 4](https://ui5.github.io/tutorials/walkthrough/walkthrough-step-04.zip).

</details>

<details class="js-only" markdown="1">

You can download the solution for this step here: [📥 Download step 4](https://ui5.github.io/tutorials/walkthrough/walkthrough-step-04-js.zip).

</details>
***

### webapp/view/App.view.xml \(New\)

We create a new folder called `view` inside the `webapp` folder. This folder will hold all our XML view files. Inside the `view` folder, we create a new file called `App.view.xml`. In OpenUI5, the root node of an XML view is the `<mvc:View>` tag. To use this tag, we need to declare the XML namespace `mvc`, which corresponds to the `sap.ui.core.mvc` namespace. This namespace provides classes for creating and working with views and other Model-View-Controller \(MVC\) assets. Additionally, we declare the default XML namespace to the `sap.m` namespace. This namespace contains the majority of OpenUI5's UI assets, including the `Text` control that we want to use with our view.

Inside the `<mvc:View>` tag, we add the `<Text>` tag from the default XML namespace. This `<Text>` tag represents the text control that will be displayed on the view. We set the `text` attribute of the `<Text>` tag to "Hello World". This will display the text "Hello World" on the view.

```xml
<mvc:View
   xmlns="sap.m"
   xmlns:mvc="sap.ui.core.mvc">
   <Text text="Hello World"/>
</mvc:View>
```

We have created an XML view that displays a text control with the text "Hello World".

> 💡 **Tip:** <br>
> XML tags are mapped to UI controls, and attributes are mapped to the properties of the control. In this case, the `<Text>` tag represents the `Text` control in the sap.m library, and the `text` attribute sets the `text` property of the control.

> 📝 **Note:**  <br>
> The namespace identifies all resources of the project and has to be unique. If you develop your own application code or library, you cannot use the namespace prefix `sap`, because this namespace is reserved for SAP resources. Instead, simply define your own unique namespace \(for example, `myCompany.myApp`\).

***

### webapp/index.?s

As a next step, we are going to replace the `sap/m/Text` control in our `index.?s` file with the app view that we've just created. To do this, we utilize the `XMLView.create` function, which is a part of the `sap/ui/core/mvc/View` module. This function needs a `viewName` property, which indicates the resource that needs to be loaded. The `viewName` is a combination of the namespace defined in the bootstrap and the path to the app view, but without the ".view.xml" extension. In addition, we set the `id` property to "app". Providing a stable ID is beneficial as it offers an easy and consistent way to identify and refer to specific views and elements in your code, thus helping to keep your code organized.

```ts
import XMLView from "sap/ui/core/mvc/XMLView";

XMLView.create({
    viewName: "ui5.walkthrough.view.App",
    id: "app"
}).then(function (view) {
    view.placeAt("content");
});

```

```js
sap.ui.define(["sap/ui/core/mvc/XMLView"], function (XMLView) {
  "use strict";

  XMLView.create({
    viewName: "ui5.walkthrough.view.App",
    id: "app"
  }).then(function (view) {
    view.placeAt("content");
  });
});

```

We have now embed our app view to the body of the HTML document.

> 💡 **Tip:**  <br>
>Although setting an ID is not mandatory, it greatly improves the maintainability and flexibility of your code. With a stable ID, you can easily locate and update specific parts of your application.

***

### Conventions

-   View names are capitalized

-   All views are stored in the `view` folder

-   Names of XML views always end with `*.view.xml`

-   XML namespaces are declared in the root element of the view

-   As a general rule, the default XML namespace is `sap.m`

-   Other XML namespaces use the last part of the SAP namespace as alias \(for example, `mvc` for `sap.ui.core.mvc`\)

&nbsp;

***

**Next:** [Step 5: Controllers](../05/README.md "In this step, we replace the text with a button and show the Hello World message when the button is pressed. The handling of the button's press event is implemented in the controller of the view.")

**Previous:** [Step 3: Controls](../03/README.md "Now it's time to build our first little UI by replacing the Hello World text in the HTML body by the OpenUI5 control sap.m.Text. In the beginning, we will use the TypeScript control AOI to set up the UI, the control instance is then placed into the HTML body.")

***

**Related Information**

[Model View Controller \(MVC\)](https://sdk.openui5.org/topic/91f233476f4d1014b6dd926db0e91070.html "The Model View Controller (MVC) concept is used in OpenUI5 to separate the representation of information from the user interaction. This separation facilitates development and the changing of parts independently.")

[XML Namespaces - The xmlns Atribute](https://www.w3schools.com/XML/xml_namespaces.asp)
[Views](https://sdk.openui5.org/topic/91f27e3e6f4d1014b6dd926db0e91070.html "The view in the Model-View-Controller (MVC) concept is responsible for defining and rendering the UI. OpenUI5 supports predefined view types.")

[API Reference: sap.ui.core.mvc.View](https://sdk.openui5.org/api/sap.ui.core.mvc.View)

[XML View](https://sdk.openui5.org/topic/91f292806f4d1014b6dd926db0e91070.html "The XML view type is defined in an XML file. The file name either ends with .view.xml or as an XML string. The file name and the folder structure together specify the name of the view that equals the OpenUI5 module name.")

[API Reference: sap.ui.core.mvc.XMLView](https://sdk.openui5.org/api/sap.ui.core.mvc.xmlView)

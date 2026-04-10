## Step 15: Nested Views

Our panel content is getting more and more complex and now it is time to move the panel content to a separate view. With that approach, the application structure is much easier to understand, and the individual parts of the app can be reused.

&nbsp;

***

### Preview
  
![](assets/loiof3724d2f97e94a78b27d8ab01ff9c37d_LowRes.png "The panel content is now refactored to a separate view \(No visual changes to last step\)")

<sup>*The panel content is now refactored to a separate view \(No visual changes to last step\)*</sup>

You can access the live preview by clicking on this link: [🔗 Live Preview of Step 15](https://ui5.github.io/tutorials/walkthrough/build/15/index-cdn.html).

***


### Coding

<details class="ts-only">

You can download the solution for this step here: [📥 Download step 15](https://ui5.github.io/tutorials/walkthrough/walkthrough-step-15.zip).

</details>

<details class="js-only">

You can download the solution for this step here: [📥 Download step 15](https://ui5.github.io/tutorials/walkthrough/walkthrough-step-15-js.zip).

</details>
***

### webapp/controller/HelloPanel.controller.?s \(New\)

In folder `webapp/controller` we create a new `HelloPanel.controller.?s` file and move the method `onShowHello` of the app controller to it, so we get a reusable asset.

```ts
import Controller from "sap/ui/core/mvc/Controller";
import MessageToast from "sap/m/MessageToast";
import JSONModel from "sap/ui/model/json/JSONModel";
import ResourceModel from "sap/ui/model/resource/ResourceModel";
import ResourceBundle from "sap/base/i18n/ResourceBundle";

/**
 * @namespace ui5.walkthrough.controller
 */
export default class HelloPanel extends Controller {
    
    onShowHello(): void {
        // read msg from i18n model
        // functions with generic return values require casting 
        const resourceBundle = (this.getView()?.getModel("i18n") as ResourceModel)?.getResourceBundle() as ResourceBundle;
        const recipient = (this.getView()?.getModel() as JSONModel)?.getProperty("/recipient/name");
        const msg = resourceBundle.getText("helloMsg", [recipient]);
        // show message
        MessageToast.show(msg);
    }
};

```

```js
sap.ui.define(["sap/ui/core/mvc/Controller", "sap/m/MessageToast"], function (Controller, MessageToast) {
  "use strict";

  const HelloPanel = Controller.extend("ui5.walkthrough.controller.HelloPanel", {
    onShowHello() {
      // read msg from i18n model
      const recipient = this.getView()?.getModel()?.getProperty("/recipient/name");
      const resourceBundle = this.getView()?.getModel("i18n")?.getResourceBundle();
      const msg = resourceBundle.getText("helloMsg", [recipient]);
      // show message
      MessageToast.show(msg);
    }
  });
  ;
  return HelloPanel;
});

```

### webapp/view/HelloPanel.view.xml \(New\)

We create a new `HelloPanel.view.xml` file in folder `webapp/view` and move the whole panel from the App view to it. We also reference the controller we just created for the view by setting it to the `controllerName` attribute of the XML view.

```xml
<mvc:View
   controllerName="ui5.walkthrough.controller.HelloPanel"
   xmlns="sap.m"
   xmlns:mvc="sap.ui.core.mvc">
   <Panel
      headerText="{i18n>helloPanelTitle}"
      class="sapUiResponsiveMargin"
      width="auto" >
      <content>
         <Button
            text="{i18n>showHelloButtonText}"
            press=".onShowHello"
            class="myCustomButton"/>
         <Input
            value="{/recipient/name}"
            valueLiveUpdate="true"
            width="60%"/>
         <FormattedText
            htmlText="Hello {/recipient/name}"
            class="sapUiSmallMargin sapThemeHighlight-asColor myCustomText"/>
      </content>
   </Panel>
</mvc:View>
```

### webapp/view/App.view.xml

In the App view, we remove the panel control and its content and put the `XMLView` control to the content of the page instead. We add the `viewName` attribute with the value `ui5.walkthrough.view.HelloPanel` to reference the new view that now contains the panel.

```xml
<mvc:View
	controllerName="ui5.walkthrough.controller.App"
	xmlns="sap.m"
	xmlns:mvc="sap.ui.core.mvc"
	displayBlock="true">
	<Shell>
		<App class="myAppDemoWT">
			<pages>
				<Page title="{i18n>homePageTitle}">
					<content>
						<mvc:XMLView viewName="ui5.walkthrough.view.HelloPanel"/>
					</content>
				</Page>
			</pages>
		</App>
	</Shell>
</mvc:View>
```

### webapp/controller/App.controller.?s

We remove the `onShowHello` method from the App controller, as this is not needed anymore.

```ts
import Controller from "sap/ui/core/mvc/Controller";
/**
 * @namespace ui5.walkthrough.controller
 */
export default class App extends Controller {

};

```

```js
sap.ui.define(["sap/ui/core/mvc/Controller"], function (Controller) {
  "use strict";

  const App = Controller.extend("ui5.walkthrough.controller.App", {});
  ;
  return App;
});

```
&nbsp;

We have now moved everything out of the app view and controller. The app controller remains an empty stub for now, we will use it later to add more functionality.

&nbsp;

***

**Next:** [Step 16: Dialogs and Fragments](../16/README.md "In this step, we will take a closer look at another element which can be used to assemble views: the fragment.")

**Previous:** [Step 14: Margins and Paddings](../14/README.md "Sometimes we need to define some more fine-granular layouts and this is when we can use the flexibility of CSS by adding custom style classes to controls and style them as we like.")

***

**Related Information**  

[API Reference: `sap.ui.core.mvc.XMLView`](https://sdk.openui5.org/api/sap.ui.core.mvc.XMLView#controlProperties)

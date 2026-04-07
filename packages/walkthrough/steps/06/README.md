## Step 6: Modules

In OpenUI5, resources are often referred to as modules. In this step, we replace the alert from the last exercise with a proper Message Toast from the `sap.m` library.

&nbsp;

***

### Preview

![](assets/loio2f629a95211f49afa367b60d233fb390_LowRes.png "A message toast displays the &quot;Hello World&quot; message")

<sup>*A message toast displays the "Hello World" message*</sup>

You can access the live preview by clicking on this link: [🔗 Live Preview of Step 6](https://sap-samples.github.io/ui5-typescript-walkthrough/walkthrough/build/06/index-cdn.html).

***

### Coding

<details class="ts-only">

You can download the solution for this step here: [📥 Download step 6](https://sap-samples.github.io/ui5-typescript-walkthrough/walkthrough/walkthrough-step-06.zip).

</details>

<details class="js-only">

You can download the solution for this step here: [📥 Download step 6](https://sap-samples.github.io/ui5-typescript-walkthrough/walkthrough/walkthrough-step-06-js.zip).

</details>
***

### webapp/controller/App.controller.?s

We now replace the native `alert` function with the `show` method of the `sap.m.MessageToast` control of OpenUI5. 


```ts
import MessageToast from "sap/m/MessageToast";
import Controller from "sap/ui/core/mvc/Controller";

/**
 * @name ui5.walkthrough.controller.App
 */
export default class AppController extends Controller {
    onShowHello(): void {
        MessageToast.show("Hello World");
     }
};

```

```js
sap.ui.define(["sap/m/MessageToast", "sap/ui/core/mvc/Controller"], function (MessageToast, Controller) {
  "use strict";

  /**
   * @name ui5.walkthrough.controller.App
   */
  const AppController = Controller.extend("ui5.walkthrough.controller.App", {
    onShowHello() {
      MessageToast.show("Hello World");
    }
  });
  ;
  return AppController;
});

```

For now, the message toast just displays a static "Hello World" message. We will show how to load a translated text here in [Step 8: Translatable Texts](../08/README.md).

&nbsp;

***

**Next:** [Step 7: JSON Model](../07/README.md "Now that we have set up the view and controller, it’s about time to think about the M in MVC.")

**Previous:** [Step 5: Controllers](../05/README.md "In this step, we replace the text with a button and show the Hello World message when the button is pressed. The handling of the button's press event is implemented in the controller of the view.")

***

**Related Information**  

[API Reference: `sap.m.MessageToast`](https://sdk.openui5.org/api/sap.m.MessageToast#methods)

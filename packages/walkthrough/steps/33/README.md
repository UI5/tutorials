## Step 33: Custom Controls

In this step, we are going to extend the functionality of OpenUI5 with a custom control. We want to rate the product shown on the detail page, so we create a composition of multiple standard controls using the OpenUI5 extension mechanism and add some glue code to make them work nicely together. This way, we can reuse the control across the app and keep all related functionality in one module.

&nbsp;

***

### Preview
    
![](assets/loio21dd14c37b67473b817c8865f168f668_LowRes.png "A custom product rating control is added to the detail page")

<sup>*A custom product rating control is added to the detail page*</sup>

You can access the live preview by clicking on this link: [🔗 Live Preview of Step 33](https://ui5.github.io/tutorials/walkthrough/build/33/test/mockServer-cdn.html).
 
***

### Coding
<details class="ts-only">

You can download the solution for this step here: [📥 Download step 33](https://ui5.github.io/tutorials/walkthrough/walkthrough-step-33.zip).

</details>

<details class="js-only">

You can download the solution for this step here: [📥 Download step 33](https://ui5.github.io/tutorials/walkthrough/walkthrough-step-33-js.zip).

</details>
***

### webapp/i18n/i18n.properties

For our new product rating custom control we will need some additional text resources: Firstly, we'll need some labels for the custom control, interacting with the user. Then, we want to display a confirmation message on the detail page once a user provided its rating.

```ini
…
# Detail Page
detailPageTitle=UI5 TypeScript Walkthrough - Details
ratingConfirmation=You have rated this product with {0} stars

# Product Rating
productRatingLabelInitial=Please rate this product
productRatingLabelIndicator=Your rating: {0} out of {1}
productRatingLabelFinal=Thank you for your rating!
productRatingButton=Rate
```

### webapp/css/style.css

To layout our new custom control, we specify some additional css. We create a root class `myAppDemoWTProductRating` that sets the padding to `0.75rem`. We will use this class to specify some space around our inner controls. In a second rule we reset the vertical alignment of controls with the class `sapMRI` assigned to inside controls with the class `myAppDemoWTProductRating` to the initial value. We'll need this rule to align all the controls we use with our composition.

```css
html[dir="ltr"] .myAppDemoWT .myCustomButton.sapMBtn {
	margin-right: 0.125rem
}
html[dir="rtl"] .myAppDemoWT .myCustomButton.sapMBtn {
	margin-left: 0.125rem
}
.myAppDemoWT .myCustomText {
	display: inline-block;
    font-weight: bold;
}
/*  ProductRating */
.myAppDemoWTProductRating {
	padding: 0.75rem;
}
.myAppDemoWTProductRating .sapMRI {
	vertical-align: initial;
}
```

We could also do this with more HTML in the renderer but this is the simplest way and it will only be applied inside our custom control. However, please be aware that the custom control is in your app and might have to be adjusted when the inner controls change in future versions of OpenUI5.

### webapp/control/ProductRating.?s \(New\)

Custom controls are small reuse components that can be created within an application very easily. Due to their nature, they are sometimes also referred to as "notepad” or “on the fly” controls. A custom control is an object that has two special sections \(`metadata` and `renderer`\) and various methods that determine the control's functionality.

To set up our new control, we create a new folder named `control` inside the `webapp` folder. Within this folder, we create a new file named `ProductRating.ts` - this file will contain the code for our new control.

We import two classes, `Control` and `RenderManager`, from the `sap/ui/core` module. These classes are part of the OpenUI5 framework and are used for creating controls and managing their rendering. Then, we declare a new class named `ProductRating` by extending the base class `sap.ui.core.Control`. This class will define your custom control.

To add functionality to the control, we can provide meta information via a static property named `metadata`. This property defines the data structure and thus the API of the control. With this metadata for the control's properties, events, and aggregations, OpenUI5 can automatically creates setter and getter methods along with other convenience functions that can be used within the application. For now, we will leave the `metadata` property empty.

The `init` function is a lifecycle function that is automatically called by the OpenUI5 framework when an instance of the control is created. We'll use this function to initialize the control and prepare its contents for display.

The static `renderer` property expects an object that defines how the control is rendered. It is invoked initially by the OpenUI5 framework and each time a property of the control is changed. The `renderer` object has two properties: `apiVersion` and `render`. The `apiVersion` property specifies the API version of the RenderManager that is used in this renderer. The `render` property is a method that takes two parameters: a `RenderManager` object and the control instance itself. We'll delve into the implementation of our control's rendering within this method at a later stage.

> 📝 **Note:** <br>
> The RenderManager is an important component in OpenUI5 that is responsible for converting abstract representations of controls into actual HTML elements that can be displayed in the browser. There are different versions of the RenderManager API, each representing an evolution of the RenderManager with specific sets of APIs and rendering techniques. These different API versions are important to ensure compatibility between different versions of OpenUI5.
>
> The latest version of the RenderManager API is version 4, which introduces new features and improvements compared to previous versions. It also includes performance enhancements, making your applications run faster and more efficiently. For example, version 4 avoids re-rendering of child controls unless they are invalidated, which can save processing time.
>
> When developing a custom control, it is crucial to specify the appropriate apiVersion for the control's renderer. This ensures that your control can leverage the latest rendering features and improvements available in the RenderManager.

```ts
import Control from "sap/ui/core/Control";
import RenderManager from "sap/ui/core/RenderManager";

/**
 * @namespace ui5.walkthrough.control
 */
export default class ProductRating extends Control {

	static readonly metadata: MetadataOptions = {

	}

	init(): void {

	}

	static renderer = {
		apiVersion: 4,
		render: (rm: RenderManager, control: ProductRating) => {
		}
	}
};
```

```js
sap.ui.define(["sap/ui/core/Control"], function (Control) {
  "use strict";

  const ProductRating = Control.extend("ui5.walkthrough.control.ProductRating", {
    renderer: {
      apiVersion: 4,
      render: (rm, control) => { }
    },
    metadata: {},
    init() {},
  });
  ;
  return ProductRating;
});

```
&nbsp;
> 📌 **Remember:** <br>
> Controls always extend `sap.ui.core.Control` and render themselves. You could also extend `sap.ui.core.Element` or `sap.ui.base.ManagedObject` directly if you want to reuse life cycle features of OpenUI5 including data binding for objects that are not rendered. Please refer to the API reference to learn more about the inheritance hierarchy of controls.

We now enhance our new custom control with the custom functionality that we need. In our case we want to create an interactive product rating feature. We utilize three controls provided by the sap.m library to compose our custom control: A `RatingIndicator` control to collect user input on a product, a `Label` control to display additional information, and a `Button` control that allows users to submit their rating.

In the `metadata` section we therefore define several properties that we make use in the implementation (for details on individual metadata properties, see [`MetadataOptions`](https://sdk.openui5.org/api/sap.ui.base.ManagedObject.MetadataOptions)):

-   Properties

	We define the control property `value` and set its `type` to "float" and the `defaultValue` to "0". It will hold the value that the user selected in the rating. Getter and setter function for this property will automatically be created and we can also bind it to a field of the data model in the view if we like.

-   Aggregations

	As described in the first paragraph, we need three internal controls to realize our rating functionality. We therefore create three “hidden aggregations” by setting the `visibility` attribute to `hidden`. This way, we can use the models that are set on the view also in the inner controls and OpenUI5 will take care of the lifecycle management and destroy the controls when they are not needed anymore. Aggregations can also be used to hold arrays of controls but we just want a single control in each of the aggregations so we need to adjust the cardinality by setting the attribute `multiple` to `false`.

	> 📝 **Note:** <br>
	> You can define `aggregations` and `associations`
	> 
	> -   An **`aggregation`** is a strong relation that also manages the lifecycle of the related control, for example, when the parent is destroyed, the related control is also destroyed. Also, a control can only be assigned to one single aggregation, if it is assigned to a second aggregation, it is removed from the previous aggregation automatically.
	> 
	> -   An **`association`** is a weak relation that does not manage the lifecycle and can be defined multiple times. To have a clear distinction, an association only stores the ID, whereas an aggregation stores the direct reference to the control. We do not specify associations in this example, as we want to have our internal controls managed by the parent.

-   Events

	We specify a `change` event that the control will fire when the rating is submitted. It contains the control property `value` as event parameter. Applications can register to this event and process the result similar to “regular” OpenUI5 controls, which are in fact built similar to custom controls.

In the `init` function we instantiate the three controls and store them in the internal aggregation by calling the framework method `setAggregation` that has been inherited from `sap.ui.core.Control` one after the other. We pass on the name of the internal aggregations that we specified above and the new control instances. We specify some control properties to make our custom control look nicer and register a `liveChange` event to the rating and a press event to the button. The initial texts for the label and the button are referenced from our `i18n` model.

Let’s ignore the other internal helper functions and event handlers for now and define our renderer. By using the APIs of the RenderManager and the control instance that are passed as references, we can describe the necessary HTML for our control. To open a new HTML tag we use the `openStart` method and pass `"div"` as the HTML element to be created. We also pass our control instance (ProductRating) to be associated with the HTML tag. The RenderManager will automatically generate the properties for the control and assign it to the `div` tag. After calling `openStart`, we can chain additional methods to set attributes or styles for the element. To set our custom CSS class `myAppDemoWTProductRating` for the `div` element, we use the `class` method. If a `tooltip` exists, we call the `attr` method to set the `title` attribute with the value of the tooltip for the div element. Finally, we close the surrounding `div` tag by calling `openEnd`.

> 📌 **Remember:**  <br>
> Since our custom control extends the `sap.ui.core.Control` class, it also inherits its properties and aggregations from it. In this case, the `tooltip` property is defined in the `sap.ui.core.Element` class, which is inherited by the `sap.ui.core.Control` class. Therefore, your custom control also inherits this aggregation. However, controls must explicitly support tooltips as they have to render them.

Next, we render the three child controls we defined in the aggregation of our ProductRating control. We retrieve the child controls using the `getAggregation` method with the aggregation name as the parameter. The `renderControl` method is then called on each child control to render them. Finally, we close the element by calling the `close` method on the RenderManager and passing the `"div"` element name as argument. This completes the rendering of the custom control.

The `setValue` is an overridden setter. OpenUI5 will generate a setter that updates the property value when called in a controller or defined in the XML view, but we also need to update the internal rating control in the hidden aggregation to reflect the state properly. Also, we can skip the rerendering of OpenUI5 that is usually triggered when a property is changed on a control by calling the `setProperty` method to update the control property with true as the third parameter.

Now we define the event handler for the internal rating control. It is called every time the user changes the rating. The current value of the rating control can be read from the event parameter value of the `sap.m.RatingIndicator` control. With the value we call the `setProperty` method to update the control state, then we update the `label` next to the rating to show the user which value he has selected currently and also displays the maximum value. The string with the placeholder values is read from the `i18n` model that is assigned to the control automatically.

Next, we have the `press` handler for the rating button that submits our rating. We assume that rating a product is a one-time action and first disable the rating and the button so that the user is not allowed to submit another rating. We also update the label to show a "Thank you for your rating!" message, then we fire the change event of the control and pass in the current value as a parameter so that applications that are listening to this event can react on the rating interaction.

We define the `reset` method to be able to revert the state of the control on the UI to its initial state so that the user can again submit a rating.

```ts
import Control from "sap/ui/core/Control";
import RenderManager from "sap/ui/core/RenderManager";
import { MetadataOptions } from "sap/ui/core/Element";
import Label from "sap/m/Label";
import Button, { Button$PressEvent } from "sap/m/Button";
import RatingIndicator, { RatingIndicator$LiveChangeEvent } from "sap/m/RatingIndicator";
import ResourceBundle from "sap/base/i18n/ResourceBundle";
import ResourceModel from "sap/ui/model/resource/ResourceModel";

/**
 * @namespace ui5.walkthrough.control
 */
export default class ProductRating extends Control {
	// The following three lines were generated and should remain as-is to make TypeScript aware of the constructor signatures
	constructor(idOrSettings?: string | $ProductRatingSettings);
	constructor(id?: string, settings?: $ProductRatingSettings);
	constructor(id?: string, settings?: $ProductRatingSettings) { super(id, settings); }

	static readonly metadata: MetadataOptions = {
		properties: {
			value: {
				type: "float",
				defaultValue: 0
			}
		},
		aggregations: {
			_rating: {
				type: "sap.m.RatingIndicator",
				multiple: false,
				visibility: "hidden"
			},
			_label: {
				type: "sap.m.Label",
				multiple: false,
				visibility: "hidden"
			},
			_button: {
				type: "sap.m.Button",
				multiple: false,
				visibility: "hidden"
			}
		},
		events: {
			change: {
				parameters: {
					"value": "float"
				}
			}
		}
	}

	init(): void {
		this.setAggregation("_rating", new RatingIndicator({
			value: this.getValue(),
			iconSize: "2rem",
			liveChange: this._onRate.bind(this)
		}));
		this.setAggregation("_label", new Label({
			text: "{i18n>productRatingLabelInitial}"
		}).addStyleClass("sapUiSmallMargin"));
		this.setAggregation("_button", new Button({
			text: "{i18n>productRatingButton}",
			press: this._onSubmit.bind(this)
		}).addStyleClass("sapUiTinyMarginTopBottom"));
	}

	setValue(value: "float" ): ProductRating {
		this.setProperty("value", value, true);
		(this.getAggregation("_rating") as RatingIndicator).setValue(value);

		return this;
	}

	reset(): void {
		const resourceBundle = (this?.getModel("i18n") as ResourceModel)?.getResourceBundle() as ResourceBundle;

		this.setValue(0);
		(this.getAggregation("_label") as Label).setDesign("Standard");
		(this.getAggregation("_rating") as RatingIndicator).setEnabled(true);
		(this.getAggregation("_label") as Label).setText(resourceBundle.getText("productRatingLabelInitial"));
		(this.getAggregation("_button") as Button).setEnabled(true);
	}

	_onRate(event: RatingIndicator$LiveChangeEvent): void {
		const resourceBundle = (this?.getModel("i18n") as ResourceModel)?.getResourceBundle() as ResourceBundle;
		const value = event.getParameter("value");

		this.setProperty("value", value, true);

		(this.getAggregation("_label") as Label).setText(resourceBundle.getText("productRatingLabelIndicator", [value, (event.getSource() as RatingIndicator).getMaxValue()]));
		(this.getAggregation("_label") as Label).setDesign("Bold");
	}

	_onSubmit(event: Button$PressEvent): void {
		const resourceBundle = (this?.getModel("i18n") as ResourceModel)?.getResourceBundle() as ResourceBundle;

		(this.getAggregation("_rating") as RatingIndicator).setEnabled(false);
		(this.getAggregation("_label") as Label).setText(resourceBundle.getText("productRatingLabelFinal"));
		(this.getAggregation("_button") as Button).setEnabled(false);
		this.fireEvent("change", {
			value: this.getValue()
		})
	}

	static renderer = {
		apiVersion: 4,
		render: (rm: RenderManager, control: ProductRating) => {
			const tooltip = control.getTooltip_AsString();
			rm.openStart("div", control);
			rm.class("myAppDemoWTProductRating");
			if (tooltip) {
				rm.attr("title", tooltip);
			}
			rm.openEnd();
			rm.renderControl(control.getAggregation("_rating") as Control);
			rm.renderControl(control.getAggregation("_label") as Control);
			rm.renderControl(control.getAggregation("_button") as Control);
			rm.close("div");
		}
	}
};
```

```js
sap.ui.define(["sap/ui/core/Control", "sap/m/Label", "sap/m/Button", "sap/m/RatingIndicator"], function (Control, Label, Button, RatingIndicator) {
  "use strict";

  const ProductRating = Control.extend("ui5.walkthrough.control.ProductRating", {
    renderer: {
      apiVersion: 4,
      render: (rm, control) => {
        const tooltip = control.getTooltip_AsString();
        rm.openStart("div", control);
        rm.class("myAppDemoWTProductRating");
        if (tooltip) {
          rm.attr("title", tooltip);
        }
        rm.openEnd();
        rm.renderControl(control.getAggregation("_rating"));
        rm.renderControl(control.getAggregation("_label"));
        rm.renderControl(control.getAggregation("_button"));
        rm.close("div");
      }
    },
    metadata: {
      properties: {
        value: {
          type: "float",
          defaultValue: 0
        }
      },
      aggregations: {
        _rating: {
          type: "sap.m.RatingIndicator",
          multiple: false,
          visibility: "hidden"
        },
        _label: {
          type: "sap.m.Label",
          multiple: false,
          visibility: "hidden"
        },
        _button: {
          type: "sap.m.Button",
          multiple: false,
          visibility: "hidden"
        }
      },
      events: {
        change: {
          parameters: {
            "value": "float"
          }
        }
      }
    },
    constructor(id, settings) {
      Control.prototype.constructor.call(this, id, settings);
    },
    init() {
      this.setAggregation("_rating", new RatingIndicator({
        value: this.getValue(),
        iconSize: "2rem",
        liveChange: this._onRate.bind(this)
      }));
      this.setAggregation("_label", new Label({
        text: "{i18n>productRatingLabelInitial}"
      }).addStyleClass("sapUiSmallMargin"));
      this.setAggregation("_button", new Button({
        text: "{i18n>productRatingButton}",
        press: this._onSubmit.bind(this)
      }).addStyleClass("sapUiTinyMarginTopBottom"));
    },
    setValue(value) {
      this.setProperty("value", value, true);
      this.getAggregation("_rating").setValue(value);
      return this;
    },
    reset() {
      const resourceBundle = this?.getModel("i18n")?.getResourceBundle();
      this.setValue(0);
      this.getAggregation("_label").setDesign("Standard");
      this.getAggregation("_rating").setEnabled(true);
      this.getAggregation("_label").setText(resourceBundle.getText("productRatingLabelInitial"));
      this.getAggregation("_button").setEnabled(true);
    },
    _onRate(event) {
      const resourceBundle = this?.getModel("i18n")?.getResourceBundle();
      const value = event.getParameter("value");
      this.setProperty("value", value, true);
      this.getAggregation("_label").setText(resourceBundle.getText("productRatingLabelIndicator", [value, event.getSource().getMaxValue()]));
      this.getAggregation("_label").setDesign("Bold");
    },
    _onSubmit(event) {
      const resourceBundle = this?.getModel("i18n")?.getResourceBundle();
      this.getAggregation("_rating").setEnabled(false);
      this.getAggregation("_label").setText(resourceBundle.getText("productRatingLabelFinal"));
      this.getAggregation("_button").setEnabled(false);
      this.fireEvent("change", {
        value: this.getValue()
      });
    }
  });
  ;
  return ProductRating;
});

```

<details class="ts-only">
### Generate Control Interfaces to Resolve the TypeScript Errors

While the application would run successfully, the editor still displays an error in the `ProductRating.ts` renderer.

The solution is to use the [ts-interface-generator](https://www.npmjs.com/package/@ui5/ts-interface-generator), a small tools that scans the project for any controls (as well as other subclasses of sap.ui.ManagedObject) and generates TypeScript interface definitions declaring those generated methods.

-  Open a new terminal window in your app root folder and execute `npm install @ui5/ts-interface-generator --save-dev` to install this package as a new development dependency in your `package.json`.

-  Run `ui5-serve`. This starts the interface generator tool in "watch" mode and creates the required interface definition (after a short startup delay during which all existing types in the project and in UI5 are scanned).

You can inspect the generated file webapp/control/ProductRating.gen.d.ts next to the control implementation. It defines an interface with the same name as the control class and declares the same module name. This causes [TypeScript to merge the definitions](https://www.typescriptlang.org/docs/handbook/declaration-merging.html) and to assume that the interface methods also exist in the class.

As a result, the TypeScript error message related to the new `ProductRating` control is gone and code completion is also available for all control API methods.

You can now stop the interface generator again, as no further control API changes will be done in this tutorial. For continuous control development with frequent API changes, you would likely add a "watch" script to `package.json` for starting this generator.

</details>

### webapp/controller/Detail.controller.?s

In the `Detail` controller we implement a new `onRatingChange` event that reads the value of our coustom change event that is fired when a rating has been submitted. This requires to import our new control, as well as the `ProductRating$ChangeEvent` type we just defined to the detail controller. To keep the sample simple we only display a message message instead of sending the rating to the backend. We therefore load the `MessageToast` module from the `sap.m` namespace to our script. In addition we need the `ResourceBundle` module from the `sap/base/i18n` namespace as well as the `ResourceModel` module from the `sap/ui/model/resource` namespace as we want to display the confirmation message we specified in our resource bundle in the message toast.

In the `onRatingChange` the event handler we extract the value of our custom change event that is fired when the rating has been submitted. We then display the confirmation message we defined in our resource bundle with the rating value in a `MessageToast` control.

In the `onObjectMatched` method, we call the `reset` method to make it possible to submit another rating as soon as the detail view is displayed for a different item.

```ts
import Controller from "sap/ui/core/mvc/Controller";
import { Route$PatternMatchedEvent } from "sap/ui/core/routing/Route";
import History from "sap/ui/core/routing/History";
import MessageToast from "sap/m/MessageToast";
import ProductRating, { ProductRating$ChangeEvent } from "../control/ProductRating";
import ResourceBundle from "sap/base/i18n/ResourceBundle";
import ResourceModel from "sap/ui/model/resource/ResourceModel";
import UIComponent from "sap/ui/core/UIComponent";

/**
 * @namespace ui5.walkthrough.controller
 */
export default class Detail extends Controller {

    onInit(): void {
        const router = UIComponent.getRouterFor(this);
        router.getRoute("detail").attachPatternMatched(this.onObjectMatched, this);
    }

    onObjectMatched(event: Route$PatternMatchedEvent): void {
    
        (this.byId("rating") as ProductRating).reset();
        this.getView().bindElement({
            path: "/" + window.decodeURIComponent((event.getParameter("arguments") as any).invoicePath),
            model: "invoice"
        });
    }

    onNavBack(): void {
        const history = History.getInstance();
        const previousHash = history.getPreviousHash();

        if (previousHash !== undefined) {
            window.history.go(-1);
        } else {
            const router = UIComponent.getRouterFor(this);
            router.navTo("overview", {}, true);
        }
    }    
    
    onRatingChange(event: ProductRating$ChangeEvent): void {
        const value = event.getParameter("value");
        const resourceBundle = (this?.getView().getModel("i18n") as ResourceModel)?.getResourceBundle() as ResourceBundle;

        MessageToast.show(resourceBundle.getText("ratingConfirmation", [value]));
    }    
};

```

```js
sap.ui.define(["sap/ui/core/mvc/Controller", "sap/ui/core/routing/History", "sap/m/MessageToast", "sap/ui/core/UIComponent"], function (Controller, History, MessageToast, UIComponent) {
  "use strict";

  const Detail = Controller.extend("ui5.walkthrough.controller.Detail", {
    onInit() {
      const router = UIComponent.getRouterFor(this);
      router.getRoute("detail").attachPatternMatched(this.onObjectMatched, this);
    },
    onObjectMatched(event) {
      this.byId("rating").reset();
      this.getView().bindElement({
        path: "/" + window.decodeURIComponent(event.getParameter("arguments").invoicePath),
        model: "invoice"
      });
    },
    onNavBack() {
      const history = History.getInstance();
      const previousHash = history.getPreviousHash();
      if (previousHash !== undefined) {
        window.history.go(-1);
      } else {
        const router = UIComponent.getRouterFor(this);
        router.navTo("overview", {}, true);
      }
    },
    onRatingChange(event) {
      const value = event.getParameter("value");
      const resourceBundle = this?.getView().getModel("i18n")?.getResourceBundle();
      MessageToast.show(resourceBundle.getText("ratingConfirmation", [value]));
    }
  });
  ;
  return Detail;
});

```

### webapp/view/Detail.view.xml

All we need now is to add our new control to the detail view. To do so we must add a new namespace `wt` on the view so that we can reference our custom controls easily in the view. We then add an instance of the `ProductRating` control to our detail page and register our event handler for the change event. As we want to reset the value when navigating away, we need to assign an id to the control. To have a proper layout, we also add a margin style class.

```xml
<mvc:View
	controllerName="ui5.walkthrough.controller.Detail"
	xmlns="sap.m"
	xmlns:mvc="sap.ui.core.mvc"
	xmlns:wt="ui5.walkthrough.control">
	<Page
		title="{i18n>detailPageTitle}"
		showNavButton="true"
		navButtonPress=".onNavBack">
		<ObjectHeader
			intro="{invoice>ShipperName}"
			title="{invoice>ProductName}"/>
		<wt:ProductRating 
			id="rating"
			tooltip="{invoice>ProductName}"
			class="sapUiSmallMarginBeginEnd" 
			change=".onRatingChange"/>
	</Page>
</mvc:View>
```
&nbsp;
We can now rate a product on the detail page with our brand new control.

<details class="ts-only">

### webapp/control/ProductRating.ts

When opening the detail page you get a note in the console informing you that there is still something missing in our `ProductRating` script. 

The label says:
&nbsp;
NOTE:<br>
Class ProductRating in file [..]/webapp/control/ProductRating.ts needs to contain the following constructors, in order to make TypeScript aware of the possible constructor settings. Please copy&paste the block manually, as the ts-interface-generator will not touch your source files:
===== BEGIN =====
// The following three lines were generated and should remain as-is to make TypeScript aware of the constructor signatures
constructor(idOrSettings?: string | $ProductRatingSettings);
constructor(id?: string, settings?: $ProductRatingSettings);
constructor(id?: string, settings?: $ProductRatingSettings) { super(id, settings); }
===== END =====
&nbsp;

To complete the setup of the generated interface, we follow the instructions and add the block between the BEGIN and END line into the `ProductRating` class body in the file `webapp/control/ProductRating.ts`.

```ts
import Control from "sap/ui/core/Control";
import RenderManager from "sap/ui/core/RenderManager";
import { MetadataOptions } from "sap/ui/core/Element";
import Label from "sap/m/Label";
import Button, { Button$PressEvent } from "sap/m/Button";
import RatingIndicator, { RatingIndicator$LiveChangeEvent } from "sap/m/RatingIndicator";
import ResourceBundle from "sap/base/i18n/ResourceBundle";
import ResourceModel from "sap/ui/model/resource/ResourceModel";

/**
 * @namespace ui5.walkthrough.control
 */
export default class ProductRating extends Control {
	// The following three lines were generated and should remain as-is to make TypeScript aware of the constructor signatures
	constructor(idOrSettings?: string | $ProductRatingSettings);
	constructor(id?: string, settings?: $ProductRatingSettings);
	constructor(id?: string, settings?: $ProductRatingSettings) { super(id, settings); }	

    ...
}
```
&nbsp;
Adding the block between the BEGIN and END line into the `ProductRating` class body in the file `webapp/control/ProductRating.ts` provides the constructors and the structure of the constructor settings object. As result, the constructor signatures with and without control ID are available. Furthermore, TypeScript checks the settings you give in the constructor and suggests the available ones, like the direction property.
</details>

***

### Conventions

-   Put custom controls in the `control` folder of your app.

&nbsp;

***

**Next:** [Step 34: Responsiveness](../34/README.md "In this step, we improve the responsiveness of our app. OpenUI5 applications can be run on phone, tablet, and desktop devices and we can configure the application to make best use of the screen estate for each scenario. Fortunately, OpenUI5 controls like the sap.m.Table already deliver a lot of features that we can use.")

**Previous:** [Step 32: Routing Back and History](../32/README.md "Now we can navigate to our detail page and display an invoice, but we cannot go back to the overview page yet. We'll add a back button to the detail page and implement a function that shows our overview page again.")

***

**Related Information**  

[Developing Controls](https://sdk.openui5.org/topic/8dcab0011d274051808f959800cabf9f.html "You can create own content for OpenUI5. To develop controls in JavaScript, you can either extend existing controls or create new ones.")

[API Reference: `sap.ui.core.Control`](https://sdk.openui5.org/api/sap.ui.core.Control)

[Defining the Control Metadata](https://sdk.openui5.org/topic/7b52540d9d8c4e00b9723151622bbb64.html "Control metadata consists of properties, events, as well as aggregations and associations.")

[Init() Method](https://sdk.openui5.org/topic/6d6b5bda5727419eadcc9cbac1f6e6a1 "The init() method can be used to set up, for example, internal variables or subcontrols of a composite control.")

[API Reference: `sap.ui.core.ControlRenderer`](https://sdk.openui5.org/api/sap.ui.core.ControlRenderer)

[Renderer Object](https://sdk.openui5.org/topic/c9ab34570cc14ea5ab72a6d1a4a03e3f "The renderer object is responsible for creating the HTML structure for the control.")

[API Reference: `sap.ui.core.RenderManager`](https://sdk.openui5.org/api/sap.ui.core.RenderManager)

[UI5 Rendering: The Next Big Step Towards a Better Performance](https://blogs.sap.com/2023/04/05/the-next-innovation-of-ui5-rendering/)

[API Reference: `sap.m.RatingIndicator`](https://sdk.openui5.org/api/sap.m.RatingIndicator)

[API Reference: `sap.m.Label`](https://sdk.openui5.org/api/sap.m.Label)

[API Reference: `sap.m.Button`](https://sdk.openui5.org/api/sap.m.Button)

[API Reference: `sap.ui.core.Element`](https://sdk.openui5.org/api/sap.ui.core.Element)

[Event Handler Methods](https://sdk.openui5.org/topic/bdf3e9818cd84d37a18ee5680e97e1c1 "Event handler methods are invoked when an event occurs. Method names starting with on are reserved for event handler methods.")

[NPM Package: `ui5/ts-interface-generator`](https://www.npmjs.com/package/@ui5/ts-interface-generator "This npm package supports UI5 control development in TypeScript by generating TypeScript interfaces which declare the methods generated by UI5 only at runtime.")

[TypeScript: Declaration Merging](https://www.typescriptlang.org/docs/handbook/declaration-merging.html "Some of the unique concepts in TypeScript describe the shape of JavaScript objects at the type level. One example that is especially unique to TypeScript is the concept of ‘declaration merging’. Understanding this concept will give you an advantage when working with existing JavaScript. It also opens the door to more advanced abstraction concepts.")

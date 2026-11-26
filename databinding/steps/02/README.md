
## Step 2: Creating a Model

In this step, we create a model. It serves as a container for the data your application operates on.

You can define the business data within a model using various formats:

- JavaScript Object Notation \(JSON\)

- Extensible Markup Language \(XML\)

- OData

- Your own custom format \(not covered in this tutorial\)

> 📝
> There's also a special type of model called a "resource model". This model type is used as a wrapper object around a resource bundle file. The names of such files must end with `.properties`. They're typically used for holding language-specific text.
>
> We'll use this in [Step 6: Resource Models](../06/README.md).

When you create JSON, XML, and resource models, the data they contain is loaded in a single request \(either from a file stored locally on the client or by requesting it from a Web server\). In other words, after the model's data has been requested, the entire model is known to the application. These models are known as client-side models. Tasks such as filtering and sorting are performed locally on the client.

An OData model, however, is a server-side model. This means that whenever an application needs data from the model, it must be requested from the server. Such a request almost never returns all the data in the model, typically because this would be far more data than the client application requires. Consequently, tasks such as sorting and filtering should always be delegated to the server.

In this tutorial, we focus on JSON models since they're the simplest ones to work with.

### Preview

![The browser shows the text "Hi, my name is Harry Hawk"](assets/Tutorial_Data_Binding_Step_1_6d391d5.png "The browser shows the text &quot;Hi, my name is Harry Hawk&quot;")

You can view this step live: [🔗 Live Preview of Step 2](https://ui5.github.io/tutorials/databinding/build/02/index-cdn.html).

### Coding

You can download the solution for this step here: <span class="ts-only">[📥 Download step 2](https://ui5.github.io/tutorials/databinding/databinding-step-02.zip)<span class="lang-suffix"> (TS)</span></span><span class="js-only">[📥 Download step 2](https://ui5.github.io/tutorials/databinding/databinding-step-02-js.zip)<span class="lang-suffix"> (JS)</span></span>.

#### Folder structure for this step

{% raw %}
```text
webapp/
├── model/
│   └── data.json
├── view/
│   └── App.view.xml
├── Component.ts/.js
├── index.html
└── manifest.json
```
{% endraw %}

1. Create a new folder named `model` in the `webapp` folder. In this folder, create a file called `data.json` with the following content:

### webapp/model/data.json \(New\)

{% raw %}
```json
{
	"greetingText": "Hi, my name is Harry Hawk"
}
```
{% endraw %}

2. Create a new JSON model in the `manifest.json` and set its path via a URI. This binds the model object to the app component and makes it globally available to all controls used within the application.

### webapp/manifest.json

{% raw %}
```json
{
  ...
  "sap.ui5": {
    ...
    "models": {
      "": {
        "type": "sap.ui.model.json.JSONModel",
        "uri": "./model/data.json"
      }
    },
    ...
  }
}
```
{% endraw %}

Generally speaking, a model object holding business data should be bound to the app's `Component.ts/.js` or to the view that displays the data. For an example, see the *Walkthrough* tutorial, [Step 7: JSON Model](../../walkthrough/steps/07/README.md) \(binding to the View\) or [Step 9: Component Configuration](../../walkthrough/steps/09/README.md) \(binding to the Component\).

The text that is displayed on the UI is still hard-coded and not taken from the model. We'll bind the property `greetingText` to our UI control in the next step.

> 📝
> You can set models on every control by calling `setModel()`. The model is then propagated to all aggregated child controls \(and their children, and so on …\). All child controls then have access to that model.

***

**Next:** [Step 3: Create Property Binding](../03/README.md)

**Previous:** [Step 1: No Data Binding](../01/README.md)

***

**Related Information**

[Models](https://sdk.openui5.org/topic/e1b625940c104b558e52f47afe5ddb4f.html "A model in the Model View Controller concept holds the data and provides methods to retrieve the data from the database and to set and update data.")

[JSON Model](https://sdk.openui5.org/topic/96804e3315ff440aa0a50fd290805116.html#loio96804e3315ff440aa0a50fd290805116 "The JSON model can be used to bind controls to JavaScript object data, which is usually serialized in the JSON format.")

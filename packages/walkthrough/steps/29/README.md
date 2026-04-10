## Step 29: Debugging Tools

Even though we have added a basic test coverage in the previous steps, it seems like we accidentally broke our app, because it does not display prices to our invoices anymore. We need to debug the issue and fix it before someone finds out.

Luckily, OpenUI5 provides a couple of debugging tools that we can use within the app to check the application logic and the developer tools of modern browsers are also quite good. We will now check for the root cause.

&nbsp;

***

### Preview
  

![](assets/loio930de31b311f43ffa9df9261ca760da0_LowRes.png "The diagnostics window")
  
<sup>*The diagnostics window*</sup>

*The code in this step remains unchanged, except for the addition and subsequent removal of a bug using troubleshooting tools. As a result, there is no live preview or download available for this step.*

***

### Coding

<details class="ts-only">

You can download the solution for this step here: [📥 Download step 29](https://ui5.github.io/tutorials/walkthrough/walkthrough-step-29.zip).

</details>

<details class="js-only">

You can download the solution for this step here: [📥 Download step 29](https://ui5.github.io/tutorials/walkthrough/walkthrough-step-29-js.zip).

</details>

***

### webapp/view/InvoiceList.view.xml

We introduced a typo in the binding of the number attribute to simulate a frequent error; instead of using `'invoice>ExtendedPrice'` we use <code>'invoice&gt;Ex<b>T</b>endedPrice'</code>. 

```xml
<mvc:View
   controllerName="ui5.walkthrough.controller.InvoiceList"
   xmlns="sap.m"
   xmlns:core="sap.ui.core"
   xmlns:mvc="sap.ui.core.mvc">
   <List
      id="invoiceList"
      class="sapUiResponsiveMargin"
      width="auto"
      items="{
         path : 'invoice>/Invoices',
         sorter : {
				path : 'ShipperName',
				group : true
			}
      }" >
      <headerToolbar>
         <Toolbar>
            <Title text="{i18n>invoiceListTitle}"/>
            <ToolbarSpacer/>
            <SearchField width="50%" search=".onFilterInvoices"/>
         </Toolbar>
      </headerToolbar>      
      <items>
         <ObjectListItem
            core:require="{
               Currency: 'sap/ui/model/type/Currency'
            }"
            title="{invoice>Quantity} x {invoice>ProductName}"
            number="{
                parts: [
                    'invoice>ExTendedPrice',
                    'view>/currency'
                ],
                type: 'Currency',
                formatOptions: {
                    showMeasure: false
                }
            }"
            numberUnit="{view>/currency}"
            numberState="{= ${invoice>ExtendedPrice} > 50 ? 'Error' : 'Success' }">
            <firstStatus>
                <ObjectStatus text="{
                    path: 'invoice>Status',
                    formatter: '.formatter.statusText'
                }"/>
            </firstStatus>
        </ObjectListItem>
      </items>
   </List>
</mvc:View>

```
&nbsp;
Now we call the app and notice that the price is actually missing. By entering the [shortcut](https://sdk.openui5.org/topic/154844c3ac2a4675a37aeb6259a5e034.html) [Ctrl\] + [Shift\] + [Alt\] /[Option\] + [S\]  we open the OpenUI5 support diagnostics tool and check the app.

> 📝 **Note:**
>
> If you use the Google Chrome browser, you can install the *UI5 Inspector* plugin. With this plugin, you can easily debug your OpenUI5- or OpenUI5-based apps. For more information, see [UI5 Inspector](https://sdk.openui5.org/topic/b24e72443eb34d0fb7bf6940f2d697eb.html).

Besides technical information about the app and a trace that is similar to the developer tools console of the browser, there is a really handy tool for checking such errors in this dialog. Open the tab *Control Tree* by clicking on the expand symbol on the right.

A hierarchical tree of OpenUI5 controls is shown on the left and the properties of the selected control are displayed on the right. If we now select the first `ObjectListItem` control of the tree and go to the *Binding Infos* tab on the right, we can actually see that the binding path of the number attribute is marked as invalid. We can now correct the error in the view and the price should appear in the list of invoices again.

Sometimes errors are not as easy to spot and you actually need to debug the JavaScript code with the tools of the browser.

> 📝 **Note:** <br>
> When debugging UI5 applications that use built resources, the OpenUI5 files are minified, which means that variable names are shortened and comments are removed.
> 
> This makes debugging harder, because the code is a lot less readable. You can load the debug sources by adding the URL parameter `sap-ui-debug=true` or by pressing [Ctrl\] + [Shift\] + [Alt\] /[Option\] + [P\]  and selecting *Use Debug Sources* in the dialog box that is displayed. After reloading the page, you can see in the *Network* tab of the browser’s developer tools that now a lot of files are loaded that have a `–dbg` suffix. These are the source code files that include comments and the uncompressed code of the app and the OpenUI5 artifacts.
  
  
![](assets/loio34c4b02c74eb4848b8b720d86042bfdc_LowRes.png "Technical information dialog ")

<sup>*Technical information dialog*</sup>

For a more detailed explanation of the OpenUI5 support tools, go through the [Troubleshooting Tutorial](https://sdk.openui5.org/topic/5661952e72df471b932eddc10350c081.html) tutorial.

If you're stuck and need help for some development task, you can also post a question in the OpenUI5-related forums, for example in the [SAP Community](https://www.sap.com/community/topic/ui5.html) or on [Stack Overflow](https://stackoverflow.com/search?q=openui5).

***

### Conventions

-   As per OpenUI5 convention uncompressed source files end with `*-dbg.js`

&nbsp;

***

**Next:** [Step 30: Routing and Navigation](../30/README.md "So far, we have put all app content on one single page. As we add more and more features, we want to split the content and put it on separate pages.")

**Previous:** [Step 28: Integration Test with OPA](../28/README.md "If we want to test interaction patterns or more visual features of our app, we can also write an integration test.")

***

**Related Information**  

[Debugging](https://sdk.openui5.org/topic/c9b0f8cca852443f9b8d3bf8ba5626ab.html#loioc9b0f8cca852443f9b8d3bf8ba5626ab "When developing apps, searching for bugs is an inevitable part of the process. To analyze an issue, you can use the developer tools of your browser and built-in OpenUI5 tools. In this section, we give an overview of the OpenUI5 tools you can use when debugging. To learn more about the developer tools of your browser, check the documentation of the browser.")

[Diagnostics](https://sdk.openui5.org/topic/6ec18e80b0ce47f290bc2645b0cc86e6.html#loio6ec18e80b0ce47f290bc2645b0cc86e6 "The Diagnostics window available in OpenUI5 is a support tool that runs within an existing OpenUI5 app.")

[Technical Information Dialog](https://sdk.openui5.org/topic/616a3ef07f554e20a3adf749c11f64e9.html#loio616a3ef07f554e20a3adf749c11f64e9 "The Technical Information dialog shows details of the OpenUI5 version currently being used in an app built with OpenUI5. You can use the Technical Information dialog to enable debug resources and open additional support tools to debug your app.")

[UI5 Inspector](https://sdk.openui5.org/topic/b24e72443eb34d0fb7bf6940f2d697eb.html)

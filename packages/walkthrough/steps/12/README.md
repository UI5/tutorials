## Step 12: Shell Control as Container

Now we use a shell control as container for our app and use it as our new root element. The shell takes care of visual adaptation of the application to the device’s screen size by introducing a so-called letterbox on desktop screens.

&nbsp;

***

### Preview
  
![](assets/loio0becf3ee81f5486a864e3b39ba036402_LowRes.png "The app is now run in a shall that limits the app width")

<sup>*The app is now run in a shell that limits the app width*</sup>

You can access the live preview by clicking on this link: [🔗 Live Preview of Step 12](https://ui5.github.io/tutorials/walkthrough/build/12/index-cdn.html).

***

### Coding

<details class="ts-only">

You can download the solution for this step here: [📥 Download step 12](https://ui5.github.io/tutorials/walkthrough/walkthrough-step-12.zip).

</details>

<details class="js-only">

You can download the solution for this step here: [📥 Download step 12](https://ui5.github.io/tutorials/walkthrough/walkthrough-step-12-js.zip).

</details>
***

### webapp/view/App.view.xml

In your App view, we put the `App` control inside a `sap/m/Shell` control.

```xml
<mvc:View
	controllerName="ui5.walkthrough.controller.App"
	xmlns="sap.m"
	xmlns:mvc="sap.ui.core.mvc"
	displayBlock="true">
	<Shell>
		<App>
			<pages>
				<Page title="{i18n>homePageTitle}">
					<content>
						<Panel
							headerText="{i18n>helloPanelTitle}">
							<content>
								<Button
									text="{i18n>showHelloButtonText}"
									press=".onShowHello"/>
								<Input
									value="{/recipient/name}"
									description="Hello {/recipient/name}"
									valueLiveUpdate="true"
									width="60%"/>
							</content>
						</Panel>
					</content>
				</Page>
			</pages>
		</App>
	</Shell>
</mvc:View>
```

The `Shell` control is now the outermost control of our app and automatically displays a so-called letterbox, if the screen size is larger than a certain width.

> :information_source: **Note:**
> We don't add the `Shell` control to the declarative UI definition in the XML view if apps run in an external shell, like the SAP Fiori launchpad that already has a shell around the component UI.
There are further options to customize the shell, like setting a custom background image or color and setting a custom logo. Check the related API reference for more details.

&nbsp;

***

**Next:** [Step 13: Margins and Paddings](../13/README.md "Our app content is still glued to the corners of the letterbox. To fine-tune our layout, we can add margins and paddings to the controls that we added in the previous step.")

**Previous:** [Step 11: Pages and Panels](../11/README.md "After all the work on the app structure it’s time to improve the look of our app. We will use two controls from the sap.m library to add a bit more &quot;bling&quot; to our UI. You will also learn about control aggregations in this step.")

***

**Related Information**  

[API Reference: `sap.m.Shell`](https://sdk.openui5.org/#/api/sap.m.Shell)

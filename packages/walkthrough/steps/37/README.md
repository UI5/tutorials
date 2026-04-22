## Step 37: Accessibility

In this step we're going to improve the accessibility of our app.

To achieve this, we will add ARIA attributes. ARIA attributes are used by screen readers to recognize the application structure and to interpret UI elements properly. That way, we can make our app more accessible for users who are limited in their use of computers, for example visually impaired persons. The main goal here is to make our app usable for as many people as we can.

One part of the ARIA attribute set are the so-called landmarks. You can compare landmarks to maps in that they help the user navigate through an app. For this step, we will use Google Chrome with a free [landmark navigation extension](https://chrome.google.com/webstore/detail/landmark-navigation-via-k/ddpokpbjopmeeiiolheejjpkonlkklgp) We will now add meaningful landmarks to our code.

> 💡 **Tip:** <br>
> ARIA is short for **Accessible Rich Internet Applications**. It is a set of attributes that enable us to make apps more accessible by assigning semantic characteristics to certain elements. For more information, see [Accessible Rich Internet Applications \(ARIA\) – Part 1: Introduction](https://blogs.sap.com/2015/06/01/accessible-rich-internet-applications-aria-part-1-introduction/).

&nbsp;

***

### Preview
  
![](assets/loiob35deda1ebe1433fbf0ff066f6e3fc4b_LowRes.png "Landmarks in our app")

<sup>*Landmarks in our app*</sup>

You can access the live preview by clicking on this link: [🔗 Live Preview of Step 37](https://ui5.github.io/tutorials/walkthrough/build/37/test/mockServer-cdn.html).

***

### Coding

<details class="ts-only" markdown="1">

You can download the solution for this step here: [📥 Download step 37](https://ui5.github.io/tutorials/walkthrough/walkthrough-step-37.zip).

</details>

<details class="js-only" markdown="1">

You can download the solution for this step here: [📥 Download step 37](https://ui5.github.io/tutorials/walkthrough/walkthrough-step-37-js.zip).

</details>
***

### webapp/i18n/i18n.properties

We add the labels we will need for the ARIA regions to the text bundle.

```ini
# Manifest
appTitle=Hello World
appDescription=A simple walkthrough app that explains the most important concepts of OpenUI5

#Overview Page
Overview_rootLabel=Overview Page
Overview_headerLabel=Header
Overview_contentLabel=Page Content

# Hello Panel
...
```

### webapp/view/Overview.view.xml

We add the `landmarkInfo` aggregation to the page and use `sap.m.PageAccessibleLandmarkInfo` to define ARIA roles and labels for the overview page areas. In the `PageAccessibilityLandmarkInfo` control we specify a role and a title for the root, the content, and the header of the page.

For more information, see the [API Reference: `sap.m.PageAccessibleLandmarkInfo`](https://sdk.openui5.org/api/sap.m.PageAccessibleLandmarkInfo). 

```xml
<mvc:View
	controllerName="ui5.walkthrough.controller.App"
	xmlns="sap.m"
	xmlns:mvc="sap.ui.core.mvc"
	displayBlock="true">
	<Page title="{i18n>homePageTitle}">
		<landmarkInfo>
			<PageAccessibleLandmarkInfo
				rootRole="Region"
				rootLabel="{i18n>Overview_rootLabel}"
				contentRole="Main"
				contentLabel="{i18n>Overview_contentLabel}"
				headerRole="Banner"
				headerLabel="{i18n>Overview_headerLabel}"/>
		</landmarkInfo>
		<content>
			<mvc:XMLView viewName="ui5.walkthrough.view.HelloPanel"/>
			<mvc:XMLView viewName="ui5.walkthrough.view.InvoiceList"/>
		</content>
	</Page>
</mvc:View>
```

### webapp/view/InvoiceList.view.xml

We add an `sap.m.Panel` around the invoice list and move the toolbar from the table into the panel, so that the region can take the title of the toolbar as its own. This has the effect that it will now be a region in our landmarks.

```xml
<mvc:View
	controllerName="ui5.walkthrough.controller.InvoiceList"
	xmlns="sap.m"
  xmlns:core="sap.ui.core"
	xmlns:mvc="sap.ui.core.mvc">
	<Panel accessibleRole="Region">
		<headerToolbar>
			<Toolbar>
				<Title text="{i18n>invoiceListTitle}"/>
				<ToolbarSpacer/>
				<SearchField
					width="50%"
					search=".onFilterInvoices"/>
			</Toolbar>
		</headerToolbar>
		<Table
			id="invoiceList"
			class="sapUiResponsiveMargin"
			width="auto"
			items="{
				path : 'invoice>/Invoices',
				sorter : {
						path : 'ShipperName',
						group : true
					}
				}">
				...
		</Table>
	</Panel>
</mvc:View>
```

### webapp/view/HelloPanel.view.xml

In the `HelloPanel` view, we already have a panel, so we just add the `accessibleRole` attribute.

```xml
<mvc:View
	controllerName="ui5.walkthrough.controller.HelloPanel"
	xmlns="sap.m"
	xmlns:mvc="sap.ui.core.mvc">
	<Panel
		headerText="{i18n>helloPanelTitle}"
		class="sapUiResponsiveMargin"
		width="auto"
		expandable="{device>/system/phone}"
		expanded="{= !${device>/system/phone} }"
		accessibleRole="Region">	
		…
	</Panel>
</mvc:View>
```

***

### Result

<table>
<tr>
<td valign="top">

<img src="assets/loio54e9bca5a5844c14b45b5405496166b1_HiRes.png">

</td>
<td valign="top">

<img src="assets/loiof38dee2624c2437d8977de70575b3eae_HiRes.png">

</td>
</tr>
<tr>
<td valign="top">

<strong>Landmarks on the overview page - before</strong>

</td>
<td valign="top">

<strong>Landmarks on the overview page - after</strong>

</td>
</tr>
</table>
&nbsp;
As you can see, we now have four landmarks on our page. The top three landmarks structure our page:

-   *Overview Page* marks the complete page.

-   *Header* marks the page title.

-   *Page Content* marks the content of our page. This landmark already has two children.

&nbsp;

***

**Next:** [Step 38: Build Your Application](../38/README.md "We now configure the visibility and properties of controls based on the device that we run the application on. By making use of the `sap.ui.Device` API and defining a device model we will make the app look great on many devices.")

**Previous:** [Step 36: Content Density](../36/README.md "In this step of our Walkthrough tutorial, we adjust the content density based on the user’s device. OpenUI5 contains different content densities allowing you to display larger controls for touch-enabled devices and a smaller, more compact design for devices that are operated by mouse. In our app, we will detect the device and adjust the density accordingly.")

***


**Related Information**  

[Accessibility](https://sdk.openui5.org/topic/03b914b46e624b138a6fb1b7cf2049ae.html "In this guide we cover the most important accessibility aspects for application development, based on OpenUI5.")

[Screen Reader Support for OpenUI5 Controls](https://sdk.openui5.org/topic/656e825c5f1548e6b1d0acb5586f2a2a.html "OpenUI5 offers screen reader support in order to aid people with visual impairments. The implementation is based on the ARIA and HTML standards.")

[API Reference: `sap.m.PageAccessibleLandmarkInfo`](https://sdk.openui5.org/api/sap.m.PageAccessibleLandmarkInfo)

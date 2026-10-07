---
title: OpenUI5 Tutorials
permalink: odatav4/index.html
---

# OData V4 Tutorial

In this tutorial, we explore the features of OData V4 in OpenUI5. We use an OData V4 service that simulates the entity set `People` of the TripPin sample service, intercept all requests with a mock server, and progressively build a list/detail application with creation, editing, deletion, filtering, sorting, batch groups, and OData operations.

OData is a standard protocol for creating and consuming data using simple HTTP and REST APIs for create, read, update, delete (CRUD) operations.

We start with an initial app that simply retrieves data from an OData V4 service and displays it as a plain list, and progressively grow it across 11 steps.

> 💡  
> You don't have to do all tutorial steps sequentially, you can also jump directly to any step you want. Just download the code from the previous step, and start there.
>
> You can view and download the files for all steps in the Demo Kit at [OData V4](https://sdk.openui5.org/#/entity/sap.ui.core.tutorial.odatav4).

***

## Preview

![Final OData V4 application with create / edit / delete capabilities](./steps/08/assets/Tutorial_OData_V4_Step_8_e518deb.png "Final OData V4 application")

***

### In this Tutorial

The tutorial consists of the following steps. To start, just open the first link — you'll be guided from there.

- **[Step 1: The Initial App](./steps/01/index.html)** — We start by setting up a simple app that loads data from an OData service and displays it in a table. We use a mock server to simulate requests to and responses from the service. ([🔗 Live Preview](https://ui5.github.io/tutorials/odatav4/build/01/index-cdn.html) \| <span class="ts-only">[📥 Download Solution](https://ui5.github.io/tutorials/odatav4/odatav4-step-01.zip)<span class="lang-suffix"> (TS)</span></span><span class="js-only">[📥 Download Solution](https://ui5.github.io/tutorials/odatav4/odatav4-step-01-js.zip)<span class="lang-suffix"> (JS)</span></span>)
- **[Step 2: Data Access and Client-Server Communication](./steps/02/index.html)** — In this step, we see how the Table that is bound to the People entity set initially requests its data, and how the data can be refreshed. ([🔗 Live Preview](https://ui5.github.io/tutorials/odatav4/build/02/index-cdn.html) \| <span class="ts-only">[📥 Download Solution](https://ui5.github.io/tutorials/odatav4/odatav4-step-02.zip)<span class="lang-suffix"> (TS)</span></span><span class="js-only">[📥 Download Solution](https://ui5.github.io/tutorials/odatav4/odatav4-step-02-js.zip)<span class="lang-suffix"> (JS)</span></span>)
- **[Step 3: Automatic Data Type Detection](./steps/03/index.html)** — In this step, we use the automatic data type detection of the OData V4 model to parse, validate, and format user entries. ([🔗 Live Preview](https://ui5.github.io/tutorials/odatav4/build/03/index-cdn.html) \| <span class="ts-only">[📥 Download Solution](https://ui5.github.io/tutorials/odatav4/odatav4-step-03.zip)<span class="lang-suffix"> (TS)</span></span><span class="js-only">[📥 Download Solution](https://ui5.github.io/tutorials/odatav4/odatav4-step-03-js.zip)<span class="lang-suffix"> (JS)</span></span>)
- **[Step 4: Filtering, Sorting, and Counting](./steps/04/index.html)** — In this step, we add features to filter, sort, and count the user data by using the OData V4 model API to apply OData system query options $filter, $orderby, and $count. ([🔗 Live Preview](https://ui5.github.io/tutorials/odatav4/build/04/index-cdn.html) \| <span class="ts-only">[📥 Download Solution](https://ui5.github.io/tutorials/odatav4/odatav4-step-04.zip)<span class="lang-suffix"> (TS)</span></span><span class="js-only">[📥 Download Solution](https://ui5.github.io/tutorials/odatav4/odatav4-step-04-js.zip)<span class="lang-suffix"> (JS)</span></span>)
- **[Step 5: Batch Groups](./steps/05/index.html)** — In this step, we have a closer look at batch groups. Batch groups are used to group multiple requests into one server request to improve the overall performance. ([🔗 Live Preview](https://ui5.github.io/tutorials/odatav4/build/05/index-cdn.html) \| <span class="ts-only">[📥 Download Solution](https://ui5.github.io/tutorials/odatav4/odatav4-step-05.zip)<span class="lang-suffix"> (TS)</span></span><span class="js-only">[📥 Download Solution](https://ui5.github.io/tutorials/odatav4/odatav4-step-05-js.zip)<span class="lang-suffix"> (JS)</span></span>)
- **[Step 6: Create and Edit](./steps/06/index.html)** — In this step, we will make it possible to create and edit (update) user data from the user interface and send the data to the back end. ([🔗 Live Preview](https://ui5.github.io/tutorials/odatav4/build/06/index-cdn.html) \| <span class="ts-only">[📥 Download Solution](https://ui5.github.io/tutorials/odatav4/odatav4-step-06.zip)<span class="lang-suffix"> (TS)</span></span><span class="js-only">[📥 Download Solution](https://ui5.github.io/tutorials/odatav4/odatav4-step-06-js.zip)<span class="lang-suffix"> (JS)</span></span>)
- **[Step 7: Delete](./steps/07/index.html)** — In this step, we make it possible to delete user data. ([🔗 Live Preview](https://ui5.github.io/tutorials/odatav4/build/07/index-cdn.html) \| <span class="ts-only">[📥 Download Solution](https://ui5.github.io/tutorials/odatav4/odatav4-step-07.zip)<span class="lang-suffix"> (TS)</span></span><span class="js-only">[📥 Download Solution](https://ui5.github.io/tutorials/odatav4/odatav4-step-07-js.zip)<span class="lang-suffix"> (JS)</span></span>)
- **[Step 8: OData Operations](./steps/08/index.html)** — Our OData service provides one OData operation: the ResetDataSource action. In this step, we add a button that resets all data changes we made during the tutorial to their original state using this action. ([🔗 Live Preview](https://ui5.github.io/tutorials/odatav4/build/08/index-cdn.html) \| <span class="ts-only">[📥 Download Solution](https://ui5.github.io/tutorials/odatav4/odatav4-step-08.zip)<span class="lang-suffix"> (TS)</span></span><span class="js-only">[📥 Download Solution](https://ui5.github.io/tutorials/odatav4/odatav4-step-08-js.zip)<span class="lang-suffix"> (JS)</span></span>)
- **[Step 9: List-Detail Scenario](./steps/09/index.html)** — In this step we add a detail area with additional information. ([🔗 Live Preview](https://ui5.github.io/tutorials/odatav4/build/09/index-cdn.html) \| <span class="ts-only">[📥 Download Solution](https://ui5.github.io/tutorials/odatav4/odatav4-step-09.zip)<span class="lang-suffix"> (TS)</span></span><span class="js-only">[📥 Download Solution](https://ui5.github.io/tutorials/odatav4/odatav4-step-09-js.zip)<span class="lang-suffix"> (JS)</span></span>)
- **[Step 10: Enable Data Reuse](./steps/10/index.html)** — In this step we avoid unnecessary back-end requests by preventing the destruction of data shown in the detail area when sorting or filtering the list. ([🔗 Live Preview](https://ui5.github.io/tutorials/odatav4/build/10/index-cdn.html) \| <span class="ts-only">[📥 Download Solution](https://ui5.github.io/tutorials/odatav4/odatav4-step-10.zip)<span class="lang-suffix"> (TS)</span></span><span class="js-only">[📥 Download Solution](https://ui5.github.io/tutorials/odatav4/odatav4-step-10-js.zip)<span class="lang-suffix"> (JS)</span></span>)
- **[Step 11: Add Table with :n Navigation to Detail Area](./steps/11/index.html)** — In this step we add a table with additional information to the detail area. ([🔗 Live Preview](https://ui5.github.io/tutorials/odatav4/build/11/index-cdn.html) \| <span class="ts-only">[📥 Download Solution](https://ui5.github.io/tutorials/odatav4/odatav4-step-11.zip)<span class="lang-suffix"> (TS)</span></span><span class="js-only">[📥 Download Solution](https://ui5.github.io/tutorials/odatav4/odatav4-step-11-js.zip)<span class="lang-suffix"> (JS)</span></span>)

***

## Related Information

- [OData Standard Protocol](http://www.odata.org/documentation/)
- [OData V4 Reference Services including TripPin](http://www.odata.org/odata-services/)
- [OData V4 Model](https://sdk.openui5.org/topic/5de13cf4111a4d2ca7d77ad08fc46de7) (in the OpenUI5 Developer Guide)
- [Basic Tutorial on the OData Home Page](http://www.odata.org/getting-started/basic-tutorial/)

***

## License

Copyright (c) 2026 SAP SE or an SAP affiliate company. All rights reserved. This project is licensed under the Apache Software License, version 2.0 except as noted otherwise in the [LICENSE](https://github.com/UI5/tutorials/blob/-/LICENSE) file.

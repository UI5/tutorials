---
title: OpenUI5 Tutorials
permalink: odatav4/build/01/README.html
---

<nav class="tutorial-breadcrumb"><a href="../../../index.html">UI5 Tutorials</a> <span class="tutorial-breadcrumb-sep">&rsaquo;</span> <a href="../../index.html">OData V4 Tutorial</a></nav>

## Step 1: The Initial App

We start by setting up a simple app that loads data from an OData service and displays it in a table. We use a mock server to simulate requests to and responses from the service.

The structure and data model created in this step will be used throughout this tutorial to illustrate the OData V4 features in OpenUI5.

### Preview

**Initial app with a simple table**

![Initial app with a simple table](assets/Tutorial_OData_V4_Step1_Preview_9d0182f.png "Initial app with a simple table")

***

### Setup

The initial code for this step ships with the repository at [packages/odatav4/steps/01/](./). Open it and run:

{% raw %}
```sh
npm install
npm start
```
{% endraw %}

This starts the local web server and opens a browser window hosting `index.html`.

If you prefer to work outside the monorepo, download the standalone bundle at <span class="ts-only">[OData V4 - Step 1](https://ui5.github.io/tutorials/odatav4/odatav4-step-01.zip)<span class="lang-suffix"> (TS)</span></span><span class="js-only">[OData V4 - Step 1](https://ui5.github.io/tutorials/odatav4/odatav4-step-01-js.zip)<span class="lang-suffix"> (JS)</span></span>, extract it, and run the same two commands from the extracted folder.

You should now have the following files:

**Folder structure with downloaded files**

{% raw %}
```text
webapp/
├── Component.ts/.js
├── controller/
│   └── App.controller.ts/.js
├── i18n/
│   └── i18n.properties
├── index-cdn.html
├── index.html
├── initMockServer.ts/.js
├── localService/
│   ├── metadata.xml
│   ├── mockdata/
│   │   └── people.json
│   └── mockserver.ts/.js
├── manifest.json
├── model/
│   └── models.ts/.js
└── view/
    └── App.view.xml
```
{% endraw %}

### The Initial App

The downloaded code includes an app that displays a table containing a table of users. For performance reasons, the table only loads 10 users at a time. More data can be retrieved by using the *More* button at the bottom of the page.

During the implementation of the app, we use local mock data so that we can concentrate on the application logic without dealing with back-end readiness or connectivity issues. We use the *TripPin* sample service as a "real" OData service.

The most important files are the following:

#### webapp/index.html

This file defines the home page of the app. It contains the bootstrap script and tells the runtime where to find our custom resources. It also initializes the mock server that intercepts all requests to the real *TripPin* service and sends back mock responses.

#### webapp/manifest.json

The `manifest.json` descriptor file contains the app configuration. In the `sap.app` section, the OData V4 service is configured as the default service:

{% raw %}
```json
"dataSources": {
  "default": {
    "uri": "https://services.odata.org/TripPinRESTierService/(S(id))/",
    "type": "OData",
    "settings": {
      "odataVersion": "4.0"
    }
  }
}

```
{% endraw %}

#### Mock server \(`webapp/localService/*`\)

> 📝
> The mock server included in this tutorial is only meant to support the features needed in this tutorial. Currently, there is no "general-purpose mock server" for application development available with OData V4 \(like there is for OData V2\).

The `mockserver.ts/.js` file contains the implementation of the mock server. It is quite simple since the mock server is only used to simulate certain types of requests to the *TripPin* service.

The `metadata.xml` file contains the service metadata that includes, for example, entity types and entity sets. Those define the possible requests as well as the structure of responses.

To be able to add data to the emulated OData responses, we have to store the entities for each entity type we use in a JSON file: The `people.json` file contains some data that is used for the mock service responses.

In this tutorial, we only use the entity type `Person` of the *TripPin* service. The entities of type `Person` are collected in the entity set `People`. Each `Person` has a key property `UserName` and the properties `Age`, `FirstName`, and `LastName`.

***

**Next:** [Step 2: Data Access and Client-Server Communication](../02/index.html)

***

**Related Information**

[*OData* Reference Services including *TripPin*](http://www.odata.org/odata-services/)

[Bootstrapping: Loading and Initializing](https://sdk.openui5.org/topic/a04b0d10fb494d1cb722b9e341b584ba.html "To use OpenUI5 features in your HTML page, you have to load and initialize the OpenUI5 library.")

[Descriptor for Applications, Components, and Libraries \(manifest.json\)](https://sdk.openui5.org/topic/be0cf40f61184b358b5faedaec98b2da.html "The descriptor for applications, components, and libraries (in short: app descriptor) is inspired by the WebApplication Manifest concept introduced by the W3C. The descriptor provides a central, machine-readable, and easy-to-access location for storing metadata associated with an application, an application component, or a library.")

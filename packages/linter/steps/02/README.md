# Step 2: Running UI5 Linter

## 2.1 Run the UI5 Linter

From inside the extracted app folder (where `package.json` lives), run:

```bash
ui5lint
```

## 2.2 What the UI5 Linter Finds

The UI5 linter should detect **53 problems** (41 errors, 12 warnings) spread across these categories:

### Deprecated APIs (`no-deprecated-api`)
- `jQuery.sap.declare()`: legacy module declaration
- `jQuery.sap.require()`: legacy module loading
- `jQuery.sap.log.info()`: deprecated logging API
- `jQuery.sap.getModulePath()`: deprecated path resolution
- `jQuery.sap.extend()`: deprecated object merging
- `jQuery.sap.formatMessage()`: deprecated string formatting
- `sap.ui.controller()`: legacy controller definition
- `sap.ui.getCore().byId()`: deprecated Core access
- `.control()`: deprecated jQuery extension for getting UI5 controls
- `tap` event: deprecated event name (use `press`)
- Bootstrap attributes with camelCase spelling (e.g., `resourceRoots` should be `resource-roots`)
- `synchronizationMode`: deprecated OData V4 model parameter
- `sap.ui5/resources/js`: deprecated manifest property

### Global Variables (`no-globals`)
- Direct access to the `sap.ui.demo.todo.*` namespace
- `jQuery` global used for DOM manipulation
- `sap.ui.core.BarColor` accessed without an import
- `sap.ui.model.Filter` and `sap.ui.model.FilterOperator` accessed without imports
- `sap.ui.model.json.JSONModel` accessed without an import

### Deprecated Libraries (`no-deprecated-library`)
- `sap.ui.commons` referenced in both `manifest.json` and `ui5.yaml`

### Deprecated Themes (`no-deprecated-theme`)
- `sap_goldreflection` used in multiple HTML files

### Manifest Issues (`no-outdated-manifest-version`)
- The manifest version is outdated

### Event Handler Issues (`no-ambiguous-event-handler`)
- `tap="onClearCompleted"` is missing the `.` prefix for local handlers

### Content Security Policy (`csp-unsafe-inline-script`)
- An inline `<script>` tag in `index.html`

### Test Configuration (`prefer-test-starter`)
- Legacy QUnit test setup across multiple test files

## 2.3 Getting More Detail

Run the UI5 linter with `--details` to get additional context for each finding:

```bash
ui5lint --details
```

```
webapp/controller/App.controller.js
   1:1  error Use of deprecated API 'jQuery.sap.declare'. Details: since 1.58. To avoid usage of global variables in general, please do not use the jQuery.sap namespace any longer. Most of the jQuery.sap functionalities are replaced by alternative modules which can be found in the API doc.  no-deprecated-api
   11:8  error Call to deprecated function 'controller' (sap.ui.controller). Details: As of version 1.56. use Controller.extend (https://ui5.sap.com/1.136/#/api/sap.ui.core.mvc.Controller%23methods/sap.ui.core.mvc.Controller.extend) to define the controller class and Controller.create (https://ui5.sap.com/1.136/#/api/sap.ui.core.mvc.Controller) to create controller instances. For further information, see sap.ui.core.mvc.Controller (https://ui5.sap.com/1.136/#/api/sap.ui.core.mvc.Controller).  no-deprecated-api
   16:19 error Access of global variable 'sap' (sap.ui.core.BarColor). Details: Do not use global variables to access UI5 modules or APIs. See Best Practices for Developers (https://ui5.sap.com/#/topic/28fcd55b04654977b63dacbee0552712)  no-globals
   ...
```

Many findings include links to the UI5 API documentation and best practices pages. They explain the issue and point you toward the modern replacement, so they are worth reading.

> 💡
> Check the total number of problems and get a feel for what categories exist. Try `--details` on a few findings that look interesting.

***

**Next:** [Step 3: Understanding UI5 Linter Rules](../03/README.md)

**Previous:** [Step 1: Introduction & Setup](../01/README.md)

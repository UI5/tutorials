# Step 5: Manual Fixes

## 5.1 Fix: Controller Module Pattern

The legacy controller uses `jQuery.sap.declare()` to name the module, a stack of `jQuery.sap.require()` calls to load dependencies, and `sap.ui.controller()` to define the class. The modern approach replaces all of that with a single `sap.ui.define()` call.

Open [`webapp/controller/App.controller.js`](../01/webapp/controller/App.controller.js) and apply the migration shown below.

**Before (Legacy):**
```javascript
jQuery.sap.declare("sap.ui.demo.todo.controller.App");

jQuery.sap.require("jquery.sap.global");
jQuery.sap.require("sap.ui.Device");
jQuery.sap.require("sap.ui.core.mvc.Controller");
jQuery.sap.require("sap.ui.model.Filter");
jQuery.sap.require("sap.ui.model.FilterOperator");
jQuery.sap.require("sap.ui.model.json.JSONModel");
jQuery.sap.require("sap.ui.core.BarColor");
jQuery.sap.require("sap.ui.demo.todo.util.Helper");
sap.ui.controller("sap.ui.demo.todo.controller.App", {
    // controller code
});
```

**After (Modern):**
```javascript
sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/ui/Device",
    "sap/ui/model/Filter",
    "sap/ui/model/FilterOperator",
    "sap/ui/model/json/JSONModel",
    "sap/ui/core/library",
    "sap/ui/demo/todo/util/Helper"
], (Controller, Device, Filter, FilterOperator, JSONModel, coreLibrary, Helper) => {
    "use strict";

    const { BarColor } = coreLibrary;
    return Controller.extend("sap.ui.demo.todo.controller.App", {

        onInit() {
            this.aSearchFilters = [];
            this.aTabFilters = [];
            this.BarColor = BarColor;

        // ... controller code ...
    });
}); // <-- Remember the additional closing parenthesis for sap.ui.define
```

**Key changes:**
1. **No `jQuery.sap.declare()`:** the module name moves into `Controller.extend()`
2. **No `jQuery.sap.require()`:** dependencies are declared in the `sap.ui.define()` array
3. **Module paths use slashes:** `sap/ui/core/mvc/Controller` instead of dots
4. **`sap.ui.controller()` replaced by `Controller.extend()`:** modern class definition
5. **Enums come from a library import:** `sap.ui.core.BarColor` becomes `coreLibrary.BarColor`
6. **No `jquery.sap.global`:** this pseudo-module is no longer needed

---

## 5.2 Fix: Global Variable Access and Deprecated APIs

The `onAfterRendering()` method has a few more issues that need to be fixed together.

Run `ui5lint` again to see what remains in `App.controller.js`, then apply the changes below.

**Before:**
```javascript
onAfterRendering() {
    const avatarDOM = jQuery("#container-todo---app--avatar-profile");
    const avatarCtr = avatarDOM.control(0);
    avatarCtr.setSrc(sap.ui.demo.todo.util.Helper.resolvePath('./img/logo_ui5.png'));
}
```

**Issues:**
1. `jQuery(...)` — global variable used for DOM selection
2. `.control(0)` — deprecated since 1.106, replaced by `Element.closestTo()`
3. `sap.ui.demo.todo.util.Helper` — global namespace access when the imported `Helper` is already available

**After:**
```javascript
onAfterRendering() {
    const oAvatar = this.byId("avatar-profile");
    oAvatar.setSrc(Helper.resolvePath('./img/logo_ui5.png'));
}
```

**Key changes:**
- **`this.byId()`** finds the control via the controller instead of jQuery DOM selection. It's cleaner and doesn't need the full generated ID.
- **`Helper`** is already in scope from the `sap.ui.define()` import, so use it directly.

Run `ui5lint` again to confirm all issues in `App.controller.js` are gone, then start the app and check that the avatar image still loads correctly.

---

## 5.3 Run Autofix Again

With the controller migrated, run autofix one more time:

```bash
ui5lint --fix
```

Remember the blocked fix from Step 4.3? Now that the controller uses `sap.ui.define()`, the linter can resolve it. The problem count drops significantly:

- **Before autofix:** 28 problems (22 errors, 6 warnings)
- **After autofix:** 13 problems (8 errors, 5 warnings)

Check what changed in the XML view:
```bash
git diff webapp/view/App.view.xml
```

The event handler now has the `.` prefix:
```diff
- press="onClearCompleted"
+ press=".onClearCompleted"
```

This is the core pattern for modernizing a legacy codebase: **manual fix, autofix, repeat** until the linter is clean.

---

<details>
<summary><strong>Click to reveal the complete migrated App.controller.js</strong></summary>

```javascript
sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/ui/Device",
    "sap/ui/model/Filter",
    "sap/ui/model/FilterOperator",
    "sap/ui/model/json/JSONModel",
    "sap/ui/core/library",
    "sap/ui/demo/todo/util/Helper",
    "sap/base/Log",
    "sap/base/strings/formatMessage",
    "sap/base/util/merge",
    "sap/ui/core/Element"
], (Controller, Device, Filter, FilterOperator, JSONModel, coreLibrary, Helper, Log, formatMessage, merge, Element) => {
    "use strict";

    const { BarColor } = coreLibrary;
    return Controller.extend("sap.ui.demo.todo.controller.App", {

        onInit() {
            this.aSearchFilters = [];
            this.aTabFilters = [];
            this.BarColor = BarColor;

            const sModulePath = sap.ui.require.toUrl("sap/ui/demo/todo");

            Log.info("Todo App controller initialized. " +
                "Module path: " + sModulePath);

            const oDefaults = { itemsRemovable: true };
            const oSettings = merge({}, oDefaults);

            this.getView().setModel(new JSONModel(oSettings), "view");
        },

        onAfterRendering() {
            const oAvatar = this.byId("avatar-profile");
            oAvatar.setSrc(Helper.resolvePath('./img/logo_ui5.png'));
        },

        getModel() {
            return this.getView().getModel();
        },

        addTodo() {
            const oModel = this.getModel();
            const aTodos = this.getTodos().map((oTodo) => Object.assign({}, oTodo));

            aTodos.push({
                title: oModel.getProperty("/newTodo"),
                completed: false
            });

            oModel.setProperty("/todos", aTodos);
            oModel.setProperty("/newTodo", "");
        },

        onClearCompleted() {
            const aTodos = this.getTodos().map((oTodo) => Object.assign({}, oTodo));
            this.removeCompletedTodos(aTodos);
            this.getModel().setProperty("/todos", aTodos);
        },

        removeCompletedTodos(aTodos) {
            let i = aTodos.length;
            while (i--) {
                const oTodo = aTodos[i];
                if (oTodo.completed) {
                    aTodos.splice(i, 1);
                }
            }
        },

        getTodos() {
            const oModel = this.getModel();
            return oModel && oModel.getProperty("/todos") || [];
        },

        onUpdateItemsLeftCount() {
            const iItemsLeft = this.getTodos().filter((oTodo) => oTodo.completed !== true).length;
            this.getModel().setProperty("/itemsLeftCount", iItemsLeft);
        },

        onSearch(oEvent) {
            const oModel = this.getModel();

            this.aSearchFilters = [];

            this.sSearchQuery = oEvent.getSource().getValue();
            if (this.sSearchQuery && this.sSearchQuery.length > 0) {
                oModel.setProperty("/itemsRemovable", false);
                const filter = new Filter("title", FilterOperator.Contains, this.sSearchQuery);
                this.aSearchFilters.push(filter);
            } else {
                oModel.setProperty("/itemsRemovable", true);
            }

            this._applyListFilters();
        },

        onFilter(oEvent) {
            this.aTabFilters = [];

            this.sFilterKey = oEvent.getParameter("item").getKey();

            switch (this.sFilterKey) {
                case "active":
                    this.aTabFilters.push(new Filter("completed", FilterOperator.EQ, false));
                    break;
                case "completed":
                    this.aTabFilters.push(new Filter("completed", FilterOperator.EQ, true));
                    break;
                case "all":
                default:
            }

            this._applyListFilters();
        },

        _applyListFilters() {
            const oList = Element.getElementById("container-todo---app--todoList");
            const oBinding = oList.getBinding("items");

            oBinding.filter(this.aSearchFilters.concat(this.aTabFilters), "todos");

            const sI18nKey = this.getI18NKey(this.sFilterKey, this.sSearchQuery);

            this.byId("filterToolbar").setVisible(!!sI18nKey);
            if (sI18nKey) {
                this.byId("filterLabel").bindProperty("text", {
                    path: sI18nKey,
                    model: "i18n",
                    formatter: (textWithPlaceholder) => {
                        return formatMessage(textWithPlaceholder, [this.sSearchQuery]);
                    }
                });
            }
        },

        getI18NKey(sFilterKey, sSearchQuery) {
            if (!sFilterKey || sFilterKey === "all") {
                return sSearchQuery ? "ITEMS_CONTAINING" : undefined;
            } else if (sFilterKey === "active") {
                return "ACTIVE_ITEMS" + (sSearchQuery ? "_CONTAINING" : "");
            } else {
                return "COMPLETED_ITEMS" + (sSearchQuery ? "_CONTAINING" : "");
            }
        }
    });
});
```
</details>

## 5.4 Fix: Deprecated Theme

Themes like `sap_goldreflection`, `sap_bluecrystal`, and `sap_hcb` are deprecated and will be removed in future UI5 versions. Switch to one of the current `sap_horizon` variants:

- `sap_horizon` — the default since UI5 1.102
- `sap_horizon_dark` — dark mode variant
- `sap_horizon_hcb` / `sap_horizon_hcw` — high contrast variants for accessibility

Update [`webapp/index.html`](../01/webapp/index.html):

```diff
- data-sap-ui-theme="sap_goldreflection"
+ data-sap-ui-theme="sap_horizon"
```

---

## 5.5 Fix: Deprecated Library

`sap.ui.commons` was the original UI5 control library. It has been deprecated since UI5 1.38 (2016) in favor of `sap.m`. Deprecated libraries no longer receive bug fixes, lack modern accessibility features, and will be removed from future UI5 versions.

Remove it from both places it appears.

**[`webapp/manifest.json`](../01/webapp/manifest.json):**
```json
"sap.ui.commons": {}
```

**[`ui5.yaml`](../01/ui5.yaml):**
```yaml
- name: sap.ui.commons
```

---

## 5.6 Fix: Manifest Version

Bumping the manifest version to `2.0.0` enables modern features, but it also removes some deprecated properties that are no longer allowed.

**Step 1: Update the version**
```json
"_version": "2.0.0"
```

After saving, run the linter scoped to just the manifest:

```bash
ui5lint webapp/manifest.json
```

> 💡
> You can pass individual files or directories to `ui5lint` to focus on a specific area of the codebase.

You'll see a new error:

```
Property '/sap.ui5/rootView/async' has been removed in Manifest Version 2
and must no longer be provided.
```

**Step 2: Remove `rootView/async`**

In Manifest Version 2, async root view loading is the default, so the `async` property is redundant and no longer accepted.

**Before:**
```json
"rootView": {
    "viewName": "sap.ui.demo.todo.view.App",
    "type": "XML",
    "id": "app",
    "async": true
}
```

**After:**
```json
"rootView": {
    "viewName": "sap.ui.demo.todo.view.App",
    "type": "XML",
    "id": "app"
}
```

This is a good illustration of why you should re-run the linter after every change. Bumping the version introduced a new finding that wasn't there before.

Run the scoped check one more time to confirm the manifest is clean:

```bash
ui5lint webapp/manifest.json
```

---

<details>
<summary><strong>Click to reveal the complete migrated manifest.json</strong></summary>

```json
{
    "_version": "2.0.0",
    "sap.app": {
        "id": "sap.ui.demo.todo",
        "type": "application",
        "dataSources": {
            "businessData": {
                "uri": "/api/odata-4/",
                "type": "OData",
                "settings": {
                    "odataVersion": "4.0"
                }
            }
        }
    },
    "sap.ui5": {
        "dependencies": {
            "minUI5Version": "1.136.0",
            "libs": {
                "sap.ui.core": {},
                "sap.m": {},
                "sap.f": {}
            }
        },
        "contentDensities": {
            "compact": true,
            "cozy": true
        },
        "rootView": {
            "viewName": "sap.ui.demo.todo.view.App",
            "type": "XML",
            "id": "app"
        },
        "models": {
            "i18n": {
                "type": "sap.ui.model.resource.ResourceModel",
                "settings": {
                    "bundleName": "sap.ui.demo.todo.i18n.i18n",
                    "async": true
                }
            },
            "": {
                "type": "sap.ui.model.json.JSONModel",
                "uri": "model/todoitems.json"
            },
            "businessData": {
                "dataSource": "businessData"
            }
        },
        "resources": {
            "css": [
                {
                    "uri": "css/styles.css"
                }
            ]
        }
    }
}
```

</details>

---

## 5.7 Fix: Unsafe Inline Script (CSP Compliance)

The linter flags the inline script in `index.html`:

```
8:2 warning Use of unsafe inline script
```

**Before ([`webapp/index.html`](../01/webapp/index.html)):**
```html
<script>
    // Inline script to demonstrate CSP violation detection
    window.todoAppConfig = {
        debug: true
    };
</script>
```

Inline scripts are a security risk. A strict Content Security Policy blocks them entirely. They bypass the allowed-sources check and are a common XSS attack vector.

**Solution 1: Just delete it**

In most cases, inline configuration scripts aren't actually needed. Before reaching for a workaround, ask whether the script is doing something that could live in `manifest.json`, be passed as a URL parameter, or be removed entirely. In this demo app, the inline script has no real effect and can be deleted.

**Solution 2: Move it to an external file**

If the inline script is genuinely needed, move its contents to a separate file loaded via `<script src="...">`. This keeps the code but satisfies CSP.

Create `webapp/config.js`:
```javascript
window.todoAppConfig = {
    debug: true
};
```

Then reference it in [`webapp/index.html`](../01/webapp/index.html):
```html
<script src="config.js"></script>
```

---

## 5.8 Fix: Migrate to Test Starter

The linter flags the legacy QUnit setup:

```
8:2 warning To save boilerplate code and ensure compliance with UI5 2.x
best practices, please migrate to the Test Starter concept.
```

The Test Starter concept replaces the old QUnit bootstrap boilerplate with a minimal, standardized setup that is fully CSP compliant. Read more in the [Test Starter documentation](https://ui5.sap.com/#/topic/032be2cb2e1d4115af20862673bedcdb) or the [introduction blog post](https://community.sap.com/t5/technology-blog-posts-by-sap/simplify-your-test-setup-introducing-the-test-starter-concept-for-your-ui5/ba-p/14303076).

**Before ([`webapp/test/unit/legacyTests.qunit.js`](../01/webapp/test/unit/legacyTests.qunit.js)):**
```javascript
QUnit.config.autostart = false;

sap.ui.require([
    "sap/ui/demo/todo/test/unit/controller/App.controller"
], function() {
    "use strict";
    QUnit.start();
});
```

**After: Test Starter setup**

1. Create `webapp/test/Test.qunit.html`:
```html
<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <script
        src="../resources/sap/ui/test/starter/runTest.js"
        data-sap-ui-resource-roots='{
            "test-resources.sap.ui.demo.todo": "./"
        }'
    ></script>
</head>
<body class="sapUiBody">
    <div id="qunit"></div>
    <div id="qunit-fixture"></div>
</body>
</html>
```

2. Replace [`webapp/test/testsuite.qunit.html`](../01/webapp/test/testsuite.qunit.html):
```html
<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <script
        src="../resources/sap/ui/test/starter/createSuite.js"
        data-sap-ui-testsuite="test-resources/sap/ui/demo/todo/testsuite.qunit"
        data-sap-ui-resource-roots='{"test-resources.sap.ui.demo.todo": "./"}'
    ></script>
</head>
<body>
</body>
</html>
```

3. Replace [`webapp/test/testsuite.qunit.js`](../01/webapp/test/testsuite.qunit.js):
```javascript
sap.ui.define(() => {
    "use strict";
    return {
        name: "QUnit test suite for Todo App",
        defaults: {
            page: "ui5://test-resources/sap/ui/demo/todo/Test.qunit.html?testsuite={suite}&test={name}",
            qunit: {
                version: 2
            },
            sinon: {
                version: 4
            },
            ui5: {
                theme: "sap_horizon"
            },
            loader: {
                paths: {
                    "sap/ui/demo/todo": "../"
                }
            }
        },
        tests: {
            "unit/unitTests": {
                title: "Unit tests for Todo App"
            },
        }
    };
});
```

4. Delete `legacyTests.qunit.html` and `legacyTests.qunit.js`. They are no longer needed.

5. Start the server and open [`http://localhost:8080/test/testsuite.qunit.html`](http://localhost:8080/test/testsuite.qunit.html), press **Run All**, and confirm all 10 tests pass.

---

## 5.9 Fix Helper Module (Try It Yourself!)

One finding remains, in [`webapp/util/Helper.js`](../01/webapp/util/Helper.js):

```
1:1 error Call to deprecated function 'declare' (jQuery.sap.declare)
```

**Current code:**
```javascript
jQuery.sap.declare("sap.ui.demo.todo.util.Helper");

sap.ui.demo.todo.util.Helper = {
    resolvePath(sPath) {
        // Relative to application root
        return sap.ui.require.toUrl("sap/ui/demo/todo/" + sPath);
    }
};
```

Apply what you learned in Section 5.1 to modernize this module.

**Hints:**
- Replace `jQuery.sap.declare()` with `sap.ui.define()`
- Return the Helper object from the factory function
- The module has no dependencies, so the dependency array can be empty

<details>
<summary><strong>Click to reveal solution</strong></summary>

```javascript
sap.ui.define([], () => {
    "use strict";

    return {
        resolvePath(sPath) {
            // Relative to application root
            return sap.ui.require.toUrl("sap/ui/demo/todo/" + sPath);
        }
    };
});
```

</details>

### Suppressing Findings with Directives

Sometimes you can't fix a finding right away, for example in third-party code you don't own or when a migration needs more planning. UI5 linter supports **directives** to suppress specific findings temporarily.

To suppress the `no-deprecated-api` finding in `Helper.js`:

```javascript
/* ui5lint-disable no-deprecated-api, no-globals */
jQuery.sap.declare("sap.ui.demo.todo.util.Helper");
...
```

You can also target a single line:

```javascript
/* ui5lint-disable-next-line no-deprecated-api */    // suppress the next line only
/* ui5lint-disable-line no-deprecated-api */         // suppress the current line
```

> 📝
> Treat directives as a short-term workaround, not a long-term fix. They make it easy to lose track of real issues, so keep them to a minimum and add a comment explaining why the suppression is needed.

For more details, see the [UI5 linter documentation](https://github.com/UI5/linter?tab=readme-ov-file#directives).

---

## 5.10 Verify Everything Is Clean

Run the linter one final time:

```bash
ui5lint
```

You should see:

```
Success! No findings detected.
```

The app is fully modernized. Every deprecated pattern is gone, the code is CSP-compliant, and the test setup follows current best practices.

***

**Next:** [Step 6: Best Practices](../06/README.md)

**Previous:** [Step 4: Auto-fixing Issues](../04/README.md)

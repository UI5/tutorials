# Step 4: Auto-fixing Issues

## 4.1 Run Autofix

Run UI5 linter with the `--fix` flag to automatically apply fixes:

```bash
ui5lint --fix
```

You'll still see **43 problems** after this. Not everything can be fixed automatically. Let's look at what changed first.

## 4.2 What Changed

Check the diff to see what autofix rewrote:

```bash
git diff
```

### 1. Deprecated API Replacements

**`jQuery.sap.getModulePath()` replaced with `sap.ui.require.toUrl()`** ([`webapp/controller/App.controller.js`](../../assets/linter-app/webapp/controller/App.controller.js))

```diff
- const sModulePath = jQuery.sap.getModulePath("sap/ui/demo/todo");
+ const sModulePath = sap.ui.require.toUrl("sap/ui/demo/todo");
```

`jQuery.sap.getModulePath()` was deprecated in UI5 1.58. `sap.ui.require.toUrl()` is the modern replacement and works the same way.

### 2. Bootstrap Attribute Naming ([`webapp/index.html`](../../assets/linter-app/webapp/index.html))

CamelCase bootstrap attributes are deprecated. The UI5 linter rewrites them to kebab-case:

```diff
- data-sap-ui-bindingSyntax="complex"
```
```diff
- data-sap-ui-resourceRoots='{...}'
+ data-sap-ui-resource-roots='{...}'
```
```diff
- data-sap-ui-onInit="module:sap/ui/core/ComponentSupport"
+ data-sap-ui-on-init="module:sap/ui/core/ComponentSupport"
```
```diff
- data-sap-ui-compatVersion="edge"
+ data-sap-ui-compat-version="edge"
```

The `bindingSyntax` attribute disappears entirely. When `compat-version="edge"` is set, complex binding syntax is already the default, so the attribute was redundant.

### 3. Deprecated Manifest Properties ([`webapp/manifest.json`](../../assets/linter-app/webapp/manifest.json))

**`synchronizationMode` removed:**
```diff
  "businessData": {
      "dataSource": "businessData",
-     "settings": {
-         "synchronizationMode": "None"
-     }
  }
```

**`sap.ui5/resources/js` removed:**
```diff
  "resources": {
      "css": [...]
-     "js": []
  }
```

The `js` section under `sap.ui5/resources` is deprecated. Use regular dependencies in `Component.js` instead.

### 4. Deprecated Event Names ([`webapp/view/App.view.xml`](../../assets/linter-app/webapp/view/App.view.xml))

```diff
- <Button ... tap="onClearCompleted"/>
+ <Button ... press="onClearCompleted"/>
```

The `tap` event was deprecated in favor of `press` for better cross-device compatibility.

## 4.3 What Autofix Cannot Fix

Some issues are out of scope for autofix:

- Code outside `sap.ui.define` / `sap.ui.require` blocks
- Synchronous-to-asynchronous flow changes
- Complex multi-step API migrations
- Structural changes to `manifest.json`

### Blocked Autofixes

Some fixes are **blocked by other issues** that need to be resolved manually first. A good example is the event handler in this app:

The `tap="onClearCompleted"` attribute should become `press=".onClearCompleted"` (note the `.` prefix). Autofix changed `tap` to `press` (a separate `no-deprecated-api` finding), but it did **not** add the `.` prefix:

```diff
- tap="onClearCompleted"
+ press="onClearCompleted"   ← Still missing the "." prefix!
```

The `.` prefix tells UI5 that the handler is a method on the controller. The UI5 linter can only safely add it when the controller uses the modern `sap.ui.define()` pattern. Since `App.controller.js` still uses `sap.ui.controller()` (line 11), the UI5 linter skips this part.

Once you migrate the controller to `sap.ui.define()` in Step 5.1 and run autofix again, the `.` prefix will be added automatically. **Order matters.**

***

**Next:** [Step 5: Manual Fixes](../05/README.md)

**Previous:** [Step 3: Understanding UI5 Linter Rules](../03/README.md)

# Step 7: Appendix

This is a reference table of all 53 legacy findings in the demo app, organized by file. Useful if you want to understand the full picture before diving into the fixes.

## Controller Issues ([`webapp/controller/App.controller.js`](../01/webapp/controller/App.controller.js)) — 30 findings

| Line | Legacy Pattern | Rule |
|------|----------------|------|
| 1 | `jQuery.sap.declare()` | no-deprecated-api |
| 3-10 | `jQuery.sap.require()` (8 occurrences) | no-deprecated-api |
| 11 | `sap.ui.controller()` instead of `Controller.extend()` | no-deprecated-api, no-globals |
| 16 | Direct access to `sap.ui.core.BarColor` | no-globals |
| 19 | `jQuery.sap.getModulePath()` | no-deprecated-api |
| 22 | `jQuery.sap.log.info()` | no-deprecated-api |
| 27 | `jQuery.sap.extend()` | no-deprecated-api |
| 27 | `sap.ui.Device.browser.mobile` global access | no-globals |
| 29 | `new sap.ui.model.json.JSONModel()` global access | no-globals |
| 33 | `jQuery()` for DOM selection | no-globals |
| 34 | `avatarDOM.control()` | no-deprecated-api |
| 35 | `sap.ui.demo.todo.util.Helper` global access | no-globals |
| 119 | `sap.ui.model.Filter` global access | no-globals |
| 119 | `sap.ui.model.FilterOperator.Contains` global access | no-globals |
| 137, 140 | `sap.ui.model.Filter` global access (2×) | no-globals |
| 137, 140 | `sap.ui.model.FilterOperator.EQ` global access (2×) | no-globals |
| 151 | `sap.ui.getCore()` global access | no-globals |
| 151 | `sap.ui.getCore()` deprecated API | no-deprecated-api |
| 151 | `Core.byId()` deprecated API | no-deprecated-api |
| 165 | `jQuery.sap.formatMessage()` | no-deprecated-api |

## Utility Issues ([`webapp/util/Helper.js`](../01/webapp/util/Helper.js)) — 2 findings

| Line | Legacy Pattern | Rule |
|------|----------------|------|
| 1 | `jQuery.sap.declare()` | no-deprecated-api |
| 3 | Global namespace assignment | no-globals |

## HTML Bootstrap Issues ([`webapp/index.html`](../01/webapp/index.html)) — 7 findings

| Line | Legacy Pattern | Rule |
|------|----------------|------|
| 8 | Inline `<script>` tag | csp-unsafe-inline-script |
| 18 | `data-sap-ui-bindingSyntax` (outdated spelling) | no-deprecated-api |
| 18 | Redundant `bindingSyntax` parameter | no-deprecated-api |
| 19 | `sap_goldreflection` deprecated theme | no-deprecated-theme |
| 20 | `data-sap-ui-resourceRoots` (outdated spelling) | no-deprecated-api |
| 23 | `data-sap-ui-onInit` (outdated spelling) | no-deprecated-api |
| 24 | `data-sap-ui-compatVersion` (outdated spelling) | no-deprecated-api |

## Manifest Issues ([`webapp/manifest.json`](../01/webapp/manifest.json)) — 4 findings

| Line | Legacy Pattern | Rule |
|------|----------------|------|
| 2 | `_version: "1.76.0"` (needs v2 migration) | no-outdated-manifest-version |
| 23 | `sap.ui.commons` deprecated library | no-deprecated-library |
| 51 | `synchronizationMode` deprecated parameter | no-deprecated-api |
| 61 | `sap.ui5/resources/js` deprecated property | no-deprecated-api |

## XML View Issues ([`webapp/view/App.view.xml`](../01/webapp/view/App.view.xml)) — 2 findings

| Line | Legacy Pattern | Rule |
|------|----------------|------|
| 38 | `tap="onClearCompleted"` (missing `.` prefix) | no-ambiguous-event-handler |
| 38 | `tap` event deprecated (use `press`) | no-deprecated-api |

## Test Issues — 7 findings

| File | Line | Legacy Pattern | Rule |
|------|------|----------------|------|
| [`webapp/test/testsuite.qunit.html`](../01/webapp/test/testsuite.qunit.html) | 5 | Legacy test setup | prefer-test-starter |
| [`webapp/test/testsuite.qunit.js`](../01/webapp/test/testsuite.qunit.js) | 5 | Legacy test setup | prefer-test-starter |
| [`webapp/test/unit/legacyTests.qunit.html`](../01/webapp/test/unit/legacyTests.qunit.html) | 7 | Missing `data-sap-ui-compat-version` | no-deprecated-api |
| [`webapp/test/unit/legacyTests.qunit.html`](../01/webapp/test/unit/legacyTests.qunit.html) | 7 | Legacy test setup | prefer-test-starter |
| [`webapp/test/unit/legacyTests.qunit.html`](../01/webapp/test/unit/legacyTests.qunit.html) | 9 | `sap_goldreflection` deprecated theme | no-deprecated-theme |
| [`webapp/test/unit/legacyTests.qunit.html`](../01/webapp/test/unit/legacyTests.qunit.html) | 10 | `data-sap-ui-resourceroots` (outdated spelling) | no-deprecated-api |
| [`webapp/test/unit/legacyTests.qunit.js`](../01/webapp/test/unit/legacyTests.qunit.js) | 8 | Legacy QUnit setup | prefer-test-starter |

## Configuration Issues ([`ui5.yaml`](../01/ui5.yaml)) — 1 finding

| Line | Legacy Pattern | Rule |
|------|----------------|------|
| 12 | `sap.ui.commons` deprecated library | no-deprecated-library |

***

**Previous:** [Step 6: Best Practices](../06/README.md)

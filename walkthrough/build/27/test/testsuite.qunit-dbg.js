sap.ui.define([], function () {
  "use strict";

  var __exports = {
    name: "QUnit test suite for UI5 TypeScript Walkthrough",
    defaults: {
      page: "ui5://test-resources/ui5/walkthrough/Test.qunit.html?testsuite={suite}&test={name}",
      qunit: {
        version: 2
      },
      ui5: {
        theme: "sap_horizon"
      },
      loader: {
        paths: {
          "ui5/walkthrough": "../"
        }
      }
    },
    tests: {
      "unit/unitTests": {
        title: "UI5 TypeScript Walkthrough - Unit Tests"
      }
    }
  };
  return __exports;
});
//# sourceMappingURL=testsuite.qunit-dbg.js.map

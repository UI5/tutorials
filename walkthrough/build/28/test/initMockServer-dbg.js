sap.ui.define(["../localService/mockserver"], function (__mockserver) {
  "use strict";

  function _interopRequireDefault(obj) {
    return obj && obj.__esModule && typeof obj.default !== "undefined" ? obj.default : obj;
  }
  function __ui5_require_async(path) {
    return new Promise(function (resolve, reject) {
      sap.ui.require([path], function (module) {
        if (!(module && module.__esModule)) {
          module = module === null || !(typeof module === "object" && path.endsWith("/library")) ? {
            default: module
          } : module;
          Object.defineProperty(module, "__esModule", {
            value: true
          });
        }
        resolve(module);
      }, function (err) {
        reject(err);
      });
    });
  }
  const mockserver = _interopRequireDefault(__mockserver); // initialize the mock server
  mockserver.init();

  // initialize the embedded component on the HTML page
  __ui5_require_async("sap/ui/core/ComponentSupport");
});
//# sourceMappingURL=initMockServer-dbg.js.map

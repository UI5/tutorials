sap.ui.define(["sap/ui/core/mvc/Controller"], function (Controller) {
  "use strict";

  /**
   * @name ui5.walkthrough.controller.App
   */
  const AppController = Controller.extend("ui5.walkthrough.controller.App", {
    onShowHello: function _onShowHello() {
      // show a native JavaScript alert
      alert("Hello World");
    }
  });
  ;
  return AppController;
});
//# sourceMappingURL=App-dbg.controller.js.map

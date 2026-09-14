sap.ui.define(["ui5/tutorial/navigation/controller/BaseController", "sap/base/Log"], function (BaseController, Log) {
  "use strict";

  const App = BaseController.extend("ui5.tutorial.navigation.controller.App", {
    onInit() {
      // This is ONLY for being used within the tutorial.
      // The default log level of the current running environment may be higher than INFO,
      // in order to see the debug info in the console, the log level needs to be explicitly
      // set to INFO here.
      // But for application development, the log level doesn't need to be set again in the code.
      Log.setLevel(Log.Level.INFO);
      const router = this.getRouter();
      router.attachBypassed(event => {
        const hash = event.getParameter("hash");
        // do something here, i.e. send logging data to the backend for analysis
        // telling what resource the user tried to access...
        Log.info(`Sorry, but the hash '${hash}' is invalid.`, "The resource was not found.");
      });
      router.attachRouteMatched(event => {
        const routeName = event.getParameter("name");
        // do something, i.e. send usage statistics to backend
        // in order to improve our app and the user experience (Build-Measure-Learn cycle)
        Log.info(`User accessed route ${routeName}, timestamp = ${Date.now()}`);
      });
    }
  });
  return App;
});

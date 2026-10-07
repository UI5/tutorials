sap.ui.define(["sap/ui/core/util/MockServer", "sap/ui/model/json/JSONModel", "sap/base/Log"], function (MockServer, JSONModel, Log) {
  "use strict";

  const appNamespace = "ui5/tutorial/navigation/";
  const pathToJsonFiles = appNamespace + "localService/mockdata";
  return {
    init() {
      return new Promise((resolve, reject) => {
        const manifestUrl = sap.ui.require.toUrl(appNamespace + "manifest.json");
        const manifestModel = new JSONModel(manifestUrl);
        manifestModel.attachRequestCompleted(() => {
          const jsonFilesUrl = sap.ui.require.toUrl(pathToJsonFiles);
          const dataSource = manifestModel.getProperty("/sap.app/dataSources/employeeRemote");
          const metadataUrl = sap.ui.require.toUrl(appNamespace + dataSource.settings.localUri);

          // create
          const server = new MockServer({
            rootUri: dataSource.uri
          });

          // configure
          MockServer.config({
            autoRespond: true,
            autoRespondAfter: 500
          });

          // simulate
          server.simulate(metadataUrl, {
            sMockdataBaseUrl: jsonFilesUrl
          });

          // start
          server.start();
          Log.info("Running the app with mock data");
          resolve();
        });
        manifestModel.attachRequestFailed(() => {
          const errorMessage = "Failed to load application manifest";
          Log.error(errorMessage);
          reject(new Error(errorMessage));
        });
      });
    }
  };
});

import mockserver from "ui5/tutorial/navigation/localService/mockserver";
import MessageBox from "sap/m/MessageBox";

mockserver.init().catch((error: Error) => {
  MessageBox.error(error.message);
}).finally(() => {
  // initialize the embedded component on the HTML page
  import("sap/ui/core/ComponentSupport");
});

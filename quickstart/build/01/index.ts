import Button from "sap/m/Button";
import MessageToast from "sap/m/MessageToast";

new Button({
	text: "Ready...",
	press() {
		MessageToast.show("Hello World!");
	}
}).placeAt("content");

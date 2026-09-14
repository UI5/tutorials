import ComponentContainer from "sap/ui/core/ComponentContainer";

new ComponentContainer({
	id: "container",
	name: "ui5.tutorial.walkthrough",
	settings: {
		id: "walkthrough"
	},
	autoPrefixId: true,
	async: true
}).placeAt("content");

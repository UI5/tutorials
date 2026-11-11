import ComponentContainer from "sap/ui/core/ComponentContainer";

new ComponentContainer({
	name: "ui5.tutorial.walkthrough",
	settings : {
		id : "walkthroughts"
	},
	async: true
}).placeAt("content");

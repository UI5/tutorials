//@ui5-bundle ui5/tutorial/databinding/Component-preload.js
sap.ui.predefine("ui5/tutorial/databinding/Component", ["sap/ui/core/UIComponent"],function(n){"use strict";const t=n.extend("ui5.tutorial.databinding.Component",{metadata:{interfaces:["sap.ui.core.IAsyncContentCreation"],manifest:"json"}});return t});
sap.ui.require.preload({
	"ui5/tutorial/databinding/manifest.json":'{"_version":"2.8.0","sap.app":{"id":"ui5.tutorial.databinding","type":"application","applicationVersion":{"version":"1.0.0"},"title":"Data Binding Tutorial","description":"A simple app that explains how to use data binding features of OpenUI5"},"sap.ui":{"technology":"UI5","deviceTypes":{"desktop":true,"tablet":true,"phone":true}},"sap.ui5":{"dependencies":{"minUI5Version":"1.148","libs":{"sap.m":{},"sap.ui.core":{}}},"contentDensities":{"compact":true,"cozy":true},"models":{"":{"type":"sap.ui.model.json.JSONModel","uri":"./model/data.json"}},"rootView":{"viewName":"ui5.tutorial.databinding.view.App","type":"XML","id":"app"},"flexBundle":false}}',
	"ui5/tutorial/databinding/view/App.view.xml":'<mvc:View\n\txmlns="sap.m"\n\txmlns:mvc="sap.ui.core.mvc"><Text text="Hi, my name is Harry Hawk"/></mvc:View>'
});
//# sourceMappingURL=Component-preload.js.map

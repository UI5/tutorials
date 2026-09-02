//@ui5-bundle ui5/tutorial/quickstart/Component-preload.js
sap.ui.predefine("ui5/tutorial/quickstart/App.controller", ["sap/ui/core/mvc/Controller","sap/m/MessageToast"],function(s,t){"use strict";const e=s.extend("ui5.tutorial.quickstart.App",{onPress:function s(){t.show("Hello App!")}});return e});
sap.ui.predefine("ui5/tutorial/quickstart/index", ["sap/ui/core/mvc/XMLView"],function(e){"use strict";e.create({viewName:"ui5.tutorial.quickstart.App"}).then(e=>e.placeAt("content"))});
sap.ui.require.preload({
	"ui5/tutorial/quickstart/App.view.xml":'<mvc:View\n  controllerName="ui5.tutorial.quickstart.App"\n  displayBlock="true"\n  xmlns="sap.m"\n  xmlns:mvc="sap.ui.core.mvc"><App><Page title="My App"><Button\n        text="Steady..."\n        press=".onPress"\n        type="Emphasized"\n        class="sapUiSmallMargin"/></Page></App></mvc:View>\n',
	"ui5/tutorial/quickstart/manifest.json":'{"_version":"2.8.0","sap.app":{"id":"ui5.tutorial.quickstart","type":"application","title":"OpenUI5 Quickstart","applicationVersion":{"version":"1.0.0"}},"sap.ui5":{"flexBundle":false}}'
});
//# sourceMappingURL=Component-preload.js.map

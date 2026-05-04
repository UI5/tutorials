//@ui5-bundle ui5/quickstart/Component-preload.js
sap.ui.predefine("ui5/quickstart/App.controller", ["sap/ui/core/mvc/Controller","sap/m/MessageToast"],function(s,e){"use strict";const t=s.extend("ui5.quickstart.App",{onPress:function s(){e.show("Hello App!")}});return t});
sap.ui.predefine("ui5/quickstart/index", ["sap/ui/core/mvc/XMLView"],function(e){"use strict";e.create({viewName:"ui5.quickstart.App"}).then(e=>e.placeAt("content"))});
sap.ui.require.preload({
	"ui5/quickstart/App.view.xml":'<mvc:View\n\tcontrollerName="ui5.quickstart.App"\n\tdisplayBlock="true"\n\txmlns="sap.m"\n\txmlns:mvc="sap.ui.core.mvc"><App><Page title="My App"><Button\n\t\t\t\ttext="Steady..."\n\t\t\t\tpress=".onPress"\n\t\t\t\ttype="Emphasized"\n\t\t\t\tclass="sapUiSmallMargin"/></Page></App></mvc:View>',
	"ui5/quickstart/manifest.json":'{"_version":"1.60.0","sap.app":{"id":"ui5.quickstart","type":"application","title":"OpenUI5 Quickstart","applicationVersion":{"version":"1.0.0"}},"sap.ui5":{"flexBundle":false}}'
});
//# sourceMappingURL=Component-preload.js.map

//@ui5-bundle ui5/tutorial/walkthrough/Component-preload.js
sap.ui.predefine("ui5/tutorial/walkthrough/controller/App.controller", ["sap/m/MessageToast","sap/ui/core/mvc/Controller"],function(o,e){"use strict";const t=e.extend("ui5.tutorial.walkthrough.controller.App",{onShowHello:function e(){o.show("Hello World")}});return t});
sap.ui.predefine("ui5/tutorial/walkthrough/index", ["sap/ui/core/mvc/XMLView"],function(e){"use strict";e.create({viewName:"ui5.tutorial.walkthrough.view.App",id:"app"}).then(function(e){e.placeAt("content")})});
sap.ui.require.preload({
	"ui5/tutorial/walkthrough/manifest.json":'{"_version":"2.8.0","sap.app":{"id":"ui5.tutorial.walkthrough","type":"application","title":"OpenUI5 TypeScript Walkthrough","applicationVersion":{"version":"1.0.0"}},"sap.ui5":{"flexBundle":false}}',
	"ui5/tutorial/walkthrough/view/App.view.xml":'<mvc:View controllerName="ui5.tutorial.walkthrough.controller.App"\n   xmlns="sap.m"\n   xmlns:mvc="sap.ui.core.mvc"><Button\n      text="Say Hello"\n      press=".onShowHello"/></mvc:View>\n'
});
//# sourceMappingURL=Component-preload.js.map

//@ui5-bundle ui5/walkthrough/Component-preload.js
sap.ui.predefine("ui5/walkthrough/controller/App.controller", ["sap/m/MessageToast","sap/ui/core/mvc/Controller","sap/ui/model/json/JSONModel"],function(o,e,n){"use strict";const t=e.extend("ui5.walkthrough.controller.App",{onInit:function o(){const e={recipient:{name:"World"}};const t=new n(e);this.getView()?.setModel(t)},onShowHello:function e(){o.show("Hello World")}});return t});
sap.ui.predefine("ui5/walkthrough/index", ["sap/ui/core/mvc/XMLView"],function(e){"use strict";e.create({viewName:"ui5.walkthrough.view.App",id:"app"}).then(function(e){e.placeAt("content")})});
sap.ui.require.preload({
	"ui5/walkthrough/manifest.json":'{"_version":"1.60.0","sap.app":{"id":"ui5.walkthrough","type":"application","title":"OpenUI5 TypeScript Walkthrough","applicationVersion":{"version":"1.0.0"}},"sap.ui5":{"flexBundle":false}}',
	"ui5/walkthrough/view/App.view.xml":'<mvc:View controllerName="ui5.walkthrough.controller.App"\n   xmlns="sap.m"\n   xmlns:mvc="sap.ui.core.mvc"><Button\n      text="Say Hello"\n      press=".onShowHello"/><Input\n      value="{/recipient/name}"\n      description="Hello {/recipient/name}"\n      valueLiveUpdate="true"\n      width="60%"/></mvc:View>'
});
//# sourceMappingURL=Component-preload.js.map

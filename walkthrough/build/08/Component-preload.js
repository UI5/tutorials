//@ui5-bundle ui5/walkthrough/Component-preload.js
sap.ui.predefine("ui5/walkthrough/controller/App.controller", ["sap/m/MessageToast","sap/ui/core/mvc/Controller","sap/ui/model/json/JSONModel","sap/ui/model/resource/ResourceModel"],function(e,t,o,n){"use strict";const s=t.extend("ui5.walkthrough.controller.App",{onInit:function e(){const t={recipient:{name:"World"}};const s=new o(t);this.getView()?.setModel(s);const i=new n({bundleName:"ui5.walkthrough.i18n.i18n"});this.getView()?.setModel(i,"i18n")},onShowHello:function t(){const o=this.getView()?.getModel()?.getProperty("/recipient/name");const n=this.getView()?.getModel("i18n")?.getResourceBundle();const s=n.getText("helloMsg",[o]);e.show(s)}});return s});
sap.ui.predefine("ui5/walkthrough/index", ["sap/ui/core/mvc/XMLView"],function(e){"use strict";e.create({viewName:"ui5.walkthrough.view.App",id:"app"}).then(function(e){e.placeAt("content")})});
sap.ui.require.preload({
	"ui5/walkthrough/i18n/i18n.properties":'showHelloButtonText=Say Hello\nhelloMsg=Hello {0}',
	"ui5/walkthrough/manifest.json":'{"_version":"1.60.0","sap.app":{"id":"ui5.walkthrough","type":"application","title":"OpenUI5 TypeScript Walkthrough","applicationVersion":{"version":"1.0.0"},"i18n":{"bundleUrl":"i18n/i18n.properties","supportedLocales":[""]}},"sap.ui5":{"flexBundle":false}}',
	"ui5/walkthrough/view/App.view.xml":'<mvc:View controllerName="ui5.walkthrough.controller.App"\n   xmlns="sap.m"\n   xmlns:mvc="sap.ui.core.mvc"><Button\n      text="{i18n>showHelloButtonText}"\n      press=".onShowHello"/><Input\n      value="{/recipient/name}"\n      description="Hello {/recipient/name}"\n      valueLiveUpdate="true"\n      width="60%"/></mvc:View>'
});
//# sourceMappingURL=Component-preload.js.map

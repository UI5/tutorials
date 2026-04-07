## Step 2: Bootstrap

Before we can do something with OpenUI5, we need to load and initialize it. This process of loading and initializing OpenUI5 is called **bootstrapping**. Once this bootstrapping is finished, we simply display an alert.

&nbsp;

***

### Preview


![](assets/loio0f6b6b9dc46a474da9287c382c8d3456_LowRes.png "An alert &quot;UI5 is ready&quot; is displayed")

<sup>*An alert &quot;UI5 is ready&quot; is displayed*</sup>

You can access the live preview by clicking on this link: [🔗 Live Preview of Step 2](https://sap-samples.github.io/ui5-typescript-walkthrough/walkthrough/build/02/index-cdn.html).

***
### Coding

<details class="ts-only">

You can download the solution for this step here: [📥 Download step 2](https://sap-samples.github.io/ui5-typescript-walkthrough/walkthrough/walkthrough-step-02.zip).

</details> 

<details class="js-only">

You can download the solution for this step here: [📥 Download step 2](https://sap-samples.github.io/ui5-typescript-walkthrough/walkthrough/walkthrough-step-02-js.zip).

</details>
***

### Development Environment

First, let's set up our UI5 CLI to use the OpenUI5 framework for our project. We also need to add the necessary OpenUI5 libraries as dependencies to the project's UI5 CLI configuration.

We open a terminal in the root folder of our app and execute the following command:

```sh
ui5 use OpenUI5
```

This command tells the UI5 CLI to use the OpenUI5 framework to build and run the application. Next, we configure some runtime dependencies by executing the following command:

```sh
ui5 add sap.ui.core themelib_sap_horizon
```

The `ui5 add` command adds specific libraries as dependency to the projects UI5 CLI configuration. In this case, we'e adding the `sap.ui.core` library, which provides core functionality of the OpenUI5 framework. This library is essential for bootstrapping OpenUI5. Additionally, we're adding the `themelib_sap_horizon` library which provides the visual styles for the Horizon theme. We'll use this theme with our application. 


<details class="ts-only">

### TypeScript Setup

To work with TypeScript, we must install it in our project. To do this, we execute the following command in the terminal:


```sh
npm install typescript --save-dev
```

By running this command, npm will download the TypeScript package from the npm registry and install it in our project's "node_modules" directory. It will also add an entry for TypeScript in the "devDependencies" section of our package.json file, so that other developers working on the project can easily install the same version of TypeScript.


### tsconfig.json \(New\)

As a next step, we need to create the file `tsconfig.json` in the app root directory to indicate that this folder is the root of a TypeScript project. This file specifies various compiler options and project settings that affect how TypeScript code is compiled into JavaScript.

We specify the compiler options as follow:


```json
{
    "compilerOptions": {
      "target": "es2023",
      "module": "es2022",
      "moduleResolution": "node",
      "skipLibCheck": true,
      "allowJs": true,
      "strict": true,
      "strictPropertyInitialization": false,
      "rootDir": "webapp",
      "baseUrl": "./",
      "paths": {
        "ui5/walkthrough/*": ["webapp/*"]
      }
    },
    "include": ["webapp/**/*"]
  }
```

Let's go through the compiler options specified in the file:

- `"target": "es2022"`: The `target` parameter sets the JavaScript language level that the TypeScript code should be compiled down to. We set it to ES2022, which means the generated JavaScript code will be compatible with ECMAScript 2022.

- `"module": "es2022"`: The `module` parameter specifies the module code generation for the compiled JavaScript. We configured it to ES2022, which means the generated JavaScript will use ECMAScript modules.

- `"moduleResolution": "node"`: The `moduleResolution` parameter specifies how module dependencies should be resolved. We set it to "node", which means the compiler will use Node.js-style module resolution.

- `"skipLibCheck": true`: When the `skipLibCheck` parameter is set to `true`, it tells the compiler to skip type checking of declaration files (`.d.ts` files) that are part of external libraries. This can improve compilation speed.

- `"allowJs": true`: The `allwJs` parameter allows JavaScript files to be included in the TypeScript project. This option enables TypeScript to compile JavaScript code along with TypeScript code.

- `"strict": true`: When set to "true" the `strict` parameter enables a wide range of type checking behavior that results in more type-safe programs. It includes settings like `noImplicitAny`, `noImplicitThis`, `alwaysStrict` and others.

- `"strictPropertyInitialization": false`: The `strictPropertyInitialization` parameter is a specific type of strict check that ensures that each instance property of a class gets initialized in the constructor body, or by a property initializer. By setting this to false, it disables strict checking of uninitialized class properties. This means that class properties can be left uninitialized or assigned the value `undefined` without causing a compiler error.

- `"rootDir": "webapp"`: The `rootDir` paraemter specifies the root directory of the TypeScript source files. The compiler will consider this directory as the starting point for resolving file paths. We set it to our `webapp` folder.

- `"baseUrl": "./"`: The `baseUrl` parameter is used to resolve non-relative module names. We specified that non-relative module names are resolved relative to the location of the `tsconfig.json` file.

- `"paths": { "ui5/walkthrough/*": ["webapp/*"] }`: The `path` paramter specifies path mappings for module resolution. It allows you to define custom module paths that map to specific directories or files. In this case, it maps the module path `ui5/walkthrough/*`

***

</details>

### webapp/index.?s \(New\)

Now let's move on to the UI work. We create a new `index.?s` script in the webapp folder. In this script, we add a native `alert()` method with the message "UI5 is ready".

```js
alert("UI5 is ready");
```

### webapp/index.html

Next, we'll integrate the script we just created into the `index.html` page to signal when the OpenUI5 framework has finished loading. This process involves first incorporating the OpenUI5 framework into our HTML page by adding a script tag specifically for loading OpenUI5. 

We initialize the core modules with the following configuration options:

-   The `id` attribute of the `<script>` tag has to be exactly `"sap-ui-bootstrap"` to ensure proper booting of the OpenUI5 runtime.

-   The `src` attribute of the `<script>` tag tells the browser where to find the OpenUI5 core library – it initializes the OpenUI5 runtime and loads additional resources, such as the theme specified in the `data-sap-ui-theme` attribute.

-   The OpenUI5 controls support different themes. With setting the `data-sap-ui-theme` attribute of the `<script>` tag to "sap_horizon" we specify the Horizon theme as our default theme.

-   To make use of the most recent functionality of OpenUI5 we specify the `data-sap-ui-compat-version` attribute as `edge`.

-   We configure the bootstrapping process to run asynchronously by setting the `data-sap-ui-async` attribute to "true". This means that the OpenUI5 resources can be loaded simultaneously in the background for performance reasons.

-    The `data-sap-ui-on-init` attribute is used in OpenUI5 to specify the name of a module that should be executed when the framework is fully loaded and initialized. This approach provides a way to avoid directly including executable JavaScript code in the HTML file, which improves the security of our application. To specify the name of the module, you need to provide the module name as the value of the `data-sap-ui-on-init` attribute. The module name should be in the format of a module path, which is a dot-separated string that represents the location of the module within the application's folder structure. When specifying the path to a module within the current project, it's important to include the namespace (explained below) and omit the file extension. We specify the `index.ts` script to the `data-sap-ui-on-init` attribute.

-   The `data-sap-ui-resource-roots` attribute lets you map a namespace to a specific path. We define the `ui5.walkthrough` namespace and map it relative to the location of `index.html`. This way, we tell OpenUI5 core that resources in the `ui5.walkthrough` namespace are located in the same folder as `index.html`.

```html
<!DOCTYPE html>
<html>
<head>
	<meta charset="utf-8">
	<title>UI5 TypeScript Walkthrough</title>
<script
		id="sap-ui-bootstrap"
		src="resources/sap-ui-core.js"
		data-sap-ui-theme="sap_horizon"
		data-sap-ui-compat-version="edge"
		data-sap-ui-async="true"
		data-sap-ui-on-init="module:ui5/walkthrough/index"
		data-sap-ui-resource-roots='{
			"ui5.walkthrough": "./"
		}'>
	</script>
</head>
<body>
	<div>Hello World</div>
</body>
</html>
```

> 📝 **Note:**<br>
> The namespace is a unique identifier for your application file. It helps prevent naming conflicts with other modules or libraries.

***

### Development Environment

Let's enhance our tooling setup once again by installing some custom middleware for the ui5-server. This will help us handle our development project more efficiently.

We open a terminal and navigate to the root folder of our app. Then, we execute the following command:

<details class="ts-only">

```sh
npm install ui5-middleware-livereload ui5-middleware-serveframework ui5-tooling-transpile --save-dev
```
</details>

<details class="js-only">

```sh
npm install ui5-middleware-livereload ui5-middleware-serveframework --save-dev
```
</details>

When you run the command, npm will download the specified packages from the npm registry and store them in a folder called `node_modules` within your project directory. The `--save-dev` flag instructs npm to save these packages as development dependencies in the `devDependencies` section of the `package.json` file. Development dependencies are packages that are only needed during development and not in production. By separating them from production dependencies, we can keep our project clean and ensure that only the required packages are included when deploying the application.

Let's break down what each package does:

-	`ui5-middleware-livereload` is a middleware plugin for the UI5 CLI that enables live reloading of your application in the browser. Live-reloading means that whenever you make changes to your code, the browser automatically refreshes and displays the updated version without requiring manual refreshes (e.g. upon *Save*).

-	`ui5-middleware-serveframework` is another middleware plugin for the UI5 CLI that provides a web server to serve your OpenUI5 project during development. It allows you to easily serve the necessary OpenUI5 libraries and resources required by your application from your development environment.

<details class="ts-only">

- `ui5-tooling-transpile` is a plugin for the UI5 CLI that transpiles modern JavaScript (ES6+) and TypeScript into a compatible version for OpenUI5. OpenUI5 is based on older versions of JavaScript, so this plugin allows you to take advantage of the latest language features and syntax while ensuring that your code remains compatible with OpenUI5.

</details>

### ui5.yaml

Next,  we have to configure the tooling extension we installed from npm to our UI5 CLI setup, so we can use them in our project. To hook a custom task into a certain build phase of a project, it needs to reference another task that will get executed before or after it. The same applies for a custom middleware:
<details class="ts-only">

-   For the `ui5-tooling-transpile-task` we specify that this should happen after the`replaceVersion` task.

</details>

-   All our custom middleware extensions will be called after the `compression` middleware.

> 📌 **Important:** <br>
> Middleware configurations are applied in the order in which they are defined. 

<details class="ts-only">

```yaml
framework:
  name: OpenUI5
  version: "1.145.1"
  libraries:
    - name: sap.ui.core
    - name: themelib_sap_horizon
builder:
  customTasks:
  - name: ui5-tooling-transpile-task
    afterTask: replaceVersion
server:
  customMiddleware:
  - name: ui5-tooling-transpile-middleware
    afterMiddleware: compression
  - name: ui5-middleware-serveframework
    afterMiddleware: compression
  - name: ui5-middleware-livereload
    afterMiddleware: compression
```
Now you can benefit from live reload on changes, built framework resources at development time, and make use of TypeScript in OpenUI5.

</details>

<details class="js-only">

```yaml
framework:
  name: OpenUI5
  version: "1.145.1"
  libraries:
    - name: sap.ui.core
    - name: themelib_sap_horizon
builder:
server:
  customMiddleware:
  - name: ui5-middleware-serveframework
    afterMiddleware: compression
  - name: ui5-middleware-livereload
    afterMiddleware: compression
```
Now you can benefit from live reload on changes and built framework resources at development time.

</details>

<br>
> 📝 **Note:**<br>
> During its initial run, the `ui5-middleware-serveframework` middleware will build the framework, which can take a while. In all following steps, the build will not happen again and the framework is served from the built resources.

&nbsp;

***

**Next:** [Step 3: Controls](../03/README.md "Now it's time to build our first little UI by replacing the Hello World text in the HTML body by the OpenUI5 control sap.m.Text. In the beginning, we will use the TypeScript control API to set up the UI, the control instance is then placed into the HTML body‚")

**Previous:** [Step 1: Hello World!](../01/README.md "As you know OpenUI5 is all about HTML5. Let's get started with building a first Hello World with only HTML. In addition we will initialize the UI5 CLI, so we can benefit from it from the beginning.")

***

**Related Information** 

[UI5 CLI: Consuming OpenUI5 Libaries](https://ui5.github.io/cli/stable/pages/OpenUI5/)

[SAP Fiori with Horizon](https://experience.sap.com/fiori-design-web/sap-fiori/#sap-fiori-with-horizon)

[What is a tsconfig.json](https://www.typescriptlang.org/docs/handbook/tsconfig-json.html)

[Bootstrapping: Loading and Initializing](https://sdk.openui5.org/topic/a04b0d10fb494d1cb722b9e341b584ba.html "To use OpenUI5 features in your HTML page, you have to load and initialize the OpenUI5 library.")

[Content Security Policy](https://sdk.openui5.org/topic/fe1a6dba940e479fb7c3bc753f92b28c.html "Content Security Policy (CSP) adds an additional layer of security that can detect and mitigate certain types of attacks, such as cross-site scripting and data injection.")

[NPM Package: `ui5-middleware-livereload`](https://www.npmjs.com/package/ui5-middleware-livereload)

[NPM Package: `ui5-middleware-serveframework`](https://www.npmjs.com/package/ui5-middleware-serveframework)

[NPM Package: `ui5-tooling-transpile`](https://www.npmjs.com/package/ui5-tooling-transpile)

[UI5 CLI: Custom Tasks](https://ui5.github.io/cli/stable/pages/extensibility/CustomTasks/)

[UI5 CLI: Custom Server Middleware](https://ui5.github.io/cli/stable/pages/extensibility/CustomServerMiddleware/)

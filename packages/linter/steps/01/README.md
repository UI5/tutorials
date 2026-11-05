# Step 1: Introduction & Setup

## 1.1 What is UI5 linter?

UI5 linter is a static code analysis tool that scans your OpenUI5 project and reports issues before they cause problems at runtime. It checks for:

- Deprecated UI5 APIs and patterns
- Global variable usage
- Synchronous loading patterns
- Content Security Policy (CSP) violations
- `manifest.json` configuration problems

## 1.2 Install UI5 linter

> 📝
> If you see an error like `npm: command not found`, you need to install Node.js first. Grab the LTS version from [nodejs.org](https://nodejs.org/).

```bash
# Install UI5 linter globally (provides the ui5lint command)
npm install -g @ui5/linter

# Verify installation
ui5lint --version
```

## 1.3 Project Setup

[📥 Download the starting app](https://ui5.github.io/tutorials/linter/assets/linter-app.zip)

Download and extract the ZIP, then open a terminal in the extracted folder and run:

```bash
# Install dependencies (includes UI5 linter as a dev dependency)
npm install

# Start the UI5 CLI dev server
npm start
```

Open [`http://localhost:8080/index.html`](http://localhost:8080/index.html) in your browser. You should see a simple Todo application. The app intentionally contains several legacy code patterns that you will identify and fix throughout this tutorial.

***

**Next:** [Step 2: Running UI5 Linter](../02/README.md)

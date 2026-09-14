---
title: OpenUI5 Tutorials
permalink: index.html
---

[![REUSE status](https://api.reuse.software/badge/github.com/UI5/tutorials)](https://api.reuse.software/info/github.com/UI5/tutorials)

# Tutorials

These tutorials cover [OpenUI5](https://sdk.openui5.org/#/topic/ec699e0817fb46a0817b0fa276a249f8) application development, from beginner foundations to focused deep dives on specific concepts. Along the way you'll also use the [UI5 CLI](https://ui5.github.io/cli/stable/) for local development tooling.

All tutorials are available in both **TypeScript** and **JavaScript**. Use the language toggle at the top of each tutorial page to switch between versions.

No prior OpenUI5 experience is needed. Basic familiarity with HTML, CSS, and JavaScript (or TypeScript) is assumed.

## Learning path

| Tutorial | Type | Content
|---|---|---|
| [Quickstart](./quickstart/) | Foundation | Get a first OpenUI5 app running in minutes, covering bootstrapping, MVC basics, and a quick showcase of data binding and navigation. |
| [Walkthrough](./walkthrough/) | Foundation | Builds a complete app from scratch, covering MVC, data binding, navigation, custom controls, testing, and production build. |
| [Data Binding](./databinding/) | Deep dive | Explores the core binding modes in depth along with formatting, data types, and validation. |
| [Navigation and Routing](./navigation/) | Deep dive | Covers the core routing API through a realistic employee app: URL parameters, transitions, bookmarkable states, lazy loading, and error handling. |
| [OData V4](./odatav4/) | Deep dive | Builds a list/detail app against an OData V4 service covering CRUD operations, filtering, sorting, batch groups, and OData actions. |

The live published site is at **<https://ui5.github.io/tutorials/>**.

## Repository structure

{% raw %}
```
packages/
 <tutorial>/
  docs/         # Markdown source for the tutorial steps
  steps/        # One self-contained app per step
```
{% endraw %}

Each step under `steps/` is a standalone npm workspace package named `ui5.tutorial.<name>.stepNN`.

The JS/TS language toggle is implemented via CSS classes (`ts-only`, `js-only`) on elements in the markdown source. The local dev server and the GitHub Pages site both apply the toggle at render time. On plain github.com those elements render as standard collapsed HTML details.

## Running locally

The repository is set up as an npm workspaces monorepo. Each tutorial step under `packages/*/steps/*` is a self-contained app you can run standalone, and the root build orchestrator produces a unified preview that mirrors the published GitHub Pages site.

**Prerequisites:** 
Node.js 20.11.0 or higher, or v22 or higher (v21 is not supported). The UI5 CLI is installed automatically as part of `npm install`. 

{% raw %}
```sh
# 1) install dependencies for every step
npm install

# 2) build every tutorial step (produces dist/<tutorial>/build/NN/ apps + ZIP downloads)
npm run build

# 3) serve the rendered tutorial pages with working Live Preview links
npm start
```
{% endraw %}

After `npm start`, open <http://localhost:1337/packages/walkthrough/> (or any other tutorial's `packages/<name>/`). The dev server renders the markdown overview, rewrites the published `https://ui5.github.io/tutorials/...` URLs to point at the local `dist/`, and serves the built apps from the same origin.

To run a single step directly without going through the build:

{% raw %}
```sh
npm start -w ui5.tutorial.walkthrough.step15
```
{% endraw %}

## How to obtain support

[Create an issue](https://github.com/UI5/tutorials/issues) in this repository if you find a bug or have questions about the content.

For additional support, [ask a question in OpenUI5 Community on Slack](https://ui5-slack-invite.cfapps.eu10.hana.ondemand.com/).

## Contributing

If you wish to contribute code, offer fixes or improvements, please send a pull request. Due to legal reasons, contributors will be asked to accept a DCO when they create the first pull request to this project. This happens in an automated fashion during the submission process. SAP uses [the standard DCO text of the Linux Foundation](https://developercertificate.org/).

## License

Copyright (c) 2026 SAP SE or an SAP affiliate company. All rights reserved. This project is licensed under the Apache Software License, version 2.0 except as noted otherwise in the [LICENSE](https://github.com/UI5/tutorials/blob/-/LICENSE) file.

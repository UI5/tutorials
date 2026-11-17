---
title: OpenUI5 Tutorials
permalink: agentic/steps/03/index.html
---

<div data-no-language-toggle hidden></div>

<nav class="tutorial-breadcrumb"><a href="../../../index.html">UI5 Tutorials</a> <span class="tutorial-breadcrumb-sep">&rsaquo;</span> <a href="../../index.html">Agentic Development Tutorial</a></nav>

# Step 3: Convert a JavaScript OpenUI5 Project to TypeScript (30 min)

[← Previous: Step 2 — Create & enhance a JS app](../02/index.html) | [Back to Overview](../../index.html) | [Next: Step 4 — Modernize a legacy app →](../04/index.html)

In this step you convert the JavaScript app from Step 2 to **TypeScript** using the
dedicated **UI5 TypeScript conversion skill**, which applies the official conversion guidelines
(project setup, `tsconfig`, types packages, ES modules, typed event handlers). You then fix any
remaining type errors together with Claude Code and verify the result compiles, runs, and lints
clean.

## 3.0 Set up your starting point

> 📝
> Each step works best in its **own Claude Code session** so the context stays focused.
> Follow the steps below before running the conversion skill.

### Copy your Step 2 app (or use the sample app)

**If you completed Step 2**, copy your finished app into a new folder: copy the project folder and
paste it with a new name (e.g. `products-ts`) next to the original.

**If you did not complete Step 2**, download the ready-made sample app instead:

1. Download [sample-app.zip](https://github.com/UI5/sample-app/archive/refs/heads/main.zip) and save it to your `apps` folder.
2. Extract it into `apps/products-ts`.
3. Open a terminal in `apps/products-ts` and run:
   ```
   npm install
   ```

Then install the TypeScript conversion plugin:

{% raw %}
```bash
claude plugin install ui5-typescript-conversion@claude-plugins-official
```
{% endraw %}

Then open a terminal in the copied or extracted project's root directory (the directory containing `package.json` and `ui5.yaml`) and launch a **new Claude Code session** with the conflicting MCP tool disabled:

{% raw %}
```bash
claude --disallowedTools "mcp__plugin_ui5_ui5-mcp-server__get_typescript_conversion_guidelines"
```
{% endraw %}

> 📝
> `products-ts` is a new folder, so Claude Code asks you to trust it on launch (see
> [Step 1 → section 1.4](../01/index.html#14-launch-claude-code)); confirm to proceed.

> 📝
> The conversion **skill** owns the full setup (dependencies, `tsconfig.json`, `ui5.yaml` transpile
> config, ES-module conversion). The UI5 MCP server also exposes a TypeScript-conversion guideline
> tool — disabling it prevents overlap so the skill drives the conversion end-to-end.

> 💡
> Starting a new session keeps the TypeScript conversion context clean and avoids carry-over
> tool state from Step 2.

## 3.1 Run the conversion skill

> 💡
> **Task:** Point Claude Code at the Step 2 app and run:
> ```
> /ui5-typescript-conversion
> ```
> Approve the steps as it works. Watch it:
> - add `typescript`, `@openui5/types` (matching the project's OpenUI5 version), and the
>   `ui5-tooling-transpile` tooling as dev dependencies;
> - add a `tsconfig.json` (with the `paths` map for the app namespace) and a `ts-typecheck` script;
> - update `ui5.yaml` with the transpile task and middleware.

## 3.2 Watch the code conversion

> 📝
> The conversion is interactive. Claude Code may pause to show you a plan and ask for approval
> before proceeding, and may ask follow-up questions during conversion, for example whether to
> update existing unit tests to match a changed type signature. Read each prompt and confirm or
> adjust as needed.

Claude Code converts the app modules from the proprietary OpenUI5 class syntax to standard ES classes
and ES imports:

- `Controller.extend("...", { ... })` → `export default class … extends Controller { … }` with a
  `@namespace` JSDoc comment.
- `sap.ui.define([...], function(...) {...})` → `import` statements + `export default`.
- Event handlers get **specific OpenUI5 event types**, e.g.:

{% raw %}
```ts
import { ListBase$SelectionChangeEvent } from "sap/m/ListBase";

onSelectionChange(event: ListBase$SelectionChangeEvent): void {
    // event.getParameter(...) is now typed
}
```
{% endraw %}

> 💡
> **Task:** Skim one converted controller. Confirm it imports real OpenUI5 types (no `sap.m.Button`
> global references, no `any`/`unknown` casts) and that all JSDoc comments were preserved.

## 3.3 Fix remaining type errors

> 💡
> **Task:** Ask Claude Code:
> ```
> Run the type check and fix any remaining type errors.
> ```
> ```bash
> npx tsc --noEmit
> ```
> Common cases: casting the result of `this.byId(...)` / `getModel(...)` to the specific control or
> model type, and adding private member declarations to classes.

## Verify

- [ ] `npx tsc --noEmit` passes with no errors.
- [ ] The app still runs and behaves as in Step 2.
- [ ] The UI5 linter is clean: *"Run the UI5 linter and report the findings."*

## Summary

You converted a OpenUI5 application to TypeScript with the conversion skill and verified it end-to-end. In
Step 4 you switch from *building* to *modernizing* — taking a deliberately legacy app and
bringing it up to current best practices with the modernization workflow.

***

**Previous:** [Step 2: Create & Enhance a New OpenUI5 Application in JavaScript](../02/index.html)

**Next:** [Step 4: Modernize a Legacy OpenUI5 Project](../04/index.html)

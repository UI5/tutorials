---
title: OpenUI5 Tutorials
permalink: agentic/FAQ.html
---

<div data-no-language-toggle hidden></div>

# Frequently Asked Questions

Answers to the most common questions that come up during the tutorial.

---

## Step 1 — Getting Started

**Q: I get "plugin not found" when running `claude plugin install ui5@claude-plugins-official`.**

The local marketplace index may be stale. Refresh it first, then install again:

{% raw %}
```bash
claude plugin marketplace update claude-plugins-official
claude plugin install ui5@claude-plugins-official
```
{% endraw %}

---

**Q: After installing the UI5 plugin, Claude Code doesn't list the UI5 MCP server tools.**

Make sure you started (or restarted) `claude` **after** the plugin install — MCP tools are loaded at startup. Exit your current session with `/exit`, then run `claude` again.

---

**Q: I asked "Which UI5 MCP server tools do you have available?" and got no tool names — only a generic answer.**

This means the UI5 MCP server wasn't loaded. Verify the plugin is installed (`claude plugin list`) and restart `claude`. If the list is there but empty, check that you launched `claude` from a directory where the plugin context loads.

---

**Q: The plugin is installed and `claude` has been restarted, but the UI5 MCP server tools are still not available.**

In rare cases the MCP server process fails to start cleanly during plugin load. The plugin appears in `claude plugin list`, but the server itself never initialises. To recover:

1. Type `/plugins` inside your Claude Code session.
2. Search for the **ui5** plugin.
3. Click **Reconnect** on the MCP server entry.
4. Wait a few seconds, then ask again:
   ```
   Which UI5 MCP server tools do you have available?
   ```
   You should now see tools such as `get_guidelines`, `get_api_reference`, `run_ui5_linter`, and `create_ui5_app`.

The expected tool list is covered in [Step 1 → section 1.4](steps/01/index.html#14-launch-claude-code).

---

**Q: The `get_api_reference` call for `sap.m.Button` ran, but the result looks like it came from the model's memory, not the real API.**

Check the output carefully: a grounded call shows a tool-use block labelled `get_api_reference` with a `query` parameter. If you only see plain prose with no tool call in the output, the MCP server was not actually invoked. Restart `claude` and ask again.

---

## Step 2 — Create & Enhance a JS App

**Q: `npm run watch` for the CAP mock service fails with "not found" or port errors.**

Make sure you extracted the zip and are in the right directory:

{% raw %}
```bash
cd ~/apps
tar -xf cap-mock.zip
cd cap-mock
npm install      # if not done yet
npm run watch
```
{% endraw %}

If port 4004 is already in use, find the occupying process with `lsof -i :4004` and kill it, or stop the previous `cds watch` instance.

---

**Q: The application scaffolded by Claude Code doesn't show any products — the table is empty.**

Check that the CAP service is running at `http://localhost:4004`. Open `http://localhost:4004/odata/v4/catalog/Products` in a browser; you should see JSON. If the service is down, start it first. If the service is up but the application is still empty, ask Claude Code to run the UI5 linter and validate the manifest — a misconfigured `dataSource` URL is the most common cause.

---

**Q: Claude Code generated a custom JavaScript formatter for the price column instead of using an OData type.**

This is a grounding failure. Ask Claude Code to check the best-practice guidelines and use a built-in OData type instead:

> *"Replace the custom price formatter with `sap.ui.model.odata.type.Currency` or the OData `Decimal` type with `formatOptions`. Check the OpenUI5 table guidelines first."*

---

**Q: Only the default `i18n.properties` was updated; the other locale files are still missing the new keys.**

Ask Claude Code explicitly:

> *"Add all new i18n keys to every locale file in `webapp/i18n/`, not just the default bundle."*

---

**Q: After adding Spanish (`i18n_es.properties`), appending `?sap-language=es` to the URL still shows the default language.**

The `manifest.json` must declare Spanish in `sap.ui5/models/i18n`:

{% raw %}
```json
"supportedLocales": ["en", "es", ""],
"fallbackLocale": ""
```
{% endraw %}

The empty string `""` registers the default bundle; without it, the resource bundle cannot resolve fallbacks. Ask Claude Code to validate the manifest with `run_manifest_validation`.

---

## Step 3 — Convert to TypeScript

**Q: I get "plugin not found" when running `claude plugin install ui5-typescript-conversion@claude-plugins-official`.**

The TypeScript conversion plugin is separate from the base UI5 plugin. Refresh the marketplace first:

{% raw %}
```bash
claude plugin marketplace update claude-plugins-official
claude plugin install ui5-typescript-conversion@claude-plugins-official
```
{% endraw %}

---

**Q: The TypeScript conversion skill and the UI5 MCP server's own TypeScript tool both want to run at the same time.**

The conversion **skill** owns the full setup. Disable the MCP server's TypeScript tool so the two don't overlap:

{% raw %}
```bash
claude --disallowedTools "mcp__plugin_ui5_ui5-mcp-server__get_typescript_conversion_guidelines"
```
{% endraw %}

Start a fresh Claude Code session with this flag before running `/ui5-typescript-conversion`.

---

**Q: `npx tsc --noEmit` reports errors about missing type declarations after the conversion.**

Common cases:
- `this.byId("someId")` returns `UI5Element | undefined` — cast it to the specific control type.
- `this.getModel()` returns `Model | undefined` — cast to `ODataModel` where appropriate.
- Event handler parameters (e.g. `event: Event`) should use the specific OpenUI5 event type (e.g. `ListBase$SelectionChangeEvent` from `sap/m/ListBase`).

Ask Claude Code:

> *"Run `npx tsc --noEmit` and fix each remaining type error, preferring specific OpenUI5 types over `any`."*

---

**Q: After the conversion the application no longer loads in the browser.**

A conversion that passes `tsc` but breaks at runtime usually means a module path was changed incorrectly. Ask Claude Code to run `ui5 serve` and check the browser console for 404s or `import`/`export` errors, then fix the affected paths.

---

## Step 4 — Modernize a Legacy App

**Q: I get "plugin not found" when running `claude plugin install ui5-modernization@claude-plugins-official`.**

The modernization plugin is separate from the base UI5 plugin. Refresh the marketplace first:

{% raw %}
```bash
claude plugin marketplace update claude-plugins-official
claude plugin install ui5-modernization@claude-plugins-official
```
{% endraw %}

---

**Q: The workflow refuses to start with "working tree is not clean".**

The modernization skill commits one change per phase and requires a clean baseline. Commit (or stash) any uncommitted changes first:

{% raw %}
```bash
cd ~/apps/legacy
git add -A && git commit -m "baseline: before modernization"
```
{% endraw %}

If you have not yet initialized a git repository, see [Step 4 → section 4.1](steps/04/index.html#41-set-up-the-legacy-app).

---

**Q: The UI5 linter baseline shows a different number of findings than the expected 36 problems / 1 fatal error.**

That is fine — the exact count can vary by `ui5lint` version. What matters is that the findings **map to the phases** described in the exercise table. Read the finding categories (globals, deprecated APIs, etc.) to confirm the right anti-patterns are detected.

---

**Q: Phase 1 (Test Starter) and Phase 5 (CSP) both say "nothing to fix" and produce no commit.**

That is the expected behavior for the curated legacy app. The exercise note explains it: the test infrastructure and `index.html` bootstrap were already modernized before the tutorial. Seeing the workflow correctly identify "nothing to do" is itself part of the learning.

---

**Q: The linter still reports findings after a phase completed.**

The workflow's verification gate should catch this. If you are in manual mode, run the linter yourself:

> *"Run the UI5 linter on this app and report the findings."*

If findings from the completed phase persist, ask Claude Code to re-run the corresponding skill. Findings from a **later** phase are expected at this point and the workflow will address them in order.

---

**Q: I accidentally ran a skill out of order. How do I get back to a known state?**

Use `git log --oneline` to see the phase commits, then `git revert --no-edit <commit>` to undo the last phase's commit, or `git reset --hard <commit>` to jump back to an earlier state. Prefer `revert` over `reset` to keep the history clean.

---

**Q: `MODERNIZATION-ISSUES.md` lists items that the workflow could not fix automatically. What do I do?**

These are cases that require human judgment — usually business-logic-dependent patterns or ambiguous deprecations. Read the file and address each item manually, then re-run the linter to confirm the residual count drops to zero (or is documented as intentional).

---

## Step 5 — Custom Control (TypeScript)

**Q: After scaffolding the control, `getValue()` and `setValue()` are not recognized by TypeScript.**

The `@ui5/ts-interface-generator` must be run to generate the typed accessors into a `*.gen.d.ts` file. Ask Claude Code:

> *"Run the `@ui5/ts-interface-generator` for the `StockIndicator` control and make sure the generated `StockIndicator.gen.d.ts` is present."*

---

**Q: The renderer uses `rm.write("<div>...")` and the linter flags it.**

`rm.write()` is the deprecated `apiVersion: 1` style. The control must use the semantic `RenderManager` API with `apiVersion: 2`:

{% raw %}
```ts
static renderer = {
    apiVersion: 2,
    render(rm: RenderManager, control: StockIndicator): void {
        rm.openStart("div", control);
        rm.class("myControlClass");
        rm.openEnd();
        rm.text(String(control.getValue()));
        rm.close("div");
    }
};
```
{% endraw %}

Ask Claude Code to rewrite the renderer using the correct API.

---

**Q: The ARIA attributes are written as string literals in the renderer (`rm.attr("aria-label", "...")`) instead of via `accessibilityState`.**

Best practice requires `rm.accessibilityState(control, { ... })` so the framework can manage accessibility state consistently. Ask Claude Code:

> *"Rewrite the ARIA output in the renderer to use `rm.accessibilityState(control, { label: ..., valuenow: ..., valuemin: 0, valuemax: control.getMaxValue() })`."*

---

**Q: The `StockIndicator` appears in the products table but never turns red, even for products below the threshold.**

Check that `value` is bound dynamically (`value="{stock}"`) rather than set to a static number. Also confirm the threshold is set (`threshold="50"`). If both look correct, open the browser console for binding errors and ask Claude Code to run the linter.

---

**Q: The CSS file I added for the control causes a Content Security Policy violation in the browser console.**

The control CSS must be loaded as an external file, not as inline `<style>` content or dynamically injected style strings. Ask Claude Code:

> *"Load the control's CSS via `includeStyleSheet` (or `sap.ui.dom.includeStylesheet`) from the control's `init` method, pointing to a file under `webapp/control/`. Do not assemble style strings from user-controlled values."*

---

## General Agent / Claude Code Questions

**Q: When I start Claude Code in a new folder it asks me to trust the files there. Is that safe, and why does it keep happening?**

That is the folder-trust prompt (introduced in [Step 1 → section 1.4](steps/01/index.html#14-launch-claude-code)). Claude Code shows it the first time you start it in a directory it hasn't seen, because it may read and run files in that folder. It is a control checkpoint, not an error. For this tutorial every folder is one you created or extracted yourself, so confirm to proceed. The choice is remembered per folder, which is why you only see it once per folder, then again for each new folder a later step introduces (the `apps` folder in Step 2, `products-ts` in Step 3, `legacy` in Step 4).

---

**Q: Claude Code keeps asking for permission to run a tool I want it to use freely.**

The first time a given tool runs, Claude Code asks permission (allow once / allow and don't ask again / reject). To stop the repeat prompts, choose **allow and don't ask again** for that tool. For the read-only UI5 MCP tools (`get_api_reference`, `run_ui5_linter`, `run_manifest_validation`, `get_version_info`, …) that is safe. You can review or change these decisions any time with `/permissions`.

> 📝
> Running `claude --dangerously-skip-permissions` bypasses *all* prompts for the session. It exists for unattended/CI use; do **not** use it while following this tutorial. The point here is to review what the agent does, and the prompts are how you do that.

---

**Q: The agent's output looks plausible but I'm not sure if the API it used is current.**

Look for the `get_api_reference` tool call in the output. If it's there, the answer came from the OpenUI5 API reference rather than the model's training data. If there is no tool call, ask again with an explicit instruction:

> *"Check the OpenUI5 API reference for `sap.m.Table` before answering."*

---

**Q: The agent made a change that broke the app. How do I roll back?**

If you are in a git repo (which all steps with a legacy app are), the simplest recovery is:

{% raw %}
```bash
git diff          # see what changed
git restore .     # undo unstaged changes to tracked files only
git status --short # inspect staged changes and untracked files that remain
```
{% endraw %}

In Step 4, the per-phase commits let you revert individual phases with `git revert`.

---

**Q: I want to try a different prompt than the one suggested in the step. Is that OK?**

Yes — the example prompts are starting points, not a fixed script. The goal is to get comfortable driving the agent yourself. Try variations, see what the agent does differently, and ask follow-up questions. The verify checklists at the end of each step are what matter, not the exact prompt you used to get there.

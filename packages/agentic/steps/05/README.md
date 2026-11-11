# Step 5: Create a Custom Control in TypeScript (optional) (20 min)

[← Previous: Step 4 — Modernize a legacy app](../04/README.md) | [Back to Overview](../../README.md)

In this step you build a **reusable custom control** in **TypeScript** that extends
`sap.ui.core.Control`, and drop it into the TypeScript products app from Step 3. A custom
control is the right tool when no standard control fits: you own the metadata (properties,
aggregations, events), the rendering, and the behavior. As always, you *drive* a grounded agent —
Claude Code consults the OpenUI5 API reference for `sap.ui.core.Control` and the `RenderManager`, and
the best-practice guidelines, so the control is typed end-to-end, CSP-safe, accessible, and uses the
modern renderer API.

The control you'll build is a **`StockIndicator`** — a small visual badge that shows a product's
stock level and turns red when stock falls below a threshold. It replaces the plain stock number in
the products table, making the "low stock" concept from Step 2 visible at a glance.

> 📝
> This step builds on the **TypeScript** products app from Step 3. If you did not complete
> it, point Claude Code at any TypeScript OpenUI5 application you have handy — or convert a JavaScript
> app first with `/ui5-typescript-conversion` (Step 3). The custom-control contract is the same;
> only this step's TypeScript specifics (typed metadata, the interface generator) assume a
> TypeScript project.

## 5.1 Ground the agent in custom-control development

Before writing any code, make sure the agent pulls the real control-development contract rather than
relying on memory:

> 💡
> **Task:** Ask Claude Code:
> ```
> Load the OpenUI5 guidelines and API reference for developing a custom control that extends
> `sap.ui.core.Control` in TypeScript. What are the required pieces, how is the metadata typed,
> and what does a modern renderer look like?
> ```
> (`get_guidelines`, `get_api_reference` for `sap/ui/core/Control` and `sap/ui/core/RenderManager`)

You should see it describe the building blocks, in their TypeScript form:

- an **ES class** — `export default class StockIndicator extends Control` with a `@namespace` JSDoc
  comment — rather than `Control.extend(...)`;
- a **`static readonly metadata`** object (typed with `MetadataOptions`) declaring `properties`,
  `aggregations`, `associations`, and `events`;
- a **`static renderer`** with **`apiVersion: 2`**, using the semantic `RenderManager` APIs
  (`openStart` / `class` / `style` / `openEnd` / `text` / `close`) instead of string concatenation;
- the **`@ui5/ts-interface-generator`**, which generates the typed getters/setters
  (`getValue()`/`setValue()`), the event methods (`attachPress`/`firePress`), and a settings
  interface into a `*.gen.d.ts` file so the rest of the app sees a fully typed control.

## 5.2 Scaffold the control

> 💡
> **Task:** Ask Claude Code:
> ```
> Create a custom control `ui5.tutorial.agentic.products.control.StockIndicator` in TypeScript
> under `webapp/control`. Give it three integer properties — `value` (default 0), `threshold`
> (default 50), and `maxValue` (default 100). Render a labelled bar whose width reflects
> `value / maxValue` and whose color turns red when `value` is below `threshold`. Use an ES class
> with a `@namespace` JSDoc, typed `static readonly metadata`, and a `static renderer` with
> `apiVersion: 2`. Then run the `@ui5/ts-interface-generator` so the typed accessors exist.
> ```

Things to check as it works:

- The module uses **`import` statements** (`import Control from "sap/ui/core/Control";`) and
  `export default class StockIndicator extends Control { ... }` — no `sap.ui.define`, no globals.
- `metadata` is a **`static readonly metadata`** object typed with
  `sap/ui/core/Element`'s `MetadataOptions`, with correct property types
  (`value: { type: "int", defaultValue: 0 }`).
- The `renderer` is a **`static renderer` with `apiVersion: 2`**; its `render(rm: RenderManager,
  control: StockIndicator)` uses `rm.openStart("div", control)`, `rm.class(...)`, `rm.style(...)`,
  `rm.openEnd()`, `rm.text(...)`, and `rm.close("div")` — **no** `rm.write("<div ...>")` string
  building (the deprecated `apiVersion: 1` style).
- A generated **`StockIndicator.gen.d.ts`** appears (the interface generator declares the typed
  getters/setters and event methods). Make sure it is run via
  `npx @ui5/ts-interface-generator --watch` (or a one-off run) so `getValue()` etc. type-check.

## 5.3 Make it accessible and interactive

A custom control is only best-practice if it is accessible. Add a typed press event and ARIA output:

> 💡
> **Task:** Ask Claude Code:
> ```
> Add a `press` event to the control, make the root element focusable, and render the appropriate
> ARIA attributes (`role`, `aria-label`, and `aria-valuenow` / `aria-valuemin` / `aria-valuemax`)
> via the RenderManager's accessibility API. Fire `press` on click and on Enter/Space, and use the
> generated `StockIndicator$PressEvent` type for handlers.
> ```

Review against the guidelines: accessibility attributes should be written with
`rm.accessibilityState(control, { ... })` rather than hand-written `aria-*` strings, keyboard
handling should go through the control's event delegate (e.g. `onkeydown`) rather than inline DOM
listeners, and the event should be declared in `metadata.events` so the generator produces a typed
`StockIndicator$PressEvent`.

## 5.4 Use the control in the products table

> 💡
> **Task:** Ask Claude Code:
> ```
> In the products view, replace the plain stock column cell with the `StockIndicator`, binding
> its `value` to the product's stock and setting `threshold` to 50. Declare the control's namespace
> in the XML view.
> ```

Confirm:

- The view declares the namespace, e.g. `xmlns:c="ui5.tutorial.agentic.products.control"`, and uses `<c:StockIndicator ... />`.
- `value` is bound (`value="{stock}"`), and the indicator turns red for products below the
  threshold when you run the app.

## 5.5 Style the control

> 💡
> **Task:** Ask Claude Code:
> ```
> Add a CSS file for the control and make sure the app loads it (e.g. register it in `manifest.json` under
> `sap.ui5/resources/css`, or load it via the imported `sap/ui/dom/includeStylesheet` module), so the bar and its states are themed.
> ```

The agent should add a stylesheet with classes that match the ones emitted by the renderer (e.g.
`.ui5TutorialAgenticProductsStockIndicator`, `.ui5TutorialAgenticProductsStockIndicatorLow`) rather than inline styles, so the
control is themeable and CSP-compliant.

## Verify

- [ ] `npx tsc --noEmit` passes — the control and its usages are fully typed (the generated
      `*.gen.d.ts` is present).
- [ ] The `StockIndicator` renders in the products table and turns red below the threshold.
- [ ] The renderer uses **`apiVersion: 2`** and the semantic `RenderManager` APIs (no
      `rm.write(...)` string building).
- [ ] The control exposes ARIA attributes and is keyboard-operable (`press` fires on Enter/Space).
- [ ] The UI5 linter is clean on the new control:
      *"Run the UI5 linter on the app and report the findings."* (`run_ui5_linter`)

## Summary

You built a reusable, accessible, CSP-safe custom control **in TypeScript** — typed end-to-end via
the interface generator, with a modern `apiVersion: 2` renderer — by driving a grounded agent
through the full control-development contract and verifying the result with `tsc` and the UI5
linter. Together with the earlier steps, you've now seen Claude Code and the UI5 plugin across
the whole lifecycle: **create**, **convert**, **modernize**, and **extend**.

***

**Previous:** [Step 4: Modernize a Legacy OpenUI5 Project](../04/README.md)

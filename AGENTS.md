# Repository Guide for AI Agents

This repository ships six OpenUI5 tutorials rendered as a GitHub Pages site with a client-side JavaScript / TypeScript language toggle. In the five code-bearing tutorials, every step is a self-contained, runnable UI5 app under `packages/<tutorial>/steps/NN/`. The sixth, `agentic`, is documentation-only: its steps are task-driven exercises, not runnable apps (see the `packages/agentic/` entry and the `steps.json` `sources` flag below). This document tells an agent enough about the layout, the toolchain, and the authoring conventions to be useful without re-deriving everything from source.

## Layout

- `packages/quickstart/` — 3 introductory steps.
- `packages/walkthrough/` — 38 steps; the canonical reference for content shape and toolchain.
- `packages/databinding/` — 15 steps on data binding (JSON & resource models, property/two-way/one-way/aggregation/element/expression binding, formatters, data types, validation).
- `packages/navigation/` — 17 steps on routing and navigation.
- `packages/odatav4/` — 11 steps on OData V4.
- `packages/agentic/` — 5 steps on agentic UI5 development with Claude Code CLI and the UI5 plugin.
- `packages/<pkg>/README.md` — the tutorial's overview and step index.
- `packages/<pkg>/steps.json` — machine-readable index of the tutorial's steps (`n`, `id`, `title`, `description`, and — for code-bearing tutorials — `previewUrl`, `zipTs`, `zipJs`). A top-level `"sources": false` marks a **documentation-only** tutorial (currently only `agentic`): the builder ([tools/builder/prepare-gh-pages.js](tools/builder/prepare-gh-pages.js)) treats `sources !== false` as "has sources", so `false` makes it skip `ui5 build`, ZIP packaging, and TS→JS transpilation for that tutorial, and its steps carry no `previewUrl`/`zipTs`/`zipJs`. Preserve this flag when editing the file — keep `"sources": false` on `agentic`, and do not add it to a tutorial that ships runnable code. Regenerate with `node _/generate-steps-index.js` after adding, removing, or renaming steps.
- `packages/<pkg>/steps/NN/` — in a code-bearing tutorial, one runnable app per step: `README.md`, `webapp/`, `package.json`, `ui5.yaml`, and (for TS steps) `tsconfig.json`. In the documentation-only `agentic` tutorial a step is just a `README.md` (plus optional `apps/` starter code and `assets/`) — no `webapp/`, `package.json`, or `ui5.yaml`.
- `assets/` — CSS and JS that power the site (language toggle, code-couple tab container, `.ts/.js` extension substitution). Ships as-is to `dist/`.
- `tools/builder/` — build orchestrator (`node tools/builder`) that produces `dist/` for GitHub Pages: transpiles TS steps to JS, packages ZIP downloads, renders READMEs.
- `tools/dev-server/` — dev server (`npm start`) that mirrors the built site with live reload.
- `_/` — **gitignored** folder for one-off migration and maintenance scripts. Add throwaway tooling here; do not check it in as permanent tooling.
- `_includes/head-custom.html` — Jekyll partial that injects `assets/css/custom.css` and `assets/js/custom.js` into every GitHub Pages README render.
- `dist/` — build output, gitignored.

## Running the code

The repo is an npm workspaces monorepo. Each code-bearing `packages/*/steps/*` (one that has a `package.json`) is a workspace. The documentation-only `agentic` steps have no `package.json`, so they are not workspaces — `npm start -w …` does not apply to them.

```sh
# one-time
npm install

# build every tutorial step + assemble dist/
npm run build

# preview the rendered site with working local live-preview links
npm start          # http://localhost:1337/packages/walkthrough/

# run one step directly
npm start -w ui5.tutorial.walkthrough.step07
npm start -w ui5.tutorial.odatav4.step03
# etc.

# typecheck every TypeScript step
npm run typecheck
```

Rely on `npm start -w <workspace>` when you need to see a specific step in a browser — the root dev server is heavier and only needed for site-level checks.

## Tutorial namespace and package naming

All tutorials share one convention:

- App namespace: `ui5.tutorial.<pkg>` (used in `manifest.json` `sap.app.id`, `Controller` names, XML `controllerName`, `index.html` resource-roots, and JSDoc `@namespace`).
- Per-step `package.json` name: `ui5.tutorial.<pkg>.stepNN` (zero-padded).
- `ui5.yaml` `metadata.name`: `ui5.tutorial.<pkg>`.
- tsconfig `paths`: `"ui5/tutorial/<pkg>/*": ["./webapp/*"]`.

If you touch any of these, keep the naming aligned across the file set.

## Step README authoring conventions

Step READMEs are markdown rendered through GitHub Pages + a small client-side runtime in [assets/js/custom.js](assets/js/custom.js). Three conventions matter:

1. **Language-specific prose blocks.** Wrap TS-only content in `<details class="ts-only" markdown="1">…</details>` (mirror for `js-only`). The runtime converts these to `<section>` elements and CSS hides the inactive one. This is for *block-level* prose only — for a paired inline TS/JS link (e.g. a download-solution link), use `<span>` instead (see point 5).
2. **Adjacent ts/js code fences.** Write the TypeScript snippet in a `` ```ts `` fence and the JavaScript snippet in a `` ```js `` fence directly below (only whitespace between them). The runtime wraps the pair in a tabbed container.
3. **First-line path comments.** Every ts/js fence pair whose content is real source code must start with a `// path/to/File.ts` comment on line 1 (mirror `.js`). This is what tells a human reader — and an AI indexing the corpus — which file the snippet belongs to. For XML fences use `<!-- path -->`; for INI/properties use `# path`.
4. **File extensions in prose and headings.** Write `.ts/.js` where the current language should substitute. The runtime renders it as `.ts` in TS mode or `.js` in JS mode. Do not use the older `.?s` token — it was retired.
5. **Inline TS/JS link pairs.** For a paired link that differs only by language (the canonical case is the download-solution link), write two adjacent `<span class="ts-only">…</span><span class="js-only">…</span>` with the language tokens `(TS)` and `(JS)` inside a nested `<span class="lang-suffix">` so both variants read plainly in raw markdown while the rendered site shows only one. See any tutorial-overview README for the current shape:

   ```md
   <span class="ts-only">[📥 Download Solution](…step-NN.zip)<span class="lang-suffix"> (TS)</span></span><span class="js-only">[📥 Download Solution](…step-NN-js.zip)<span class="lang-suffix"> (JS)</span></span>
   ```

   `<span>` is inline — do **not** add `markdown="1"` (that attribute is for block-level elements). The CSS in [assets/css/custom.css](assets/css/custom.css) hides `.ts-only` / `.js-only` on any element based on the active language, and `.lang-suffix { display: none }` drops the `(TS)` / `(JS)` marker on the rendered side.

Full author docs are in [CONTRIBUTING.md](CONTRIBUTING.md).

Other conventions:

- Callouts use `> :note:`, `> :tip:`, `> :info:` (custom syntax, not GitHub's `[!NOTE]` alerts).
- Step navigation footer: a single `***` separator, then `**Next:** [Step N+1: <title>](../<NN+1>/README.md)` and `**Previous:** [Step N-1: <title>](../<NN-1>/README.md)`. When a step also has a **Related Information** section, the order is Next/Previous first, then another `***`, then `**Related Information**` (matches all five tutorials). The first step has no `**Previous:**`; the last step has no `**Next:**`. The link display text must match the target step's actual title.
- Preview images: descriptive `alt` text (no bare `![](…)`), optional `"title"` for the hover tooltip.
- Do not add `<!-- loio… -->` markers or `<a name="loio…"/>` anchors — those are SAP-internal SDK artifacts.

## Using the tutorials as a source for generated code

The steps are *pedagogical*, not *canonical*. Step 01 of each tutorial is deliberately incomplete — it exists to introduce one concept at a time. If a user asks you to scaffold a new UI5 app or generate a snippet, anchor on the **last** step of the relevant tutorial, not the first.

- **New freestyle UI5 app** → copy the shape of [packages/walkthrough/steps/38/](packages/walkthrough/steps/38/). It has the complete `manifest.json`, `Component`, router setup, i18n, tests, and `ui5.yaml` for a production build. Steps 01–09 omit the Component; steps 10–29 omit routing; earlier steps omit tests.
- **Routing / navigation questions** → [packages/navigation/steps/17/](packages/navigation/steps/17/) is the full picture. Walkthrough steps 30–32 are a routing subset (single-page → detail flow) and will mislead if the user needs deep-linking, unmatched routes, or target lifecycle.
- **OData V4** → [packages/odatav4/steps/11/](packages/odatav4/steps/11/) covers CRUD, batch groups, operations, list-detail, and `:n` navigation. **The tutorial's data layer is a mock server simulating TripPin — do not cargo-cult `webapp/localService/` into an answer about connecting to a real backend.** Point the user at a real OData destination and keep only the model/binding code from the tutorial.
- **First-15-minutes demo, not a project starter** → [packages/quickstart/](packages/quickstart/) is 3 steps and stops before Component/manifest wiring. Use it to *show* UI5, not to *scaffold* from.
- **Agentic UI5 development** → [packages/agentic/](packages/agentic/) covers using Claude Code CLI with the UI5 plugin to create, convert, modernize, and extend OpenUI5 apps. **The tutorial steps are task-driven exercises, not self-contained runnable apps.** Do not reference its steps as code examples for UI5 patterns; use the other tutorials for that.
- **Tooling handshake** ([npm install](packages/walkthrough/steps/01/README.md), `ui5 init`, `ui5 use OpenUI5`, `ui5 add sap.ui.core themelib_sap_horizon`, `tsconfig.json`) — always take these from [walkthrough/steps/01](packages/walkthrough/steps/01/README.md) + [walkthrough/steps/02](packages/walkthrough/steps/02/README.md). They are the only steps that document setup from scratch.

Out of scope for this repo — do not invent code claiming these are covered here: Fiori elements, BTP / Cloud Foundry / ABAP deployment, `easy-ui5` / `generator-ui5-*` scaffolding, CI setup, real authentication. (`packages/agentic/steps/02` includes a CAP mock service as a local data source; that is the only place CAP appears and it is not a CAP tutorial.)

### Reading the markdown correctly

When ingesting a step README, treat these as semantic — not decorative — markers:

- Any element carrying the class `ts-only` or `js-only` — most often `<details class="ts-only" markdown="1">` for prose blocks or `<span class="ts-only">` for inline link pairs — is the JS/TS switch. In raw markdown both variants are present; filter by class before quoting, or you will emit TS content in a JS answer (or vice versa).
- Adjacent `` ```ts `` and `` ```js `` fences are the *same file* in two languages, not two different files. The first-line path comment inside each fence is authoritative for which file it is.
- The literal string `.ts/.js` in prose is a runtime substitution token, not a filename. Resolve it to `.ts` or `.js` based on the language you are generating for.
- The `(TS)` / `(JS)` marker inside a `<span class="lang-suffix">` is a raw-markdown readability aid; it is hidden on the rendered site. Do not treat it as part of the visible link text when you quote a snippet.

## Propagation rules — changes are almost never local

Tutorials in this repo are cumulative: step `NN+1` is built on top of step `NN`'s files. That makes almost every "small" change ripple. Before you consider a task done, check whether one of these applies:

- **Editing a step's code or `README.md`** → the same change must be reflected in **every subsequent step of that tutorial** where the affected file still exists. If you rename `Foo.controller.ts` in step 10, steps 11–38 that carry `Foo.controller.ts` forward need the same rename. If you fix a bug in a snippet in step 15's README, later steps that quote or re-show that snippet need the same fix. Never leave the corpus in a state where the "diff between consecutive steps" contains changes the step's prose does not explain.
- **Editing an authoring convention** (fence syntax, callout syntax, path-comment format, `<details>` class names, step-footer shape, namespace pattern) → every existing step README and every AI-facing doc that describes the convention must be updated in the same change. Specifically: this file (`AGENTS.md`), [CONTRIBUTING.md](CONTRIBUTING.md), and any `README.md` under `packages/*/` that references the convention. A convention that is only half-migrated is worse than no convention.
- **Renaming, adding, or removing a step** → update `packages/<pkg>/README.md` (the step index prose), regenerate `packages/<pkg>/steps.json` via `node _/generate-steps-index.js`, fix the `**Next:** / **Previous:**` footer links in the neighboring steps, and re-check any cross-tutorial link that points at the old step number.
- **Editing repo-shape guidance for AI** (this file, the root [README.md](README.md), [CONTRIBUTING.md](CONTRIBUTING.md), a `packages/*/README.md`) → if the same fact is stated in more than one of these, update all of them in one commit. Divergence between AI docs and human docs is the failure mode most likely to mislead a future agent.

Verify a rippling change with `git grep` before *and* after — the count of matches should change in a way you can explain. A cumulative-tutorial change that only touches one step is almost always incomplete.

## When something needs to change across many files

- One-off scripts go under `_/` (gitignored). Match the pattern of the migration scripts already there (`migrate-*.js`, `promote-*.js`, `add-*.js`) — small Node scripts, no dependencies, walk the tree with `fs.readdirSync`.
- Design scripts to be **idempotent**: re-running on already-migrated content should produce zero changes. This lets you split large migrations into review-and-apply passes.
- For content-shape changes that ripple across all five packages, verify with grep before and after (`git grep`) and touch one canary file first (usually [packages/walkthrough/steps/09/README.md](packages/walkthrough/steps/09/README.md) — it exercises every convention).

## Verification

- **Static:** `npm run typecheck` for TS integrity, `git grep` for corpus-wide cleanliness.
- **Rendered:** `npm start`, then load a step README in the browser (e.g. `http://localhost:1337/packages/walkthrough/steps/09/README.md`). Toggle the TS/JS button and confirm both languages render correctly.
- **Built:** `npm run build`, then `open dist/walkthrough/build/09/index-cdn.html` for the built app, or `dist/walkthrough/steps/09/README.html` for the built README.

## Deploy

GitHub Pages runs the `.github/workflows/deploy.yml` workflow: `npm ci` → `node tools/builder` → publish `dist/`. Jekyll is enabled on the artifact so `_includes/head-custom.html` and the front-matter emitted by `tools/builder/prepare-gh-pages.js` take effect.

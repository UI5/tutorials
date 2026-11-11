# Contributing to OpenUI5 Sample App

In general the contributing guidelines of OpenUI5 also apply to this project. They can be found here:  
https://github.com/UI5/openui5/blob/main/CONTRIBUTING.md

Some parts might not be relevant for this project (e.g. the browser-specific requirements like jQuery, CSS and accessibility in the "Contribution Content Guidelines") and the contribution process is easier (pull requests will be merged directly on GitHub).

## Requirements

Running the content of this repository locally (as opposed to following the tutorial steps) requires a [Node.js](https://nodejs.org/) version  >= `20.11.0` to be installed.

## Download and Installation

> This section describes how to run the content of the repository locally and is *not* required for following the tutorial. For following the tutorial, simply start with Step 1 in the list of steps above. From there, you can also download and run the result of each step locally.

The project is set up as monorepo. All steps are located inside the `steps` folder and labelled with their step number. The monorepo uses `npm` workspaces to manage the steps of the code-bearing tutorials together, and you can also run `npm` inside each individual step. (The Agentic Development tutorial is documentation-only — its steps are READMEs, not workspace packages, so the commands below do not apply to it.)

To set up the monorepo you first need to install all depenedencies:

```sh
npm install
```

To run any step, just execute one of the scripts from `package.json` via npm, e.g.:

```sh
# Option 1: use workspace command to start the step
npm start -w ui5.walkthrough.step01

# Option 2: change to the folder of the step and start it
cd steps/01 
npm start
```

## Documentation for Tutorial Authors

### General

The setup of this project allows maintaining *one* tutorial text that covers both JavaScript and TypeScript with minimal overhead and without duplication of content.

Readers of the tutorial can freely switch the programming language of code snippets or the entire page, once deployed on GitHub Pages. For tutorial authors, an integrated dev server allows previewing the result with the same functionality locally and instantly.

Main features of the two-language support are:
1. Content meant only for *one* of the programming languages can be hidden in the other by enclosing it in a specific block.
2. Two adjacent code sections in different languages are automatically converted to a tab container which allows switching between languages.
3. File extensions writen as `.ts/.js` appear automatically as `.js` or `.ts` depending on the current language.

### Limitations

Feature 3 above (`.ts/.js` extension substitution) does not apply inside code blocks. That is intentional: inside a code fence the fence itself already carries the language, and each ts/js fence pair also starts with a first-line path comment naming the concrete file (see *Path comments in code fences* below). No further substitution is needed there.


### Running the preview/dev server

To immediately preview the markdown document you are writing *including* the two-language magic, simply run

```sh
npm i
```

in the root folder of this project once for the setup.

Then, to actually start the server, run

```sh
npm start
```

A browser window will automatically open (on port 3000 or the next free port) and automatically reload on every saved change.


### Writing *one* document which covers both JavaScript and TypeScript without duplication

The following features help providing language-specific content without duplication of other content. 

#### 1. Language-specific Blocks of Content

When a certain part of the tutorial content (can be explanation and/or code) is only relevant for *one* of the languages (JavaScript *or* TypeScript), then enclose it within the following tags. The CSS class decides for which language it is meant!

TypeScript-only:

```html
<details class="ts-only" markdown="1"><summary>This section is relevant for TypeScript only</summary>
...here comes the TS-only text...
</details>
```

JavaScript-only:

```html
<details class="js-only" markdown="1"><summary>This section is relevant for JavaScript only</summary>
...here comes the JS-only text...
</details>
```

The `markdown="1"` part is required for markdown parsing within HTML and the `<summary>` is helpful for readers of the raw markdown view, so please use the tag structure as-is, with your actual content in between.

##### Resulting Appearance<span class="hidden"> in markdown view (not in the final page)</span>

<details class="ts-only" markdown="1"><summary>This section is relevant for TypeScript only</summary>
...here comes the TS-only text...
</details>

<details class="js-only" markdown="1"><summary>This section is relevant for JavaScript only</summary>
...here comes the JS-only text...
</details>


#### 1a. Inline TS/JS link pairs (`<span>`)

The `<details>` pattern above is for *block-level* content (a paragraph, a list, a code block). For a paired inline element that differs only by language — the canonical case is the download-solution link — use adjacent `<span>` tags instead:

```md
<span class="ts-only">[📥 Download Solution](…step-NN.zip)<span class="lang-suffix"> (TS)</span></span><span class="js-only">[📥 Download Solution](…step-NN-js.zip)<span class="lang-suffix"> (JS)</span></span>
```

Rules:

- `<span>` is inline; do **not** add `markdown="1"` (that attribute is only meaningful on block-level HTML).
- The nested `<span class="lang-suffix"> (TS)</span>` / `<span class="lang-suffix"> (JS)</span>` sits *outside* the markdown link (`](…)`) but *inside* the outer `.ts-only` / `.js-only` span. Placing the suffix outside the link text avoids nested-HTML-in-link-text quirks with both kramdown (GitHub Pages) and showdown (dev server).
- The CSS in [assets/css/custom.css](assets/css/custom.css) hides `.ts-only` / `.js-only` on any element based on the active language, and `.lang-suffix { display: none }` drops the `(TS)` / `(JS)` marker on the rendered site. Result: both links visible in raw markdown with distinct labels; only one visible on the rendered site, without the language suffix.

##### Resulting Appearance<span class="hidden"> in markdown view (both links visible; on the rendered site only the current-language one shows and without the (TS)/(JS) suffix)</span>

<span class="ts-only">[📥 Download Solution](…step-NN.zip)<span class="lang-suffix"> (TS)</span></span><span class="js-only">[📥 Download Solution](…step-NN-js.zip)<span class="lang-suffix"> (JS)</span></span>


#### 2. Switchable code blocks in both languages

When a piece of code should be displayed in either JS or TS, whatever is current, then simply create two adjacent markdown-fenced code blocks. They are automatically recognized as language-specific alternatives.

Example:
```md

    ```js
    const i = 0;
    ```

    ```ts
    const i: number = 0;
    ```
```
> Do not indent, this was only done to make the backticks within the code block visible.

> Some places where this occurs may not be properly recognized, so make sure to test it.

##### Resulting Appearance<span class="hidden"> in markdown view (here in markdown you still see BOTH and no tab container; the magic only happens in the dev server and in GitHub Pages)</span>

```js
const i = 0;
```

```ts
const i: number = 0;
```

##### Path comments in code fences

Every adjacent ts/js code-fence pair whose content is real source code should start with a first-line comment naming the concrete file. This makes the raw markdown legible to readers and to AI tools that index snippets independently of surrounding headings — each fence carries the filename it belongs to, without duplicating the surrounding prose.

Use the comment syntax that matches the fence language:

```md

    ```ts
    // webapp/controller/App.controller.ts
    …
    ```

    ```js
    // webapp/controller/App.controller.js
    …
    ```
```

For other fence languages that appear as ts/js pairs elsewhere: `<!-- path -->` for `xml` / `html`, `# path` for `ini` / `properties`. Fences used for folder-tree diagrams (`text` or unlabeled) are exempt.

#### 3. File Extensions (`.js/.ts`)

When the text or a section heading mentions the name of a file that will be JavaScript or TypeScript, depending on the language, then use the file extension `.\ts\/\.js`. It will automatically be switched to the current language.

Example:
```md
In this step you create the file `Example.controller.\ts\/\.js`.
```

##### Resulting Appearance<span class="hidden"> in markdown view (here the extension is not replaced, the replacement only happens in the dev server and in GitHub Pages)</span>

In this step you create the file `Example.controller.ts/.js`.

### Converting the JS Code to TypeScript

TODO: tool support for this functionality does not exist yet. It can, however, already be done manually.

General approach: develop the tutorial in TS and use the debug version of the transpilation result as JS code.

To clean up the transpilation result, search for and remove content containing the following in the transpiled JS code:

### `_interopRequireDefault`

Looks like this:

```js
sap.ui.define(["./BaseController"], function (__BaseController) {

  function _interopRequireDefault(obj) {
    return obj && obj.__esModule && typeof obj.default !== "undefined" ? obj.default : obj;
  }
  const BaseController = _interopRequireDefault(__BaseController);
```

Remove the function definition and the line calling the function. Rename the dependency in the `sap.ui.define` call from `__BaseController` to `BaseController`.

## Contributing with AI-generated code
As artificial intelligence evolves, AI-generated code is becoming valuable for many software projects, including open-source initiatives. While we recognize the potential benefits of incorporating AI-generated content into our open-source projects there are certain requirements that need to be reflected and adhered to when making contributions.

Please see our [guideline for AI-generated code contributions to SAP Open Source Software Projects](https://github.com/SAP/.github/blob/main/CONTRIBUTING_USING_GENAI.md) for these requirements.

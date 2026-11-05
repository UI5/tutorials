# UI5 Linter Tutorial

Learn how to use UI5 linter to modernize a legacy OpenUI5 app from start to finish. You'll run your first `ui5lint` report, auto-fix what you can, manually resolve the rest, and wire linting into your workflow so regressions never sneak back in.

## Description

You'll work with a simple Todo application that intentionally contains several legacy code patterns and modernize it step by step using [UI5 linter](https://github.com/UI5/linter).

> 📝
> This project **intentionally contains legacy code patterns** for educational purposes. Do not use this code as a reference for best practices!

[📥 Download the starting app](https://ui5.github.io/tutorials/linter/assets/linter-app.zip)

### Steps

- **[Step 1: Introduction & Setup](steps/01/README.md)** — Learn what UI5 linter is, install it, and get the demo project running locally.
- **[Step 2: Running UI5 Linter](steps/02/README.md)** — Run the linter for the first time, explore the findings in the legacy demo app, and use `--details` to dig into each issue.
- **[Step 3: Understanding Linter Rules](steps/03/README.md)** — Get to know the rule categories, understand which findings can be auto-fixed and which need manual attention, and learn why these patterns matter.
- **[Step 4: Auto-fixing Issues](steps/04/README.md)** — Run `ui5lint --fix`, inspect what changed with `git diff`, and learn why some fixes are blocked until you do a manual step first.
- **[Step 5: Manual Fixes](steps/05/README.md)** — Migrate the controller to `sap.ui.define()`, fix global variable access, replace deprecated themes and libraries, update the manifest version, resolve CSP violations, and migrate to the Test Starter concept.
- **[Step 6: Best Practices](steps/06/README.md)** — Wire UI5 linter into your development workflow and CI/CD pipeline so new issues get caught before they reach production.
- **[Step 7: Appendix](steps/07/README.md)** — Full reference table of all findings in the demo app, organized by file.

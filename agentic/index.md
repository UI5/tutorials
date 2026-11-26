---
title: OpenUI5 Tutorials
permalink: agentic/index.html
---

<div data-no-language-toggle hidden></div>

# Agentic Development Tutorial

In this tutorial you'll use **Claude Code** equipped with the **UI5 plugin for coding agents** as a productivity multiplier across the full lifecycle of a OpenUI5 project.

## Description

You will **create and enhance** a new OpenUI5 application, **convert** it to TypeScript, and **modernize** a legacy application — using an AI coding agent grounded in the official OpenUI5 API reference, the UI5 linter, and the best-practice guidelines.

The emphasis is not "let the AI do it" but **"drive the AI well"**: how UI5-specific tooling grounds the coding agent so its output is correct, current, and best-practice-compliant — and how you review and verify what it produces.

> **Your prompts, your pace.** Each step includes example prompts you can use directly or adapt as a starting point. Feel free to write your own prompts entirely. The goal is to get comfortable driving the agent yourself, not to copy-paste a fixed script.

## Requirements

- **Node.js** LTS (v22+) and **Git**.
- A **terminal** (macOS Terminal, iTerm2, Windows Terminal, or any shell).
- **Claude Code CLI** with a Pro, Max, Ultra, Team, or Enterprise claude.ai account (or a Console API key). GitHub Copilot CLI is also supported — adapt the plugin install command and launch command where needed.
- Basic familiarity with OpenUI5 concepts (views, controllers, models, manifest).

Any editor can be used alongside the terminal to inspect generated code, but all agent
interactions happen in the CLI.

## Steps

The tutorial consists of the following steps. To start, just open the first link — you'll be guided from there.

- **[Step 1: Getting Started — Claude Code & the UI5 Plugin](steps/01/index.html)** — Install Claude Code, add the UI5 plugin, and confirm the agent is grounded in the OpenUI5 API reference. (10 min)
- **[Step 2: Create & Enhance a New OpenUI5 Application in JavaScript](steps/02/index.html)** — Scaffold a OpenUI5 app wired to an OData V4 service, add a table, a detail form, i18n texts, and a formatter. (40 min)
- **[Step 3: Convert a JavaScript OpenUI5 Project to TypeScript](steps/03/index.html)** — Use the UI5 TypeScript conversion skill to migrate the app to TypeScript and fix remaining type errors. (30 min)
- **[Step 4: Modernize a Legacy OpenUI5 Project](steps/04/index.html)** — Run the phased UI5 Modernization workflow on a deliberately legacy app and verify each phase with the UI5 linter. (40 min)
- **[Step 5: Create a Custom Control in TypeScript (optional)](steps/05/index.html)** — Build a reusable, accessible, CSP-safe custom control with a typed metadata object and a modern `apiVersion: 2` renderer. (20 min)

## Support

If you get stuck, check the **[FAQ](FAQ.md)** — it covers the most common setup problems, plugin
issues, and agent behaviour questions for each step.

## License

Copyright (c) 2026 SAP SE or an SAP affiliate company. All rights reserved. This project is licensed under the Apache Software License, version 2.0 except as noted otherwise in the [LICENSE](https://github.com/UI5/tutorials/blob/-/LICENSE) file.

# Step 6: Best Practices

Now that the app is clean, let's make sure it stays that way. Wiring UI5 linter into your daily workflow and CI pipeline means issues get caught early, before they build up into another big migration.

## 6.1 Add Lint Scripts to `package.json`

Add convenience scripts so you and your team have a consistent way to run the UI5 linter:

```json
{
  "scripts": {
    "lint": "eslint webapp && ui5lint",
    "lint:fix": "ui5lint --fix"
  }
}
```

Then run them with:

```bash
npm run lint       # check for issues
npm run lint:fix   # auto-fix what's possible
```

## 6.2 Integrate into CI/CD

Add a lint step to your CI pipeline to block merges that introduce new findings. Use the `lint` npm script rather than calling `ui5lint` directly. This keeps the UI5 linter version pinned via `package-lock.json` and avoids needing a global install in the CI environment.

For example, in a [GitHub Actions](https://docs.github.com/en/actions) workflow:

```yaml
- name: Run linter checks
  run: npm run lint
```

## 6.3 Key Takeaways

1. **Run the UI5 linter often.** Catching one issue early is easier than untangling ten later.
2. **Review autofix diffs before committing.** Autofixes are safe, but it's good practice to understand every change.
3. **Fix the most impactful issues first.** Deprecated APIs that are scheduled for removal deserve priority over warnings.
4. **Work incrementally.** Trying to fix everything in one shot is a recipe for merge conflicts and broken tests.
5. **Always test after changes.** The UI5 linter checks code quality, not behavior. A clean UI5 linter output doesn't mean nothing broke.

## 6.4 Resources

- [UI5 linter GitHub](https://github.com/UI5/linter)
- [UI5 linter Rules Documentation](https://github.com/UI5/linter/blob/main/docs/Rules.md)
- [UI5 Deprecation Information](https://ui5.sap.com/#/api/deprecated)
- [UI5 Best Practices](https://ui5.sap.com/#/topic/28fcd55b04654977b63dacbee0552712)

## 6.5 Next Steps: Coding Agents

Want to automate the kind of work you just did? The [**UI5 Modernization Plugin**](https://github.com/UI5/plugins-coding-agents/blob/main/plugins/ui5-modernization/README.md) is a coding-agent toolkit that builds on UI5 linter and orchestrates a five-phase modernization with per-phase verification and commits. Learn more in the [SAP Community blog post](https://community.sap.com/t5/technology-blog-posts-by-sap/introducing-the-ui5-modernization-plugin-modernize-your-openui5-sapui5-app/ba-p/14428191).

***

**Next:** [Step 7: Appendix](../07/README.md)

**Previous:** [Step 5: Manual Fixes](../05/README.md)

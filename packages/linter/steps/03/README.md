# Step 3: Understanding UI5 Linter Rules

## 3.1 Rule Categories

UI5 linter rules fall into a few groups. Some rules support **autofix**, meaning the UI5 linter can rewrite the code for you. Others require a manual change because the transformation is too complex or carries a risk of breaking something.

**Autofixes are intentionally conservative.** The UI5 linter only applies changes that are well-defined and safe, so you can commit with confidence.

### Code Quality Rules

| Rule | Description | Auto-fixable |
|------|-------------|--------------|
| `no-deprecated-api` | Deprecated UI5 APIs | Partially |
| `no-globals` | Global variable usage | Partially |
| `no-pseudo-modules` | Pseudo module imports | No |

### Manifest Rules

| Rule | Description | Auto-fixable |
|------|-------------|--------------|
| `no-deprecated-library` | Deprecated library dependencies | No |
| `no-outdated-manifest-version` | Old manifest version format | No |
| `no-removed-manifest-property` | Manifest properties removed in newer versions | No |

### XML View Rules

| Rule | Description | Auto-fixable |
|------|-------------|--------------|
| `no-ambiguous-event-handler` | Ambiguous event handler names | Yes |

The full list of rules and their details lives in the documentation:
- [UI5 linter: Rules Documentation](https://github.com/UI5/linter/blob/main/docs/Rules.md)
- [UI5 linter: Scope of Autofix Documentation](https://github.com/UI5/linter/blob/main/docs/Scope-of-Autofix.md)

## 3.2 Why These Rules Matter

- **Deprecated APIs and global variables** will be removed in a future major OpenUI5 version, so apps that use them will eventually break.
- **Sync loading** blocks the browser, hurts performance, and can cause problems with strict Content Security Policies.
- **Deprecated libraries** no longer receive updates and will be removed in a future major OpenUI5 version.

***

**Next:** [Step 4: Auto-fixing Issues](../04/README.md)

**Previous:** [Step 2: Running UI5 Linter](../02/README.md)

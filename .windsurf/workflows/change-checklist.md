---
description: Make safe, surgical changes in the baseplate-mono workspace
---

# Change Checklist

Use this workflow when modifying `baseplate-mono`.

1. Confirm the affected workspace and public contract from `Spec.md`.

2. Make the smallest necessary edit in the correct workspace:

- App behavior belongs in `apps/*`.
- Reusable UI belongs in `packages/ui`.
- Shared configuration belongs in `packages/eslint-config` or `packages/typescript-config`.
- Shared domain or API types should use `packages/types` only when the task requires that boundary.

3. Preserve existing public APIs unless the user explicitly requested a breaking change.

4. Do not add tests, dependencies, tooling, routes, packages, or files unless the task requires them.

5. Run the narrowest relevant validation first:

```sh
bun run check-types
```

6. If the change affects build output or workspace task wiring, also run:

```sh
bun run build
```

7. Update `Spec.md` only when the change affects architecture, commands, contracts, file ownership, constraints, or open questions.

8. Summarize changed files, validation results, and any deferred risks.

---
description: Orient an LLM in the baseplate-mono workspace before making changes
---

# Monorepo Orientation

Use this workflow before implementing non-trivial changes in `baseplate-mono`.

1. Read `Spec.md` at the repository root and treat it as the source of truth for architecture, boundaries, commands, and open questions.

2. Inspect the root workspace metadata:

```sh
bun --version
bun run check-types
```

3. Read the root files that define workspace behavior:

- `package.json`
- `turbo.json`
- `README.md`

4. Identify the affected workspace before editing:

- `apps/web` for Vite + React frontend changes (local components live in `apps/web/src/components`).
- `apps/api` for Bun + Hono backend changes.
- `packages/ui` for shared React components.
- `packages/eslint-config` for shared lint configuration.
- `packages/typescript-config` for shared TypeScript configuration.
- `packages/types` for future shared domain or API types.

5. Read the relevant package manifest and TypeScript config for the affected workspace.

6. Read the smallest set of source files needed to understand the requested change.

7. If `Spec.md` conflicts with the live code or user request, stop and ask for clarification before editing.

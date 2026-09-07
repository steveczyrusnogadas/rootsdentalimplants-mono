# Modular scaffolding and agency reuse: recommendations for Baseplate

Research date: 2026-09-07. Scope: official documentation and pinned public source, read-only research; no generator execution, deployment, or benchmark. Recommendations below are proposals, not implemented capabilities. Original research snapshot: `4970a6dd0da2dad81e5541c8915ce3d017e50420`. Integration status was reconciled against cleanup baseline `21f384d`; upstream findings remain the original read-only research. See the [cleanup report](../reports/agency-foundation-cleanup.md) for implemented capabilities and verification limits.

## Recommendation

Build a small, opinionated project factory around Baseplate: three validated presets, a recorded selection manifest, independent client repositories, and explicit deployment recipes. Start by generating a new project correctly. Introduce automated feature addition only after the corresponding seams have worked in real customized projects.

The useful patterns are complementary: Better-T-Stack demonstrates composition and selection validation; shadcn demonstrates distributing editable source with dependency metadata and previews; create-t3-turbo demonstrates workspace boundaries and small package generators; Astro demonstrates how little infrastructure a content site can need. None of the inspected workflows establishes a complete agency process from business research through client handoff and ongoing migrations. That last statement is a scoped finding from the inspected documentation and source, not a claim about every product in their ecosystems.

For Davao City client work, select by operating need: a services site with phone/contact links, a publishing site whose staff manage Blog posts, or an authenticated operations dashboard. Do not make clients choose an ORM, router, queue, and hosting provider before they can describe what they need.

## Baseplate constraints

The local [public app configuration](../../apps/web/vite.config.ts) uses TanStack Start with a Bun Nitro target; [its package manifest](../../apps/web/package.json) includes a production server command. The [root README](../../README.md) now describes that SSR runtime correctly. Its earlier SPA/static-nginx description belonged to the original research snapshot and was corrected during integration.

Isolation, coordinated local ports/cookies, app-owned UI, direct typechecks, and the repository workflow skill have now been integrated and tested as described in the cleanup report. No project generator or general add-feature CLI exists. Preserve the [domain glossary](../../CONTEXT.md): Assistant means the optional signed-in admin interface; public visitor chat is a separate capability.

[ADR 0005](../adr/0005-app-owned-presentation.md) now supersedes the cross-app presentation-sharing part of [ADR 0004](../adr/0004-shadcn-new-york-style.md). It preserves useful primitive conventions while giving each app independent presentation ownership. The earlier ADR conflict identified by this research is therefore resolved in the integrated code.

## Focused comparison

| Approach                | Observed unit of reuse                        | Best lesson for Baseplate                                   | Boundary                                                                                      |
| ----------------------- | --------------------------------------------- | ----------------------------------------------------------- | --------------------------------------------------------------------------------------------- |
| create-t3-turbo         | Whole starter and workspace package scaffold  | Clear app/package ownership; small generators               | Framework choice partly means deleting unwanted apps; no agency feature lifecycle established |
| Better-T-Stack          | Validated stack selections, templates, addons | Resolve one input into a reproducible project configuration | Its add command has narrower scope than changing an existing app's architecture               |
| shadcn                  | Editable source items, dependencies, presets  | Local ownership, explicit additions, inspectable changes    | Copying source does not provide semantic merging or database migrations                       |
| Astro official starters | Complete site template plus integrations      | Static content sites can omit API/database/admin entirely   | File-based blog starter is not a staff-operated CMS                                           |

These are pattern references, not a recommendation to replace Baseplate with any one starter. Supporting observations and exact sources follow.

### create-t3-turbo: copy a coherent workspace, then customize

The starter is initialized from a repository template or `create-turbo -e`. Its README includes Next.js, TanStack Start, and Expo and instructs users to delete the unwanted web app before setup. It offers `ui-add`, a package generator, and Vercel/Expo deployment guidance. This is useful monorepo organization, but not a business-preset selector or Dokploy agency deployment recipe. [Pinned README](https://github.com/t3-oss/create-t3-turbo/blob/8f945b7bb3bfb3ca8358d48b1ff0214079bc11ee/README.md).

The package generator creates ESLint, package, TypeScript, and entrypoint files, resolves requested dependency versions from npm, then installs and formats. Its scope is a new package, not wiring Blog posts, authentication, storage, and deployment into customized apps. Copy the small generator boundary, but pin Baseplate's tested dependencies rather than dynamically resolving every dependency to latest. [Pinned generator](https://github.com/t3-oss/create-t3-turbo/blob/8f945b7bb3bfb3ca8358d48b1ff0214079bc11ee/turbo/generators/config.ts).

### Astro: presets can be much smaller than a full application

`create astro --template` accepts official examples or a GitHub repository. This gives a direct mechanism for agency-owned starting points without creating a plugin platform. [Installation guide](https://docs.astro.build/en/install-and-setup/).

The official blog example loads local Markdown/MDX through a typed content collection. Its head component includes title, description, canonical and social metadata; the configuration enables MDX and sitemap support. It demonstrates source-owned publishing with no CMS database, not an admin editorial workflow. Its advertised performance score was not benchmarked in this research. [Content source](https://github.com/withastro/astro/blob/9870f95601690d9d98799b6fa78a0bc76165ee06/examples/blog/src/content.config.ts), [head source](https://github.com/withastro/astro/blob/9870f95601690d9d98799b6fa78a0bc76165ee06/examples/blog/src/components/BaseHead.astro), [configuration](https://github.com/withastro/astro/blob/9870f95601690d9d98799b6fa78a0bc76165ee06/examples/blog/astro.config.mjs).

Astro prerenders by default and supports on-demand routes with an adapter. `astro add` installs integration dependencies and updates configuration. These are distinct operations: choosing a rendering strategy, selecting initial site content, and adding an integration. An integration installer is not a general domain-feature installer. [Rendering guide](https://docs.astro.build/en/guides/on-demand-rendering/), [integration guide](https://docs.astro.build/en/guides/integrations/).

Astro provides a coordinated dependency upgrade command and major-version upgrade guides; those update the framework/integrations, not an agency's edited template source. Its AI documentation exposes an official docs MCP server. Copy the separation between dependency upgrades and project-specific changes, and provide concise current local guidance; Baseplate does not need its own MCP service. [Upgrade guide](https://docs.astro.build/en/upgrade-astro/), [AI guide](https://docs.astro.build/en/guides/build-with-ai/).

**Rendering recommendation:** first prove a backend-free marketing preset with the existing TanStack Start stack. Current Start docs support static prerendering, including explicit pages and discovered routes. Compatibility with Baseplate's pinned Start/Nitro versions still needs implementation validation. If that path is awkward, trial a separate Astro marketing preset against a real small site; do not rewrite the existing SSR publishing app simply to copy Astro. Both rendered HTML and correct metadata/status codes matter; neither framework choice guarantees search ranking. [Start prerendering documentation](https://tanstack.com/start/latest/docs/framework/react/guide/static-prerendering).

### Better-T-Stack: validated generation-time composition

The generator assembles templates in a virtual filesystem, then postprocesses dependencies, environment, and README output. Its selected frontend/backend/database/auth/addons are generation inputs rather than runtime feature switches. This is the closest architectural reference for creating a tailored Baseplate project. [Pinned generator](https://github.com/AmanVarshney01/create-better-t-stack/blob/ecff4eec72ebdac138a22bfe506182e399a23122/packages/template-generator/src/generator.ts).

`bts.jsonc` records choices, generator version, creation time, and a replay command. It is required by add, but otherwise generated source remains authoritative; the replay command does not fully encode nested options. Record provenance, but do not confuse metadata with a complete upgrade mechanism. [Configuration guide](https://www.better-t-stack.dev/docs/bts-config).

The add command targets addons and new workspace packages. Its implementation loads selected existing configurations, checks compatibility, and writes generated files; its dry run reports a file count. It does not establish safe arbitrary auth/database/backend replacement in customized code. The writer uses ordinary file writes, not a universal three-way merge. [CLI guide](https://www.better-t-stack.dev/docs/cli), [pinned add handler](https://github.com/AmanVarshney01/create-better-t-stack/blob/ecff4eec72ebdac138a22bfe506182e399a23122/apps/cli/src/helpers/core/add-handler.ts), [filesystem writer](https://github.com/AmanVarshney01/create-better-t-stack/blob/ecff4eec72ebdac138a22bfe506182e399a23122/packages/template-generator/src/fs-writer.ts).

Current Docker support generates Compose and per-app Dockerfiles, distinguishes static SPA from SSR deployment, and offers database-only local setup scripts. However, the CLI overview's deployment options lag the Docker guide and current schema. This is packaging evidence, not a tested Dokploy recipe. [Docker guide](https://www.better-t-stack.dev/docs/guides/docker), [pinned schema](https://github.com/AmanVarshney01/create-better-t-stack/blob/ecff4eec72ebdac138a22bfe506182e399a23122/packages/types/src/schemas.ts).

JSON commands, schemas, planning and MCP tools expose the selection contract to agents. Copy the single validated configuration and preview-before-write pattern first; a Baseplate MCP server adds little before the local workflow is reliable. [Agent workflow guide](https://www.better-t-stack.dev/docs/cli/agent-workflows).

### shadcn: editable source with bounded addition and updates

Registry items describe files/targets, npm and registry dependencies, and CSS/theme data. This can distribute a complete UI block, not just an individual button. GitHub dependencies support tag/SHA references, but a parent ref does not automatically pin its dependencies. [Item schema](https://ui.shadcn.com/docs/registry/registry-item-json).

Current add supports dry-run, diff and file inspection; overwrite defaults false. Init/create presets select UI setup and framework templates, while apply can change only theme or font. These UI presets do not define Baseplate's business features and infrastructure topology. [CLI reference](https://ui.shadcn.com/docs/cli).

The file updater skips identical files and defaults against replacing changed existing files; environment merging appends missing keys. That limits accidental replacement, but does not resolve business-logic conflicts. The upstream skill's component-update workflow asks an agent to inspect diffs and preserve local edits: it is selective editing, not guaranteed automatic three-way merging. [Pinned updater](https://github.com/shadcn-ui/ui/blob/5c7072da672b0048bc6771e3204063a2537df91a/packages/shadcn/src/utils/updaters/update-files.ts), [pinned update instructions](https://github.com/shadcn-ui/ui/blob/5c7072da672b0048bc6771e3204063a2537df91a/skills/shadcn/SKILL.md#updating-components).

Its official skill reads installed project state through `info --json`; its migrate command implements named transformations such as icons and base color. Copy those bounded contracts, not an imagined universal source updater. [Skills guide](https://ui.shadcn.com/docs/skills), [pinned migration command](https://github.com/shadcn-ui/ui/blob/5c7072da672b0048bc6771e3204063a2537df91a/packages/shadcn/src/commands/migrate.ts).

## Maintenance and evidence limits

GitHub repository metadata and the default-branch commit endpoint were checked directly on the research date. All four repositories were unarchived. Commit links pin the inspected code; live documentation can change independently.

| Repository                                                                                                                | Checked default-branch commit date (UTC) | Interpretation                                                                                             |
| ------------------------------------------------------------------------------------------------------------------------- | ---------------------------------------- | ---------------------------------------------------------------------------------------------------------- |
| [create-t3-turbo](https://github.com/t3-oss/create-t3-turbo/commit/8f945b7bb3bfb3ca8358d48b1ff0214079bc11ee)              | 2025-12-12                               | Useful pattern reference; recent repository push time does not establish recent default-branch maintenance |
| [Better-T-Stack](https://github.com/AmanVarshney01/create-better-t-stack/commit/ecff4eec72ebdac138a22bfe506182e399a23122) | 2026-09-02                               | Recent release commit, labelled 3.42.2                                                                     |
| [shadcn/ui](https://github.com/shadcn-ui/ui/commit/5c7072da672b0048bc6771e3204063a2537df91a)                              | 2026-09-06                               | Recent registry fix                                                                                        |
| [Astro](https://github.com/withastro/astro/commit/9870f95601690d9d98799b6fa78a0bc76165ee06)                               | 2026-09-05                               | Recent source activity; examples live in the framework repository                                          |

Reproduce metadata checks using `https://api.github.com/repos/<owner>/<repo>` and `/commits?per_page=1`. Activity is not a support SLA, security audit, or proof every combination builds. Source inspection was focused on generation/addition and representative templates, not exhaustive execution. No commercial boilerplate marketing claims or community template performance promises were used as evidence. Four complementary approaches are sufficient for this decision; adding more frameworks would widen the comparison without answering the key ownership question.

## Proposed presets and feature boundaries

These are Baseplate recommendations, not upstream features or claims about completed cleanup.

| Preset             | Default output                                                                                      | Explicit additions                                                                                | Acceptance condition                                                                               |
| ------------------ | --------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------- |
| Business/marketing | Public pages, local content/assets, app-owned branding, rendered HTML, SEO basics                   | Contact submission endpoint/service only when required; source-authored Blog posts if appropriate | Builds and serves with no API, database, Redis, S3, auth, or admin credentials                     |
| Publishing         | Existing SSR public app plus admin, auth, Hono API, PostgreSQL, Blog post workflow and Media assets | Assistant; additional CRM/job workflows as needed                                                 | Staff can draft/publish; public response includes content/metadata and correct missing-post status |
| Internal dashboard | Admin, auth, API, database and only selected business modules                                       | Media, jobs, notifications, Assistant                                                             | No public web app required; authorization and selected workflows function                          |

The target dependency boundaries are not free refactors: existing password reset and notifications use jobs, and existing media uses S3. Until those are separated and validated, a publishing preset should retain their required services honestly. A hidden menu item or disabled runtime flag is insufficient to claim a feature is absent if it still requires credentials, migrations, imports, or a worker at startup.

Treat dependencies as a short explicit list initially: Assistant requires authenticated admin and its persistence/provider configuration; Media assets require object storage; the existing queued workflows require Redis and a worker. Public visitor chat must have its own scope, abuse controls, and operating cost decision. Do not accidentally ship Assistant as visitor support chat.

## Prioritized roadmap

### 1. Establish one trustworthy baseline

The isolation/setup/style/typecheck cleanup and documentation alignment are complete in the integrated branch. One isolated checkout passed full setup and runtime smoke checks; two production project configurations rendered distinct resources. A full two-client runtime/deployment acceptance test and live Dokploy verification remain outstanding. Preserve existing client data on restart. This evidence must precede calling a future generator reliable.

Dokploy's Compose documentation covers service environments and persistent named volumes, including volume backups. Docker documents project names as a way to isolate Compose deployments. Use those platform contracts in a tested Baseplate recipe; copying another starter's Dockerfiles alone does not validate domains, proxy routing, migrations, persistence, or readiness. [Dokploy Compose](https://docs.dokploy.com/docs/core/docker-compose), [Docker project names](https://docs.docker.com/compose/how-tos/project-name/).

### 2. Prove fixed presets, then consider generation

First settle the static-marketing stack through a bounded Start-prerender/Astro pilot. These are future proposals, not authorization or claims of implementation. Once fixed outputs are proven, use one small Bun script and a schema, with shared source templates or an explicit file-selection map. Begin with fixed preset combinations, not every possible feature combination. Resolve dependencies before writing; refuse a nonempty destination; create a new client repository without upstream secrets, scratch history, deployment IDs, or git history.

The current repository skill uses an independent local clone and records its source revision; retaining useful Git history in that fallback is intentional. A future clean export should make its history policy explicit rather than treating it as current behavior.

Record generator/template revision, manifest schema version, preset, selected features and feature revisions, runtime/tool versions, and project slug. Separate public site identity from deployment identity. Keep actual credentials outside the manifest. Install with a tested lockfile and record any deliberate dependency resolution. An agent should be able to inspect the resolved plan before files are written.

Acceptance: each generated preset installs, typechecks, lints, builds, and passes a small workflow smoke test; omitted features leave no required environment variables or broken imports. Marketing must pass with backend services unavailable, not merely stopped after a successful full-stack install.

### 3. Complete the agency workflow around those presets

The repo-local skill should turn a brief into an explicit choice and explain it: business goal, audience, pages, language/content ownership, lead capture, editor needs, chosen preset/features, and deployment assumptions. Client business claims, hours, addresses, prices, and images need supplied or verified sources rather than invented copy.

The sequence is brief/research → reviewable selection → independent project creation → local brand/content customization → validation → deployment handoff. Keep app-owned design tokens, typography, layouts, copy and assets easy to find. Provide the selected project's exact setup and validation commands and where to modify each feature; avoid generating instructions for absent features.

Validate initial HTML/metadata, mobile layout, accessibility basics, forms, publishing and permissions where selected. Include a checked Dokploy recipe per topology: static site, SSR publishing, dashboard/API. Record public versus internal origins, build-time versus runtime variables, migration/seed commands, health checks, and backup/restore ownership. Do not turn routine deployment into an automatic destructive database reset.

### 4. Add one proven feature safely, then expand only from demand

After a few independently customized projects, automate a genuinely isolated addition such as a reusable marketing section. Require a plan showing changed files, dependencies, environment keys, registration changes, and migrations. Refuse unknown collisions and unsupported topology changes; stage changes in a clean git branch or temporary tree so a partial failure is recoverable.

For edits to shared routes, auth, styles, or schema, use bounded transforms with explicit preconditions, or return a manual patch recipe. Reapplying an installed feature should be a no-op. Test a changed local file collision, repeated add, dependency omission, and interrupted operation. Defer feature removal and automatic database application; adding source and executing a data migration are distinct steps.

### 5. Maintain client projects through reviewed updates

Tag Baseplate releases and retain the source revision used for each client. Publish small upgrade notes and targeted fixes with affected versions and validation steps. Apply dependency/security fixes as reviewed client changes; preserve branding and custom workflows. Do not bulk-sync the entire mother template into client repositories.

Initially, a versioned manifest plus git history and a manual patch recipe is enough. Add per-file baseline hashes or a migration runner only when repeated upgrades demonstrate a concrete need. If later using a registry, pin every transitive registry dependency and retain provenance; a mutable latest URL is not reproducible.

## Not worth copying yet

- Better-T-Stack's full framework/database/provider matrix: Baseplate needs three trustworthy business outcomes, not a combinatorial test program.
- Expo, mobile auth proxies, or Next.js solely because create-t3-turbo includes them.
- A hosted registry, plugin marketplace, generator GUI, or Baseplate MCP server before plain templates and commands serve several projects.
- A shared cross-client runtime package for branding or business rules that makes independent deployments depend on coordinated agency releases.
- Runtime switches that leave unused backend infrastructure mandatory for a brochure site.
- Universal semantic merging, feature removal, automatic fleet upgrades, or schema rollback promises.
- Replacing the working SSR publishing surface with Astro before testing whether the existing stack meets the lightweight-site requirement.

The next implementation decision can remain small: define the exact three preset outputs and prove the backend-free marketing build, then automate their creation. No implementation or infrastructure changes are included in this report.

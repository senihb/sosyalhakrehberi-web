# Contributing

This repository is the public growth frontend for the socialrightlabs system.

## Working Rules

- keep the MVP focused on `TR_HOME_CARE_ALLOWANCE`
- do not move policy logic into the frontend
- do not invent backend contract fields
- prefer small, reviewable pull requests
- preserve trust-first and citizen-safe language

## Branching

- use the `codex/` prefix for feature branches
- keep each branch focused on a single task

## Commits

Use conventional commit style.

Examples:

- `feat(home-care): improve pillar and tool conversion flow`
- `docs(readme): add sponsor-facing project overview`
- `ci(repo): add reproducible lint and build checks`

## Pull Requests

Every PR should include:

- a clear title
- a structured description
- API impact notes
- backward compatibility notes
- tests run

## Quality Checks

Run before opening a PR:

```bash
npm run lint
npx tsc --noEmit
npm run build
```

## Security

- never commit secrets
- do not expose credentials in issues or PRs
- keep official entitlement language out of public-facing UI where not appropriate


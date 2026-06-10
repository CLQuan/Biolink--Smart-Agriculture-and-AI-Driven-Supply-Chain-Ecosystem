# Contributing to Bio-Link

## Workflow

Bio-Link follows an Agile Scrum process (3 sprints) tracked in Jira project **BIOL**.

1. Pick a Jira issue (e.g. `BIOL-9`) and move it to **In Progress**.
2. Branch from `main` using the issue key:
   - `feature/BIOL-9-harvest-upload`
   - `fix/BIOL-12-alert-threshold`
3. Commit with the issue key in the message: `BIOL-9: add offline harvest queue`.
4. Open a PR into `main`. CI must pass (lint, build, tests).
5. Link the PR to the Jira issue and request review.
6. Squash-merge; move the Jira issue to **Done**.

## Branch protection

- `main` is protected; no direct pushes.
- All PRs require green CI and at least one review.

## Commit message convention

```
BIOL-<id>: <imperative summary>

<optional body explaining what and why>
```

## Definition of Done

- Acceptance criteria in the Jira story are met.
- Unit tests added/updated and passing.
- Docs updated where behaviour changed.
- No secrets committed (use `.env`, never commit it).

## Sprint mapping

| Sprint | Focus | Issues |
|---|---|---|
| Sprint 1 | Foundation, Auth, Suppliers | BIOL-7,8,9,10,19,20,21,22,25 |
| Sprint 2 | Logistics & Cold Chain | BIOL-11,12 |
| Sprint 3 | QC, Traceability, Admin, ML, Web | BIOL-13,14,15,16,17,18,23,24 |

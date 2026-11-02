# Modular Research and Verification Workflow

A machine-readable workflow schema and reference validator for technical requirements intake, source-based research, AI-assisted drafting, verification, documentation generation, and GitHub pull-request routing.

The repository contains a workflow contract, a YAML example, a JavaScript validator, automated tests, documentation, and reusable output templates. It does not contain a research-provider integration, AI model connection, or GitHub publishing runtime. A consuming automation environment must provide those adapters and their protected credentials.

## Contents

- [`SPECIFICATION.md`](SPECIFICATION.md) — scope, module sequence, validation limits, policy handling, and GitHub route requirements.
- [`schemas/workflow.schema.json`](schemas/workflow.schema.json) — JSON Schema Draft 2020-12 workflow contract.
- [`examples/research-verification.yml`](examples/research-verification.yml) — configured workflow example for the repository.
- [`src/validate-workflow.mjs`](src/validate-workflow.mjs) — YAML parser, schema validator, source-host verification, and module dependency checks.
- [`docs/modular-architecture.md`](docs/modular-architecture.md) — module inputs and outputs, evidence records, execution sequence, and credential boundaries.
- [`docs/standards-basis.md`](docs/standards-basis.md) — cited standards, package, and GitHub API sources with applicability limits.
- [`docs/verification-guide.md`](docs/verification-guide.md) — configuration, evidence, requirement, artifact, and route verification.
- [`CONTRIBUTING.md`](CONTRIBUTING.md) — change, evidence, and review requirements.
- [`templates/requirements-register.csv`](templates/requirements-register.csv), [`templates/research-source-register.csv`](templates/research-source-register.csv), and [`templates/verification-matrix.csv`](templates/verification-matrix.csv) — reusable traceability records.
- [`templates/test-plan.md`](templates/test-plan.md), [`templates/test-case.md`](templates/test-case.md), and [`templates/decision-record.md`](templates/decision-record.md) — project documentation outputs.
- [`.github/workflows/verify-docs.yml`](.github/workflows/verify-docs.yml) — repository CI using `npm ci`, `npm test`, and example validation.

## Validate the example

Requires Node.js 22 or later. Run `npm ci`, `npm test`, and `npm run validate:example`. The validator reports workflow-contract or module-reference errors. It does not validate the truth of researched claims or perform network retrieval or GitHub writes.

## Source and licensing note

The standards referenced here remain governed by their respective publishers. This repository records public scope and bibliographic information and does not reproduce licensed standards text. No license is declared for this repository; no reuse permissions beyond applicable law are asserted.

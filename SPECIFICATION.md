# Technical Specification: Modular Research and Verification Workflow

## 1. Purpose

Define a reusable, machine-readable workflow format for technical research, requirement traceability, document generation, verification, and routing deliverables to a GitHub repository. Artificial intelligence is an optional drafting component in the workflow. The schema and reference validator do not implement a research provider, AI model, or GitHub publishing service; a consuming runtime supplies those adapters.

## 2. Scope

The workflow definition records a goal, scope, required inputs, configured source records, AI operations, verification stages, output artifacts, GitHub destination, policy categories, and module dependencies. It uses JSON Schema Draft 2020-12 and supports YAML workflow files that parse into JSON-compatible data.

The workflow routes repository changes through a pull request. It does not permit direct base-branch publication or repository visibility changes. The AI component has draft-only output and no access to repository credentials.

## 3. Module sequence

The standard modules are intake, research, assistant drafting, verification, documentation generation, and GitHub routing. Each module declares dependencies. The runtime must reject missing or cyclic dependencies and must execute each dependency before its dependent module.

Intake records goal, in-scope and out-of-scope items, constraints, deliverables, and acceptance criteria. Missing required input returns a clarification response or a stopped status. Research uses configured source records and permitted hostnames. Assistant drafting, when enabled, receives retrieved evidence records and returns drafts with source identifiers. Verification records method, requirement coverage, source references, status, and evidence. Documentation generation produces configured Markdown, CSV, JSON, or PDF artifacts. GitHub routing writes to a designated branch and opens a pull request for review.

Detailed module contracts and execution behavior are defined in [`docs/modular-architecture.md`](docs/modular-architecture.md).

## 4. Validation and evidence limits

The schema validator checks workflow structure and defined field constraints. Application-level consistency checks verify module dependencies, source IDs, HTTPS URLs and configured host membership, artifact paths, and output-format consistency. These checks establish conformance to encoded data and workflow rules; they do not establish factual accuracy or source support.

Source-reference resolution confirms that a citation points to a configured evidence record. A separate evidence review evaluates whether that source supports the associated claim. When the review is incomplete or sources conflict, the claim remains marked unverified or the workflow stops.

## 5. Safety, scope, and output requirements

The workflow policy defines restricted output categories for harmful facilitation, personal or operational material, unsupported claims presented as fact, and content outside the technical scope. A policy refusal or a failed required verification stage stops processing before GitHub routing.

Generated documents use objective, concise technical language. They distinguish sourced statements, project requirements, assumptions, and recommendations. They do not claim motive, authority, conformance, or measured outcomes without recorded technical evidence.

## 6. GitHub routing

The GitHub adapter uses the configured repository, base branch, head branch, and artifact paths. Route mode is pull request; review is required before merge. The workflow cannot change repository visibility. Credentials are supplied by the runtime's secret manager and are not stored in the workflow file or provided to the AI component.

## 7. Dependencies and local validation

The reference validator requires Node.js 22 or later, Ajv 8.20.0 using the Draft 2020-12 implementation, and `yaml` 2.9.1. `npm test` verifies the sample definition and the documented schema and module rules. The GitHub Actions workflow runs these tests on pushes and pull requests.

## 8. Source basis

Engineering references, editions, and application limits are listed in [`docs/standards-basis.md`](docs/standards-basis.md). The workflow format does not claim conformance to any cited standard.

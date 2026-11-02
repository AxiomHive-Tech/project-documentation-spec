# Workflow Verification Guide

This guide defines verification stages for a consuming research and documentation workflow. The workflow schema and module interfaces are described in [`../SPECIFICATION.md`](../SPECIFICATION.md) and [`modular-architecture.md`](modular-architecture.md).

## Configuration validation

Parse the workflow file as a single YAML document and reject parser errors or duplicate keys. Validate the resulting object against `schemas/workflow.schema.json` using a JSON Schema Draft 2020-12 validator. Report the field path and validation issue. Schema validation checks the configured data shape and constraints encoded in the schema; it does not establish the accuracy of research content.

Run application-level consistency checks for module dependency order, unique module and source identifiers, allowed HTTPS source hosts, artifact paths, and format-to-extension consistency. These are code-level workflow-contract checks, not factual verification.

## Research and evidence review

For each material technical claim, record the source identifier, title, publisher, version or date, URL, access date, supporting passage or section, and limitation. Source-reference resolution confirms that the identifier and URL refer to a configured source record. It does not determine whether the source supports the claim. Content review compares the claim with the cited source and records the result.

If evidence is unavailable, conflicting, or insufficient for a claim, mark it unverified or stop the workflow according to the configured policy. Do not generate a factual statement as verified solely because its output conforms to a schema.

## Requirement and artifact verification

Map each acceptance criterion to a verification method and result. Record the artifact version, method, result status, evidence reference, and known limitation. Use the repository templates for requirement registers, source registers, test plans, test cases, and verification matrices where they fit the consuming project.

Supported result statuses are `pass`, `fail`, `blocked`, `not_run`, `not_applicable`, and `unverified`. A missing or blocked result is not a pass. A not-applicable result requires a project-specific basis.

## GitHub route verification

Before routing, confirm required verification stages have completed and the artifact manifest contains only configured relative paths. The GitHub adapter creates or updates the configured head branch and opens a pull request against the configured base branch. The adapter does not merge changes or change repository visibility. Review is required before merge.

A passing workflow validation run indicates that the configured structural and consistency checks completed. It does not establish external project correctness, factual accuracy, or standards conformance.

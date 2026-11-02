# Contributing

Changes to this repository must preserve its scope as a modular research, verification, and GitHub-routing workflow schema.

## Change requirements

- Identify the schema field, module contract, or documentation section affected by each change.
- Keep workflow data contracts explicit and version the schema when a change is incompatible.
- Cite primary or authoritative sources for claims about standards, schemas, dependencies, and platform APIs.
- Distinguish source-reference resolution from review of whether a source supports a claim.
- Do not state that schema conformance establishes factual accuracy, implementation correctness, or standards conformance.
- Keep credentials out of schema files, examples, tests, and generated documentation.
- Keep AI credentials and GitHub write credentials outside the AI drafting component.
- Route example repository changes through a reviewed pull request; do not configure automated visibility changes.
- Update sample workflow files and tests when changing schema fields or module contracts.

## Review and verification

Before merging, confirm that JSON Schema files parse, the YAML example conforms to the schema, source hosts match configured entries, module dependencies are present and ordered, output paths are repository-relative, and `npm test` passes. Review documentation claims against linked sources and record edition or version information where available.

The GitHub Actions workflow validates this repository's schema, example, and tests. It does not validate a consuming runtime or external project.

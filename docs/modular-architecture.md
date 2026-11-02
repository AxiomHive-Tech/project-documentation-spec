# Modular Workflow Architecture

## 1. Runtime boundary

The repository supplies a workflow schema, a sample workflow, and a reference validator for configuration files. It does not contain a research provider, an AI model integration, or a GitHub publishing service. A consuming automation runtime must implement the interfaces described here and provide credentials through its protected secret store.

The workflow has six separable stages: intake, research, AI-assisted drafting, verification, documentation generation, and GitHub pull-request routing. A stage receives a versioned input object and returns a versioned result object. Stage-to-stage transfer uses structured records rather than untracked prose.

## 2. Data contracts

### Workflow definition

`schemas/workflow.schema.json` defines the JSON Schema Draft 2020-12 contract. A YAML configuration is parsed to a data object and validated against that schema. The schema constrains property names, data types, allowed values, required fields, string patterns, and record shape.

Schema validation establishes only whether the configuration data conforms to the encoded contract. It does not establish factual accuracy, source reliability, implementation correctness, or policy completeness. Format-specific semantics and source support require separate processing.

### Requirement record

Each requirement record contains a stable ID, statement, source or rationale, version where applicable, acceptance criterion, verification method, status, and change reference. Missing required request fields produce a clarification response or a stopped workflow according to `inputs.missingFieldHandling`.

### Evidence record

Each retrieved source record contains a stable source ID, title, publisher, source category, URL, version or publication date where available, access timestamp, relevant excerpt or section locator, supported claim, and limitations. A source adapter retrieves data only from configured HTTPS hosts. A citation resolver checks that identifiers and URLs resolve to configured records. That check does not establish that a source semantically supports a claim; source-content review is a separate verification stage.

### Verification record

Each verification result contains a requirement or acceptance-criterion ID, method, examined artifact version, environment where relevant, result status, evidence reference, issue reference, and limitation. Supported statuses are `pass`, `fail`, `blocked`, `not_run`, and `not_applicable`. The workflow does not convert a missing or blocked result into a pass.

## 3. Module interfaces

| Module | Input | Output | Runtime responsibility |
|---|---|---|---|
| Intake | Request envelope and workflow definition | Structured goal, scope, constraints, deliverables, acceptance criteria | Validate required fields and return clarification requirements when fields are missing. |
| Research adapter | Query plan and source-profile IDs | Evidence records with source metadata and retrieval status | Retrieve documentation using configured connectors and host restrictions; record source version and retrieval time. |
| Assistant adapter | Goal, requirements, and retrieved evidence records | Draft query plan, evidence summary, or documentation draft | Produce only the configured draft types. Include source IDs for factual claims. Do not receive repository credentials or invoke GitHub write operations. |
| Verification service | Workflow definition, requirements, evidence, and draft artifacts | Verification records and blocking issues | Check schema conformance, source-reference resolution, requirement traceability, acceptance criteria, policy status, and review status as configured. |
| Documentation renderer | Verified structured records | Markdown, CSV, JSON, or PDF artifacts | Render data according to output format and path rules; preserve source and version references. |
| GitHub adapter | Approved artifact manifest and repository target | Branch/commit/PR references and API result | Create or update the configured head branch and open a pull request using the GitHub API. Require review before merge. Do not change repository visibility. |

## 4. Workflow execution

1. Load the YAML definition and parse it as a single document. Reject syntax errors and duplicate mapping keys.
2. Validate the parsed object against the JSON Schema. Report field paths and schema validation errors without publishing artifacts.
3. Resolve module dependencies and configured source profiles. Stop if a dependency is missing, a source host is not configured, or a source URL is invalid.
4. Validate intake fields against the recorded goal and acceptance criteria. Return a clarification response when required information is absent.
5. Run source retrieval through the configured research adapter. Preserve source IDs, publisher, version, access time, and relevant evidence.
6. If enabled, provide retrieved evidence to the assistant adapter for draft generation. The generated result remains a draft and includes claim-to-source identifiers.
7. Run configured verification stages. Source-reference resolution checks that citations identify configured evidence records. Requirement traceability checks that each in-scope criterion has a verification record. Separate review evaluates whether evidence actually supports claims.
8. Generate repository artifacts only after required verification stages complete. If a required stage fails or is blocked, set a failure status and stop before GitHub routing.
9. Submit artifacts through the GitHub adapter using the configured pull-request strategy. The pull request is the review boundary; merge and repository visibility changes remain separate operations.

## 5. Policy and failure handling

The workflow policy classifies disallowed output categories at the interface level. A refusal result contains a status code, a short technical explanation, and no prohibited material. A workflow runtime must prevent further source retrieval or publication when the policy module returns a refusal or when a required verification stage fails.

An unavailable source, unresolved citation, conflicting technical source, missing requirement, schema mismatch, or failed acceptance criterion produces a typed status such as `blocked`, `unverified`, or `fail`. The output must not state that the associated fact or artifact is verified until the corresponding evidence review is complete.

The configured checks reduce specific failure modes but cannot prove that all content is correct or that every possible unsafe result has been excluded. Record the checks actually performed and their results.

## 6. Dependency and credential requirements

The reference validator uses Node.js 22 or later, Ajv 8.20.0 with its Draft 2020-12 implementation, and `yaml` 2.9.1 for YAML parsing. The dependency versions are pinned in `package.json` and `package-lock.json`. Ajv validates the workflow object against the declared schema; the YAML library parses the workflow file and reports syntax and duplicate-key errors.

The workflow definition contains provider references and repository identifiers, not API keys. Research and GitHub adapters obtain credentials from the consuming runtime's secret manager. The assistant adapter receives no GitHub write credential. The GitHub adapter has only the repository permissions required to write the configured branch and open a pull request. The exact permission scope depends on the selected runtime and must be documented in its deployment configuration.

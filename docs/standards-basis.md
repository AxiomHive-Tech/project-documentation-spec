# Standards and Technical Source Basis

**Research checked:** 2026-11-02. Publisher status and package versions below reflect the sources checked on that date. Recheck the source before applying this specification to a new project.

The sources describe data contracts, engineering activities, and platform interfaces. This repository uses them as design references; it does not claim conformance or certification. Where a standard is commercially available, the summary here is limited to publicly accessible publisher metadata and abstracts.

## Workflow data contract

### JSON Schema Draft 2020-12

The official JSON Schema validation specification defines structural constraints on JSON instance data. An instance is valid against a schema when all applicable validation constraints are satisfied. Constraints include types, required properties, allowed values, and other field and collection rules. The same specification distinguishes validation keywords from descriptive annotations and notes that `format` may be annotation-only unless an implementation is configured for format assertion. [JSON Schema Validation, Draft 2020-12](https://json-schema.org/draft/2020-12/json-schema-validation)

**Design use:** `schemas/workflow.schema.json` constrains workflow configuration fields and their allowed structure. Schema validity does not establish that a fact is accurate, that a cited source supports a claim, or that the workflow implementation is complete. Those outcomes require separate source review and implementation verification.

### Ajv 8.20.0

Ajv documentation lists support for JSON Schema Draft 2020-12 and specifies a version-specific validator import for that draft. It also notes that Draft 2020-12 is not compatible with earlier drafts in the same Ajv instance. [Ajv JSON Schema support](https://ajv.js.org/json-schema.html)

**Design use:** the reference validator uses Ajv's 2020 implementation for the repository schema. Package version is pinned in `package.json` and `package-lock.json`.

### YAML 2.9.1

The `yaml` package documentation describes parsing YAML text into JavaScript data, throwing on parsing errors, and supporting strict parsing options including duplicate-key handling. [YAML JavaScript library](https://eemeli.org/yaml/)

**Design use:** the validator parses one workflow YAML document, rejects parser errors and duplicate keys, then passes the resulting data object to Ajv. YAML parsing and schema validation are distinct stages.

## Requirements, lifecycle, and quality

### ISO/IEC/IEEE 29148:2018

ISO lists Edition 2, published in November 2018 and confirmed in 2024. Its public abstract covers requirements-engineering processes and products over the system and software life cycle. The ISO record indicates a revision is in development; the cited edition remains the published version in the catalog checked on the research date. [ISO catalog](https://www.iso.org/standard/72089.html) · [IEEE catalog](https://standards.ieee.org/standard/29148-2018.html)

**Design use:** stable requirement IDs, acceptance criteria, source/rationale records, and requirement-to-verification references. These workflow fields are implementation choices, not a claim that the standard prescribes this schema.

### ISO/IEC/IEEE 12207:2026

As checked on 2026-11-02, ISO lists Edition 2, published 2026-04-29; IEEE lists the 2026 edition as active and superseding the 2017 edition. The publisher's scope covers software life-cycle processes and does not prescribe a particular life-cycle model or methodology. [ISO catalog](https://www.iso.org/standard/90219.html) · [IEEE catalog](https://standards.ieee.org/ieee/12207/11416/)

**Design use:** organize workflow records and dependencies around project life-cycle activities. The schema does not prescribe a development method.

### ISO/IEC 25010:2023

ISO identifies the 2023 second edition as a product-quality model with nine characteristics and related subcharacteristics. Its public abstract describes use in requirements definition, design and testing objectives, quality control, and acceptance criteria. [ISO catalog](https://www.iso.org/standard/78176.html)

**Design use:** select relevant quality topics and record project-specific criteria. The model does not set project thresholds or validate results.

## Testing and secure development

### ISO/IEC/IEEE 29119-2:2021 and Part 3:2021

ISO and IEEE list the 2021 edition of Part 2 as published and describe its scope as generic software test processes across lifecycle models. Part 3:2021 provides test-documentation templates. Full normative text is commercially available. [ISO Part 2](https://www.iso.org/standard/79428.html) · [IEEE Part 2](https://standards.ieee.org/ieee/29119-2/7498/) · [ISO Part 3](https://www.iso.org/standard/79429.html)

**Design use:** record verification plans, procedures, outcomes, and evidence references. Exact conformance obligations require review of the applicable full editions.

### NIST SP 800-218, SSDF Version 1.1

NIST lists Version 1.1 as the final publication from February 2022. NIST also lists Version 1.2 as an Initial Public Draft dated 2025-12-17, not as the final replacement in the sources checked. The SSDF describes recommended secure-development practices intended to integrate with existing life-cycle processes. [NIST SP 800-218](https://csrc.nist.gov/pubs/sp/800/218/final) · [NIST SSDF project](https://csrc.nist.gov/projects/ssdf) · [Version 1.2 initial public draft](https://csrc.nist.gov/pubs/sp/800/218/r1/ipd)

**Design use:** provide a reference for security-related workflow requirements and evidence records. SSDF is not represented as a certification or an automatic security guarantee.

## GitHub routing

GitHub's repository contents API supports creating or updating files at repository paths using Base64-encoded content, a commit message, and a branch. Updating an existing file also requires its current blob SHA. [GitHub REST API: repository contents](https://docs.github.com/rest/repos/contents)

GitHub Actions documentation describes workflow YAML, triggers, jobs, permissions, and security guidance. [Workflow syntax](https://docs.github.com/actions/using-workflows/workflow-syntax-for-github-actions) · [Secure use reference](https://docs.github.com/en/actions/reference/security/secure-use)

**Design use:** the consuming GitHub adapter writes generated artifacts to a configured head branch and opens a pull request. Credentials remain in the runtime's secret store. The workflow does not modify repository visibility or merge pull requests.

## Evidence limitation

The cited publisher and platform pages describe scope, versions, interfaces, and recommended uses. They do not provide quantified causal evidence that adopting this workflow or the referenced standards produces a particular project outcome. No such outcome claim is made.

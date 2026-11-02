import { readFile } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import { dirname, resolve } from "node:path";
import Ajv2020 from "ajv/dist/2020.js";
import { parseDocument } from "yaml";

const moduleDirectory = dirname(fileURLToPath(import.meta.url));
const schemaPath = resolve(moduleDirectory, "../schemas/workflow.schema.json");
const schema = JSON.parse(await readFile(schemaPath, "utf8"));
const ajv = new Ajv2020({ allErrors: true, strict: true });
const validateSchema = ajv.compile(schema);

function addUniqueValueErrors(values, label, errors) {
  const seen = new Set();
  for (const value of values) {
    if (seen.has(value)) errors.push(`${label} contains duplicate value: ${value}`);
    seen.add(value);
  }
}

function validateSourceProfiles(workflow, errors) {
  const allowedHosts = new Set(workflow.research.allowedHosts);
  const sources = workflow.research.sources;
  addUniqueValueErrors(sources.map((source) => source.sourceId), "research.sources", errors);

  for (const source of sources) {
    let parsed;
    try {
      parsed = new URL(source.url);
    } catch {
      errors.push(`Source ${source.sourceId} has an invalid URL.`);
      continue;
    }

    if (parsed.protocol !== "https:" || parsed.username || parsed.password) {
      errors.push(`Source ${source.sourceId} must use HTTPS and must not embed credentials in its URL.`);
    }

    const hostAllowed = [...allowedHosts].some(
      (host) => parsed.hostname === host || parsed.hostname.endsWith(`.${host}`),
    );
    if (!hostAllowed) {
      errors.push(`Source ${source.sourceId} is outside the configured research host list.`);
    }
  }
}

function validateFlow(workflow, errors) {
  const steps = workflow.flow;
  const ids = steps.map((step) => step.moduleId);
  addUniqueValueErrors(ids, "flow", errors);

  const requiredModules = ["intake", "research", "verification", "documentation", "github_route"];
  for (const moduleId of requiredModules) {
    if (!ids.includes(moduleId)) errors.push(`flow is missing required module: ${moduleId}`);
  }

  const assistantPresent = ids.includes("assistant_draft");
  if (workflow.assistant.enabled && !assistantPresent) {
    errors.push("assistant_draft must be present when assistant.enabled is true.");
  }
  if (!workflow.assistant.enabled && assistantPresent) {
    errors.push("assistant_draft must be omitted when assistant.enabled is false.");
  }
  if (workflow.assistant.enabled && workflow.assistant.allowedOperations.length === 0) {
    errors.push("At least one assistant operation must be configured when the assistant is enabled.");
  }

  const positions = new Map(ids.map((id, index) => [id, index]));
  const seen = new Set();
  for (const step of steps) {
    for (const dependency of step.dependsOn) {
      if (!positions.has(dependency)) {
        errors.push(`Module ${step.moduleId} depends on missing module: ${dependency}`);
      } else if (positions.get(dependency) >= positions.get(step.moduleId)) {
        errors.push(`Module ${step.moduleId} must follow dependency ${dependency} in flow.`);
      }
    }
    seen.add(step.moduleId);
  }

  const dependencyRequirements = {
    research: ["intake"],
    verification: assistantPresent ? ["research", "assistant_draft"] : ["research"],
    documentation: ["verification"],
    github_route: ["documentation"],
  };
  for (const [moduleId, dependencies] of Object.entries(dependencyRequirements)) {
    const step = steps.find((candidate) => candidate.moduleId === moduleId);
    if (!step) continue;
    for (const dependency of dependencies) {
      if (!step.dependsOn.includes(dependency)) {
        errors.push(`Module ${moduleId} must declare dependency ${dependency}.`);
      }
    }
  }

  for (const step of steps) {
    addUniqueValueErrors(step.dependsOn, `dependencies for ${step.moduleId}`, errors);
  }
}

function validateArtifacts(workflow, errors) {
  const artifacts = workflow.outputs.artifacts;
  addUniqueValueErrors(artifacts.map((artifact) => artifact.artifactId), "outputs.artifacts", errors);
  addUniqueValueErrors(artifacts.map((artifact) => artifact.path), "output paths", errors);

  for (const artifact of artifacts) {
    const extension = artifact.path.split(".").at(-1);
    const expectedExtension = {
      markdown: "md",
      json: "json",
      csv: "csv",
      pdf: "pdf",
    }[artifact.format];
    if (extension !== expectedExtension) {
      errors.push(`Artifact ${artifact.artifactId} format does not match its file extension.`);
    }
  }
}

export function validateWorkflowDefinition(workflow) {
  const errors = [];
  if (!validateSchema(workflow)) {
    for (const issue of validateSchema.errors ?? []) {
      errors.push(`${issue.instancePath || "/"}: ${issue.message}`);
    }
    return { valid: false, errors };
  }

  validateSourceProfiles(workflow, errors);
  validateFlow(workflow, errors);
  validateArtifacts(workflow, errors);
  return { valid: errors.length === 0, errors };
}

export function parseWorkflowText(text) {
  const document = parseDocument(text, { strict: true, uniqueKeys: true });
  if (document.errors.length > 0) {
    return {
      value: null,
      errors: document.errors.map((issue) => issue.message),
    };
  }
  return { value: document.toJS(), errors: [] };
}

export async function validateWorkflowFile(filePath) {
  const text = await readFile(filePath, "utf8");
  const parsed = parseWorkflowText(text);
  if (parsed.errors.length > 0) return { valid: false, errors: parsed.errors };
  return validateWorkflowDefinition(parsed.value);
}

if (process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  const target = process.argv[2] ?? resolve(moduleDirectory, "../examples/research-verification.yml");
  try {
    const result = await validateWorkflowFile(target);
    if (!result.valid) {
      console.error("Workflow configuration is invalid:");
      for (const error of result.errors) console.error(`- ${error}`);
      process.exitCode = 1;
    } else {
      console.log(`Workflow configuration is valid: ${target}`);
    }
  } catch (error) {
    console.error(`Unable to load workflow configuration: ${error.message}`);
    process.exitCode = 1;
  }
}

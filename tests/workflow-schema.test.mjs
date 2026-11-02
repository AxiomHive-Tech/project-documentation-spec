import test from "node:test";
import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import { parseWorkflowText, validateWorkflowDefinition } from "../src/validate-workflow.mjs";

const source = await readFile(new URL("../examples/research-verification.yml", import.meta.url), "utf8");
const parsed = parseWorkflowText(source);
assert.deepEqual(parsed.errors, []);

function freshWorkflow() {
  return structuredClone(parsed.value);
}

test("example workflow conforms to the schema and module contracts", () => {
  const result = validateWorkflowDefinition(freshWorkflow());
  assert.equal(result.valid, true, result.errors.join("\n"));
});

test("workflow route requires a reviewed pull request", () => {
  const workflow = freshWorkflow();
  workflow.github.routeMode = "direct_commit";
  const result = validateWorkflowDefinition(workflow);
  assert.equal(result.valid, false);
  assert.ok(result.errors.some((error) => error.includes("must be equal to constant")));
});

test("research source URLs must match configured HTTPS hosts", () => {
  const workflow = freshWorkflow();
  workflow.research.sources[0].url = "https://unapproved.example/spec";
  const result = validateWorkflowDefinition(workflow);
  assert.equal(result.valid, false);
  assert.ok(result.errors.some((error) => error.includes("outside the configured research host list")));
});

test("module dependencies must precede dependent modules", () => {
  const workflow = freshWorkflow();
  workflow.flow.find((step) => step.moduleId === "github_route").dependsOn = ["verification"];
  const result = validateWorkflowDefinition(workflow);
  assert.equal(result.valid, false);
  assert.ok(result.errors.some((error) => error.includes("must declare dependency documentation")));
});

test("assistant configuration cannot access repository credentials or publish directly", () => {
  const workflow = freshWorkflow();
  workflow.assistant.directPublication = true;
  const result = validateWorkflowDefinition(workflow);
  assert.equal(result.valid, false);
  assert.ok(result.errors.some((error) => error.includes("must be equal to constant")));
});

test("duplicate YAML keys are rejected during parsing", () => {
  const result = parseWorkflowText("schemaVersion: 1.0.0\nschemaVersion: 1.0.0\n");
  assert.ok(result.errors.length > 0);
});

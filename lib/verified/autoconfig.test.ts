import { describe, expect, it } from "vitest";
import { z } from "zod";
import {
  autoConfigSchema,
  AUTOCONFIG_JSON_SCHEMA,
  countUnionParameters,
  MAX_UNION_PARAMETERS,
} from "./autoconfig";
import type { JsonObject, JsonValue } from "../json-value";

type KeyTree = { [key: string]: KeyTree | true };

/** Peel the wrappers tolerance adds (.catch, .default, .transform, .nullable). */
function unwrap(schema: z.ZodTypeAny): z.ZodTypeAny {
  let current = schema;
  for (;;) {
    if (current instanceof z.ZodCatch || current instanceof z.ZodDefault) {
      current = current._def.innerType;
    } else if (current instanceof z.ZodEffects) {
      current = current._def.schema;
    } else if (current instanceof z.ZodOptional || current instanceof z.ZodNullable) {
      current = current.unwrap();
    } else {
      return current;
    }
  }
}

function zodKeyTree(input: z.ZodTypeAny): KeyTree | true {
  const schema = unwrap(input);
  if (schema instanceof z.ZodObject) {
    const shape: Record<string, z.ZodTypeAny> = schema.shape;
    const out: KeyTree = {};
    for (const [key, value] of Object.entries(shape)) out[key] = zodKeyTree(value);
    return out;
  }
  return true;
}

function isObjectSchema(schema: JsonValue): schema is JsonObject {
  return (
    typeof schema === "object" &&
    schema !== null &&
    !Array.isArray(schema) &&
    schema.type === "object"
  );
}

function jsonKeyTree(schema: JsonValue): KeyTree | true {
  if (!isObjectSchema(schema)) return true;
  const properties = schema.properties;
  if (typeof properties !== "object" || properties === null || Array.isArray(properties)) {
    return true;
  }
  const out: KeyTree = {};
  for (const [key, value] of Object.entries(properties)) out[key] = jsonKeyTree(value);
  return out;
}

function eachObjectNode(schema: JsonValue, visit: (node: JsonObject) => void): void {
  if (typeof schema !== "object" || schema === null) return;
  if (Array.isArray(schema)) {
    for (const item of schema) eachObjectNode(item, visit);
    return;
  }
  if (isObjectSchema(schema)) visit(schema);
  for (const value of Object.values(schema)) eachObjectNode(value, visit);
}

describe("autoconfig schemas", () => {
  it("the zod schema and the JSON schema describe the same keys", () => {
    expect(jsonKeyTree(AUTOCONFIG_JSON_SCHEMA)).toEqual(zodKeyTree(autoConfigSchema));
  });

  it("every object in the JSON schema forbids extra properties", () => {
    eachObjectNode(AUTOCONFIG_JSON_SCHEMA, (node) => {
      expect(node.additionalProperties).toBe(false);
    });
  });

  it("every object in the JSON schema requires all of its properties", () => {
    eachObjectNode(AUTOCONFIG_JSON_SCHEMA, (node) => {
      const properties = node.properties;
      if (typeof properties !== "object" || properties === null || Array.isArray(properties)) {
        return;
      }
      expect(node.required).toEqual(Object.keys(properties));
    });
  });

  it("stays under the structured-outputs union-parameter limit", () => {
    // The API rejects the request outright above this, so it is not something a
    // schema change can be allowed to discover in production.
    expect(countUnionParameters(AUTOCONFIG_JSON_SCHEMA)).toBeLessThanOrEqual(
      MAX_UNION_PARAMETERS,
    );
  });

  it("carries no numeric or string constraints, which structured outputs reject", () => {
    const banned = ["minimum", "maximum", "multipleOf", "minLength", "maxLength", "pattern"];
    eachObjectNode(AUTOCONFIG_JSON_SCHEMA, (node) => {
      for (const key of banned) expect(node[key]).toBeUndefined();
    });
  });
});

const suggested = (value: JsonValue) => ({
  value,
  confidence: "high",
  evidence: "README.md",
});

describe("autoConfigSchema", () => {
  const valid = {
    tool: {
      name: suggested("HipSTR"),
      maintainer: suggested("Lab"),
      contact: suggested("a@b.com"),
    },
    docker: {
      language: suggested("c-cpp"),
      needs_build: suggested(true),
      build_cmd: suggested("make"),
      check_cmd: suggested("./HipSTR --help"),
    },
    run: {
      cmd: suggested("HipSTR --bams /data/in/input.bam"),
      timeout_minutes: suggested(20),
    },
    inputs: {
      type: suggested("illumina-bam-hg38"),
      fixture_path: suggested("test/sample.bam"),
    },
    outputs: { path: suggested("result.vcf") },
    compatibility: [] as JsonValue[],
    caveats: [],
  };

  it("accepts a well-formed configuration", () => {
    expect(autoConfigSchema.safeParse(valid).success).toBe(true);
  });

  it("accepts raised compatibility flags", () => {
    const raised = structuredClone(valid);
    raised.compatibility = [
      { flag: "requires_gpu", confidence: "high", evidence: "README.md: needs CUDA" },
    ];
    expect(autoConfigSchema.safeParse(raised).success).toBe(true);
  });

  it("accepts null as an answer on every suggested field", () => {
    const nulled = structuredClone(valid);
    nulled.run.cmd = { value: null, confidence: "low", evidence: "" };
    expect(autoConfigSchema.safeParse(nulled).success).toBe(true);
  });

  it("rejects extra top-level keys", () => {
    expect(
      autoConfigSchema.safeParse({ ...valid, surprise: true }).success,
    ).toBe(false);
  });
});

/**
 * The bounds below cannot be expressed in the JSON Schema the model is given —
 * structured outputs rejects `maxLength` — so the model has no way to honour
 * them exactly. Enforcing them strictly threw away whole generated
 * configurations over one long quote.
 */
describe("tolerance for values the model was never told to bound", () => {
  const base = {
    tool: {
      name: suggested("HipSTR"),
      maintainer: suggested(null),
      contact: suggested(null),
    },
    docker: {
      language: suggested("c-cpp"),
      needs_build: suggested(true),
      build_cmd: suggested("make"),
      check_cmd: suggested(null),
    },
    run: { cmd: suggested("HipSTR --bams /data/in/input.bam"), timeout_minutes: suggested(15) },
    inputs: { type: suggested("illumina-bam-hg38"), fixture_path: suggested(null) },
    outputs: { path: suggested("result.vcf") },
    compatibility: [] as JsonValue[],
    caveats: [] as JsonValue[],
  };

  it("clamps an over-long evidence instead of failing the whole response", () => {
    const long = structuredClone(base);
    long.tool.name = { value: "HipSTR", confidence: "high", evidence: "x".repeat(5000) };
    const parsed = autoConfigSchema.safeParse(long);
    expect(parsed.success).toBe(true);
    if (!parsed.success) return;
    expect(parsed.data.tool.name.value).toBe("HipSTR");
    expect(parsed.data.tool.name.evidence.length).toBeLessThanOrEqual(400);
  });

  it("drops an over-long value but keeps every other field", () => {
    const long = structuredClone(base);
    long.run.cmd = { value: "x".repeat(9000), confidence: "high", evidence: "README.md" };
    const parsed = autoConfigSchema.safeParse(long);
    expect(parsed.success).toBe(true);
    if (!parsed.success) return;
    expect(parsed.data.run.cmd.value).toBeNull();
    expect(parsed.data.tool.name.value).toBe("HipSTR");
    expect(parsed.data.docker.build_cmd.value).toBe("make");
  });

  it("nulls an out-of-range timeout rather than failing", () => {
    const bad = structuredClone(base);
    bad.run.timeout_minutes = { value: 600, confidence: "high", evidence: "" };
    const parsed = autoConfigSchema.safeParse(bad);
    expect(parsed.success).toBe(true);
    if (parsed.success) expect(parsed.data.run.timeout_minutes.value).toBeNull();
  });

  it("nulls an unknown enum rather than failing the response", () => {
    const bad = structuredClone(base);
    bad.docker.language = suggested("cobol");
    const parsed = autoConfigSchema.safeParse(bad);
    expect(parsed.success).toBe(true);
    if (parsed.success) expect(parsed.data.docker.language.value).toBeNull();
  });

  it("drops a malformed compatibility entry and keeps the good ones", () => {
    const mixed = structuredClone(base);
    mixed.compatibility = [
      { flag: "requires_gpu", confidence: "high", evidence: "needs CUDA" },
      { flag: "not_a_flag", confidence: "high", evidence: "" },
    ];
    const parsed = autoConfigSchema.safeParse(mixed);
    expect(parsed.success).toBe(true);
    if (parsed.success) {
      expect(parsed.data.compatibility.map((c) => c.flag)).toEqual(["requires_gpu"]);
    }
  });

  it("nulls an unknown assay slug rather than failing", () => {
    const bad = structuredClone(base);
    bad.inputs.type = suggested("not-a-real-assay");
    const parsed = autoConfigSchema.safeParse(bad);
    expect(parsed.success).toBe(true);
    if (parsed.success) expect(parsed.data.inputs.type.value).toBeNull();
  });

  it("loads a configuration stored before a section existed", () => {
    // The shape written before `outputs` was added. It reached the review dialog
    // unchecked once and crashed it on config.outputs.path.
    const legacy = structuredClone(base) as Record<string, JsonValue>;
    delete legacy.outputs;
    const parsed = autoConfigSchema.safeParse(legacy);
    expect(parsed.success).toBe(true);
    if (!parsed.success) return;
    expect(parsed.data.outputs.path.value).toBeNull();
    // Everything that was stored still comes back.
    expect(parsed.data.run.cmd.value).toBe("HipSTR --bams /data/in/input.bam");
    expect(parsed.data.tool.name.value).toBe("HipSTR");
  });

  it("survives a section that is not an object at all", () => {
    const broken = structuredClone(base) as Record<string, JsonValue>;
    broken.docker = "nonsense";
    const parsed = autoConfigSchema.safeParse(broken);
    expect(parsed.success).toBe(true);
    if (parsed.success) {
      expect(parsed.data.docker.language.value).toBeNull();
      expect(parsed.data.tool.name.value).toBe("HipSTR");
    }
  });

  it("caps an over-long caveat list", () => {
    const many = structuredClone(base);
    many.caveats = Array.from({ length: 30 }, (_, i) => `caveat ${i}`);
    const parsed = autoConfigSchema.safeParse(many);
    expect(parsed.success).toBe(true);
    if (parsed.success) expect(parsed.data.caveats.length).toBe(8);
  });
});

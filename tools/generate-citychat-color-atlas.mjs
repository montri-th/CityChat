#!/usr/bin/env node

import { createHash } from "node:crypto";
import { readFile, writeFile } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import path from "node:path";

const TOOL_DIR = path.dirname(fileURLToPath(import.meta.url));
const PROJECT_ROOT = path.resolve(TOOL_DIR, "..");
const MAP_PATH = path.join(
  PROJECT_ROOT,
  "deployment",
  "resources",
  "citychat-ves",
  "v0.6.1",
  "citychat-color-role-map.json",
);
const SCHEMA_PATH = path.join(
  PROJECT_ROOT,
  "deployment",
  "schemas",
  "citychat-color-role-map.schema.v0.6.1.json",
);
const FRAGMENT_PATH = path.join(
  PROJECT_ROOT,
  "deployment",
  "resources",
  "citychat-ves",
  "v0.6.1",
  "citychat-color-atlas.fragment.html",
);
const QA_PATH = path.join(
  PROJECT_ROOT,
  "deployment",
  "qa",
  "color-atlas-generation.v0.6.1.json",
);
const GENERATOR_PATH = fileURLToPath(import.meta.url);
const CHECK_MODE = process.argv.includes("--check");

const EXPECTED_ROLE_IDS = [
  "cc.identity.logo-band",
  "cc.identity.product-field",
  "cc.energy.participation",
  "cc.foundation.surface.canvas",
  "cc.foundation.surface.alt",
  "cc.foundation.surface.card",
  "cc.foundation.surface.raised",
  "cc.foundation.surface.soft",
  "cc.foundation.surface.blue-tint",
  "cc.foundation.surface.beige-tint",
  "cc.foundation.text.primary",
  "cc.foundation.text.secondary",
  "cc.foundation.text.metadata",
  "cc.foundation.text.muted",
  "cc.foundation.text.disabled",
  "cc.foundation.border.hairline",
  "cc.foundation.border.default",
  "cc.foundation.border.emphasis",
  "cc.overlay.media-caption",
  "cc.interaction.default-action",
  "cc.semantic.success",
  "cc.semantic.warning",
  "cc.semantic.danger",
  "cc.semantic.info",
  "cc.semantic.neutral",
  "cc.semantic.pending",
  "cc.semantic.assisted",
  "cc.source.candidate",
  "cc.source.derived",
  "cc.source.other",
  "cc.source.verified-lineage",
  "cc.atmosphere.measure",
  "cc.atmosphere.ground",
  "cc.atmosphere.cultivate",
  "cc.atmosphere.diversity",
  "cc.map.active-layer",
  "cc.map.hover",
  "cc.map.selected",
  "cc.map.focus",
  "cc.map.marker",
  "cc.data.no-data",
  "cc.data.zero",
  "cc.data.category",
  "cc.data.scale",
  "cc.asset.supporting-color",
];
const EXPECTED_FAMILY_COUNTS = {
  identity: 3,
  reading: 16,
  action: 1,
  "state-source": 11,
  atmosphere: 4,
  "map-data": 9,
  assets: 1,
};
const EXPECTED_STATUS_COUNTS = {
  governed: 43,
  reference_fixture: 1,
  candidate: 0,
  omitted: 1,
};
const RAW_COLOR_PATTERN =
  /#[0-9a-f]{3,8}\b|\brgba?\s*\(|\bhsla?\s*\(|(?:linear|radial|conic)-gradient\s*\(/i;

function sha256(value) {
  return createHash("sha256").update(value).digest("hex");
}

function assert(condition, message) {
  if (!condition) {
    throw new Error(message);
  }
}

function escapeHtml(value) {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

function escapeAttribute(value) {
  return escapeHtml(value).replaceAll("\n", " ");
}

function countBy(items, key) {
  return items.reduce((counts, item) => {
    const value = item[key];
    counts[value] = (counts[value] || 0) + 1;
    return counts;
  }, {});
}

function decodePointerSegment(value) {
  return value.replaceAll("~1", "/").replaceAll("~0", "~");
}

function resolvePointer(document, pointer) {
  assert(pointer.startsWith("/"), "JSON pointer must start with /: " + pointer);
  let current = document;
  for (const segment of pointer.slice(1).split("/").map(decodePointerSegment)) {
    assert(
      current !== null &&
        current !== undefined &&
        Object.prototype.hasOwnProperty.call(current, segment),
      "Unresolved JSON pointer " + pointer + " at " + segment,
    );
    current = current[segment];
  }
  return current;
}

function parseCssDeclarations(block) {
  const values = new Map();
  const expression = /(--[a-z0-9-]+)\s*:\s*([^;]+);/gi;
  for (const match of block.matchAll(expression)) {
    values.set(match[1], match[2].trim());
  }
  return values;
}

function parseCssThemes(css) {
  const rootMatch = css.match(/:root\s*\{([\s\S]*?)\n\}/);
  const darkMatch = css.match(/\[data-theme="dark"\]\s*\{([\s\S]*?)\n\}/);
  assert(rootMatch, "LDS CSS is missing :root declarations");
  assert(darkMatch, "LDS CSS is missing dark-theme declarations");
  return {
    light: parseCssDeclarations(rootMatch[1]),
    dark: parseCssDeclarations(darkMatch[1]),
  };
}

function resolveCssVariable(cssThemes, name, theme, stack = []) {
  assert(!stack.includes(name), "Circular CSS variable reference: " + stack.concat(name).join(" -> "));
  const raw =
    (theme === "dark" ? cssThemes.dark.get(name) : undefined) ||
    cssThemes.light.get(name);
  assert(raw !== undefined, "Missing CSS variable " + name + " for " + theme);
  return raw.replace(/var\((--[a-z0-9-]+)\)/gi, (_match, nested) =>
    resolveCssVariable(cssThemes, nested, theme, stack.concat(name)),
  );
}

function gradientFromValue(value) {
  if (
    value &&
    typeof value === "object" &&
    typeof value.angle === "string" &&
    Array.isArray(value.stops)
  ) {
    return (
      "linear-gradient(" +
      value.angle +
      ", " +
      value.stops.map((stop) => stop[0] + " " + stop[1]).join(", ") +
      ")"
    );
  }
  if (
    Array.isArray(value) &&
    value.length >= 2 &&
    value.every((entry) => typeof entry === "string" && /^#[0-9a-f]{6}$/i.test(entry))
  ) {
    const stops = value.map((entry, index) => {
      const position = Math.round((index / (value.length - 1)) * 100);
      return entry + " " + position + "%";
    });
    return "linear-gradient(135deg, " + stops.join(", ") + ")";
  }
  return null;
}

function displayValue(value) {
  const gradient = gradientFromValue(value);
  if (gradient) return gradient;
  if (typeof value === "string" || typeof value === "number") return String(value);
  if (value && value.registryId && Array.isArray(value.values)) {
    return value.registryId + " · " + value.values.length + " categories";
  }
  return JSON.stringify(value);
}

function cssValue(value) {
  const gradient = gradientFromValue(value);
  if (gradient) return gradient;
  if (
    typeof value === "string" &&
    (RAW_COLOR_PATTERN.test(value) || value === "transparent")
  ) {
    return value;
  }
  return null;
}

async function loadInputs() {
  const [mapText, schemaText, generatorText] = await Promise.all([
    readFile(MAP_PATH, "utf8"),
    readFile(SCHEMA_PATH, "utf8"),
    readFile(GENERATOR_PATH, "utf8"),
  ]);
  const map = JSON.parse(mapText);
  const schema = JSON.parse(schemaText);
  const sourceById = new Map();
  const sourceEvidence = {};

  for (const source of map.sourceFiles) {
    assert(!sourceById.has(source.sourceId), "Duplicate sourceId " + source.sourceId);
    const record = { descriptor: source };
    if (source.availability !== "linked_not_vendored") {
      const absolutePath = path.resolve(path.dirname(MAP_PATH), source.path);
      const text = await readFile(absolutePath, "utf8");
      const actualHash = sha256(text);
      assert(
        actualHash === source.sha256,
        source.sourceId + " hash mismatch: expected " + source.sha256 + ", got " + actualHash,
      );
      record.absolutePath = absolutePath;
      record.text = text;
      if (absolutePath.endsWith(".json")) record.json = JSON.parse(text);
      if (absolutePath.endsWith(".css")) record.cssThemes = parseCssThemes(text);
      sourceEvidence[source.sourceId] = {
        availability: source.availability,
        sha256: actualHash,
      };
    } else {
      sourceEvidence[source.sourceId] = {
        availability: source.availability,
        sha256: source.sha256,
        immutableUrl: source.immutableUrl,
      };
    }
    sourceById.set(source.sourceId, record);
  }

  return {
    map,
    mapText,
    schema,
    schemaText,
    generatorText,
    sourceById,
    sourceEvidence,
  };
}

function validateMap(inputs) {
  const { map, mapText, schema, sourceById } = inputs;
  assert(schema.$schema === "https://json-schema.org/draft/2020-12/schema", "Unexpected schema draft");
  assert(map.schemaVersion === "0.6.1", "Unexpected map schemaVersion");
  assert(map.mapId === "citychat-color-usage-atlas", "Unexpected mapId");
  assert(map.mode === "product_usage_overlay", "Map must be a product usage overlay");
  assert(map.fullLivingReference === false, "CityChat must not claim the full LDS living reference");
  assert(!RAW_COLOR_PATTERN.test(mapText), "Role map contains a local raw colour or gradient");
  assert(!mapText.toLowerCase().includes("color-mix("), "Role map contains runtime colour mixing");
  assert(map.router.length === 7, "Router must contain exactly seven destinations");
  assert(map.roles.length === 45, "Role map must contain exactly 45 roles");

  const roleIds = map.roles.map((entry) => entry.roleId);
  assert(new Set(roleIds).size === roleIds.length, "Role IDs must be unique");
  assert(
    JSON.stringify(roleIds.slice().sort()) === JSON.stringify(EXPECTED_ROLE_IDS.slice().sort()),
    "Role inventory differs from the governed 45-role set",
  );

  const familyCounts = countBy(map.roles, "family");
  const statusCounts = countBy(map.roles, "status");
  for (const [family, expected] of Object.entries(EXPECTED_FAMILY_COUNTS)) {
    assert(familyCounts[family] === expected, "Unexpected " + family + " role count");
  }
  for (const [status, expected] of Object.entries(EXPECTED_STATUS_COUNTS)) {
    assert((statusCounts[status] || 0) === expected, "Unexpected " + status + " role count");
  }
  assert(
    JSON.stringify(map.coverage.expectedStatusCounts) === JSON.stringify(EXPECTED_STATUS_COUNTS),
    "Declared status coverage differs from generated coverage",
  );

  const routerFamilies = map.router.map((entry) => entry.family);
  assert(new Set(routerFamilies).size === 7, "Each router destination must own one family");
  for (const roleRecord of map.roles) {
    assert(roleRecord.label.th && roleRecord.label.en, roleRecord.roleId + " needs bilingual label");
    assert(roleRecord.job.th && roleRecord.job.en, roleRecord.roleId + " needs bilingual job");
    assert(roleRecord.useWhen.th && roleRecord.useWhen.en, roleRecord.roleId + " needs bilingual useWhen");
    assert(routerFamilies.includes(roleRecord.family), roleRecord.roleId + " has no router destination");
    assert(Array.isArray(roleRecord.redundantCue), roleRecord.roleId + " needs redundantCue");
    assert(Array.isArray(roleRecord.acceptanceIds), roleRecord.roleId + " needs acceptanceIds");

    if (roleRecord.policy === "conditional") {
      assert(
        Array.isArray(roleRecord.capabilityKeys) && roleRecord.capabilityKeys.length > 0,
        roleRecord.roleId + " is conditional but has no capabilityKeys",
      );
    }
    if (roleRecord.status === "omitted") {
      assert(roleRecord.policy === "prohibited", roleRecord.roleId + " omitted role must be prohibited");
      assert(roleRecord.artifactUse === "omitted", roleRecord.roleId + " omitted role has wrong artifactUse");
      assert(roleRecord.bindings.length === 0, roleRecord.roleId + " omitted role must have no bindings");
      assert(roleRecord.doNotUseFor.length > 0, roleRecord.roleId + " omitted role needs a blocked reason");
    } else {
      assert(roleRecord.bindings.length > 0, roleRecord.roleId + " has no governed binding");
    }
    if (
      roleRecord.roleId.startsWith("cc.semantic.") ||
      roleRecord.roleId.startsWith("cc.source.") ||
      roleRecord.roleId.startsWith("cc.map.") ||
      roleRecord.roleId.startsWith("cc.data.")
    ) {
      assert(roleRecord.redundantCue.length > 0, roleRecord.roleId + " needs a non-colour cue");
    }

    for (const binding of roleRecord.bindings) {
      assert(binding.slot && binding.implementation, roleRecord.roleId + " has incomplete binding");
      for (const theme of ["light", "dark"]) {
        const locator = binding.sourceByTheme[theme];
        const source = sourceById.get(locator.sourceId);
        assert(source, roleRecord.roleId + " references unknown source " + locator.sourceId);
        assert(
          Boolean(locator.pointer) !== Boolean(locator.cssVariable),
          roleRecord.roleId + " locator must use one pointer or CSS variable",
        );
        if (source.descriptor.availability === "linked_not_vendored") {
          assert(
            roleRecord.status === "reference_fixture",
            roleRecord.roleId + " may not treat a linked source as a governed local value",
          );
          assert(locator.pointer, roleRecord.roleId + " linked reference needs a pointer");
        } else if (locator.pointer) {
          resolvePointer(source.json, locator.pointer);
        } else {
          resolveCssVariable(source.cssThemes, locator.cssVariable, theme);
        }
      }
    }
  }

  const tokens = sourceById.get("ldsTokens").json;
  const delivery = sourceById.get("colorDelivery").json;
  const recipes = sourceById.get("surfaceRecipes").json;
  const identity = sourceById.get("identityManifest").json;
  const vesText = sourceById.get("approvedVes").text;
  assert(tokens.meta.colorSetId === "color-srgb-05", "Token Color Set mismatch");
  assert(delivery.meta.id === "color-srgb-05", "Colour delivery Color Set mismatch");
  assert(recipes.colorSetId === "color-srgb-05", "Surface recipe Color Set mismatch");
  assert(
    recipes.boundary.includes("REFERENCE"),
    "Surface recipes must remain reference-only",
  );
  assert(
    JSON.stringify(tokens.values.product.citychat) ===
      JSON.stringify(delivery.productIdentityGradients.citychat),
    "CityChat product gradient differs between token and delivery sources",
  );
  assert(
    delivery.sources.scaleRegistry.sha256 === sourceById.get("ldsScales").descriptor.sha256,
    "Linked analytical-scale hash differs from colour delivery",
  );
  assert(
    identity.roleApprovals.filter(
      (approval) =>
        approval.approvalState === "approved" &&
        approval.backdrops.includes("lds_brand_beige_identity_band"),
    ).length >= 2,
    "Identity manifest lacks approved CityChat lockup roles on the LDS beige band",
  );
  const allAcceptanceIds = new Set(map.roles.flatMap((entry) => entry.acceptanceIds));
  for (const acceptanceId of allAcceptanceIds) {
    assert(vesText.includes(acceptanceId), "Acceptance ID is absent from approved VES: " + acceptanceId);
  }
  const scaleRole = map.roles.find((entry) => entry.roleId === "cc.data.scale");
  assert(scaleRole.status === "reference_fixture", "Analytical scale must remain a reference fixture");
  assert(
    map.authority.sharedAtlas.immutableUrl.includes("color-srgb-05.ui-20260821-05"),
    "Shared atlas link must be immutable and pinned",
  );
}

function resolveLocator(locator, theme, sourceById) {
  const source = sourceById.get(locator.sourceId);
  if (source.descriptor.availability === "linked_not_vendored") {
    return {
      kind: "reference",
      display: source.descriptor.immutableUrl + locator.pointer,
      href: source.descriptor.immutableUrl,
      css: null,
      raw: null,
    };
  }
  const raw = locator.pointer
    ? resolvePointer(source.json, locator.pointer)
    : resolveCssVariable(source.cssThemes, locator.cssVariable, theme);
  return {
    kind: "resolved",
    display: displayValue(raw),
    css: cssValue(raw),
    raw,
  };
}

function renderSwatch(result, theme) {
  if (!result.css) return "";
  return (
    '<span class="cc-atlas__swatch" data-theme="' +
    theme +
    '" style="background:' +
    escapeAttribute(result.css) +
    '" aria-hidden="true"></span>'
  );
}

function renderSeries(series) {
  return (
    '<div class="cc-atlas__series" data-registry-id="' +
    escapeAttribute(series.registryId) +
    '">' +
    series.values
      .map(
        (entry) =>
          '<span class="cc-atlas__series-item" data-series-id="' +
          escapeAttribute(entry.id) +
          '">' +
          '<i style="background:' +
          escapeAttribute(entry.light) +
          '" aria-hidden="true"></i>' +
          '<i style="background:' +
          escapeAttribute(entry.dark) +
          '" aria-hidden="true"></i>' +
          "<code>" +
          escapeHtml(entry.id + " · " + entry.cue) +
          "</code></span>",
      )
      .join("") +
    "</div>"
  );
}

function renderBinding(binding, sourceById) {
  const light = resolveLocator(binding.sourceByTheme.light, "light", sourceById);
  const dark = resolveLocator(binding.sourceByTheme.dark, "dark", sourceById);
  if (light.raw && light.raw.registryId && Array.isArray(light.raw.values)) {
    return (
      '<li data-slot="' +
      escapeAttribute(binding.slot) +
      '"><code>' +
      escapeHtml(binding.implementation) +
      "</code>" +
      renderSeries(light.raw) +
      "</li>"
    );
  }
  if (light.kind === "reference") {
    return (
      '<li data-slot="' +
      escapeAttribute(binding.slot) +
      '"><code>' +
      escapeHtml(binding.implementation) +
      '</code><a href="' +
      escapeAttribute(light.href) +
      '">' +
      escapeHtml("Pinned upstream LUT registry") +
      "</a></li>"
    );
  }
  return (
    '<li data-slot="' +
    escapeAttribute(binding.slot) +
    '"><code>' +
    escapeHtml(binding.implementation) +
    "</code>" +
    '<span class="cc-atlas__theme"><b>Light</b>' +
    renderSwatch(light, "light") +
    "<code>" +
    escapeHtml(light.display) +
    "</code></span>" +
    '<span class="cc-atlas__theme"><b>Dark</b>' +
    renderSwatch(dark, "dark") +
    "<code>" +
    escapeHtml(dark.display) +
    "</code></span></li>"
  );
}

function renderRole(roleRecord, sourceById) {
  const bindings = roleRecord.bindings.length
    ? "<ul>" + roleRecord.bindings.map((entry) => renderBinding(entry, sourceById)).join("") + "</ul>"
    : '<p class="cc-atlas__omitted">No binding / ไม่มีการผูกสี</p>';
  const cue = roleRecord.redundantCue.length
    ? '<p class="cc-atlas__cue"><strong>ไม่ใช้สีอย่างเดียว / Never colour alone:</strong> ' +
      escapeHtml(roleRecord.redundantCue.join(" · ")) +
      "</p>"
    : "";
  return (
    '<article class="cc-atlas__role" id="' +
    escapeAttribute(roleRecord.roleId) +
    '" data-role-id="' +
    escapeAttribute(roleRecord.roleId) +
    '" data-status="' +
    escapeAttribute(roleRecord.status) +
    '" data-policy="' +
    escapeAttribute(roleRecord.policy) +
    '">' +
    "<header><p>" +
    escapeHtml(roleRecord.roleId) +
    " · " +
    escapeHtml(roleRecord.status) +
    "</p><h3>" +
    escapeHtml(roleRecord.label.th) +
    " / " +
    escapeHtml(roleRecord.label.en) +
    "</h3></header>" +
    "<p>" +
    escapeHtml(roleRecord.job.th) +
    "<br><span lang=\"en\">" +
    escapeHtml(roleRecord.job.en) +
    "</span></p>" +
    '<p class="cc-atlas__when"><strong>ใช้เมื่อ / Use when:</strong> ' +
    escapeHtml(roleRecord.useWhen.th) +
    ' <span lang="en">/ ' +
    escapeHtml(roleRecord.useWhen.en) +
    "</span></p>" +
    bindings +
    cue +
    "</article>"
  );
}

function buildFragment(map, sourceById) {
  const navigation = map.router
    .map(
      (entry) =>
        '<a href="#' +
        escapeAttribute(entry.routerId) +
        '">' +
        escapeHtml(entry.label.th) +
        '<span lang="en">' +
        escapeHtml(entry.label.en) +
        "</span></a>",
    )
    .join("");
  const sections = map.router
    .map((entry) => {
      const familyRoles = map.roles.filter((roleRecord) => roleRecord.family === entry.family);
      return (
        '<section class="cc-atlas__family" id="' +
        escapeAttribute(entry.routerId) +
        '" data-family="' +
        escapeAttribute(entry.family) +
        '"><header><p>' +
        escapeHtml(entry.question.th) +
        '<br><span lang="en">' +
        escapeHtml(entry.question.en) +
        "</span></p><h2>" +
        escapeHtml(entry.label.th) +
        " / " +
        escapeHtml(entry.label.en) +
        "</h2></header>" +
        familyRoles.map((roleRecord) => renderRole(roleRecord, sourceById)).join("") +
        "</section>"
      );
    })
    .join("");
  return (
    '<!-- Generated by tools/generate-citychat-color-atlas.mjs; do not hand-edit. -->\n' +
    '<section class="cc-atlas" data-map-version="' +
    escapeAttribute(map.mapVersion) +
    '" data-mode="product_usage_overlay">\n' +
    '<header class="cc-atlas__intro"><p>SOURCE_LIMITED · 45 roles · 7 routes</p>' +
    "<h1>เลือกสีจากหน้าที่ / Choose colour by job</h1>" +
    "<p>CityChat ใช้สีจาก LDS ที่ปักหมุดไว้ ไม่สร้างพาเลตต์ใหม่ " +
    '<span lang="en">CityChat uses the pinned LDS sources; it does not create a second palette.</span></p>' +
    '<a href="' +
    escapeAttribute(map.authority.sharedAtlas.immutableUrl) +
    '">ดู LDS Color Atlas ฉบับเต็ม / Open the complete LDS Color Atlas</a></header>\n' +
    '<nav class="cc-atlas__router" aria-label="Color role router">' +
    navigation +
    "</nav>\n" +
    sections +
    "\n</section>\n"
  );
}

function buildQa(inputs, fragment) {
  const familyCounts = countBy(inputs.map.roles, "family");
  const statusCounts = { ...EXPECTED_STATUS_COUNTS };
  return {
    schemaVersion: "0.6.1",
    qaId: "citychat-color-atlas-generation-v0.6.1",
    generator: "tools/generate-citychat-color-atlas.mjs",
    result: "pass",
    artifactBuildId: inputs.map.artifactBuildId,
    mode: inputs.map.mode,
    counts: {
      roles: inputs.map.roles.length,
      routers: inputs.map.router.length,
      bindings: inputs.map.roles.reduce((sum, entry) => sum + entry.bindings.length, 0),
      familyCounts,
      statusCounts,
    },
    hashes: {
      roleMapSha256: sha256(inputs.mapText),
      schemaSha256: sha256(inputs.schemaText),
      generatorSha256: sha256(inputs.generatorText),
      generatedFragmentSha256: sha256(fragment),
      sources: inputs.sourceEvidence,
    },
    checks: [
      { id: "CC-COLOR-ATLAS-01", status: "pass", evidence: "45 unique governed role IDs" },
      { id: "CC-COLOR-ATLAS-02", status: "pass", evidence: "7 bilingual job-first router destinations" },
      { id: "CC-COLOR-ATLAS-03", status: "pass", evidence: "all local source hashes and locators resolved" },
      { id: "CC-COLOR-ATLAS-04", status: "pass", evidence: "no raw colour or runtime mixing in role map" },
      { id: "CC-COLOR-ATLAS-05", status: "pass", evidence: "semantic, source, map, and data roles include redundant cues" },
      { id: "CC-COLOR-ATLAS-06", status: "pass", evidence: "analytical scale remains linked reference_fixture" },
      { id: "CC-COLOR-ATLAS-07", status: "pass", evidence: "unapproved supporting asset colour remains omitted" },
      { id: "CC-COLOR-ATLAS-08", status: "pass", evidence: "generated fragment is deterministic and source-resolved" },
    ],
  };
}

async function main() {
  const inputs = await loadInputs();
  validateMap(inputs);
  const fragment = buildFragment(inputs.map, inputs.sourceById);
  assert(!fragment.toLowerCase().includes("color-mix("), "Generated fragment contains runtime mixing");
  assert(
    (fragment.match(/class="cc-atlas__role"/g) || []).length === 45,
    "Generated fragment must contain 45 role articles",
  );
  assert(
    (fragment.match(/class="cc-atlas__family"/g) || []).length === 7,
    "Generated fragment must contain seven router sections",
  );
  const qa = JSON.stringify(buildQa(inputs, fragment), null, 2) + "\n";

  if (CHECK_MODE) {
    const [committedFragment, committedQa] = await Promise.all([
      readFile(FRAGMENT_PATH, "utf8"),
      readFile(QA_PATH, "utf8"),
    ]);
    assert(committedFragment === fragment, "Generated CityChat color atlas fragment is stale");
    assert(committedQa === qa, "Color atlas generation QA report is stale");
    process.stdout.write(
      "PASS citychat-color-atlas --check · 45 roles · 7 routes · " +
        inputs.map.roles.reduce((sum, entry) => sum + entry.bindings.length, 0) +
        " bindings · fragment " +
        sha256(fragment) +
        "\n",
    );
    return;
  }

  await Promise.all([
    writeFile(FRAGMENT_PATH, fragment, "utf8"),
    writeFile(QA_PATH, qa, "utf8"),
  ]);
  process.stdout.write(
    "WROTE CityChat Color Usage Atlas · 45 roles · 7 routes · " +
      inputs.map.roles.reduce((sum, entry) => sum + entry.bindings.length, 0) +
      " bindings · fragment " +
      sha256(fragment) +
      "\n",
  );
}

await main();

#!/usr/bin/env node
import { createHash } from "node:crypto";
import { mkdirSync, writeFileSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const output = path.join(root, "deployment/assets/icons/material-symbols-rounded-citychat-v368.ttf");
const sourceUrl = "https://fonts.gstatic.com/l/font?kit=syl0-zNym6YjUruM-QrEh7-nyTnjDwKNJ_190FjpZIvDmUSVOK7BDB_Qb9vUSzq3wzLK-P0J-V_Zs-QtQth3-jOcbTCVpeRL2w5rwZu2rNmlXxKRP8cDespv7zECSChFHVta9xvedDQEP5diBtrp4FjgZY7dyKYtWU6l2YTz&skey=70ddea8fe54d532e&v=v368";
const expectedSha256 = "42cd00d98dd631ddf6b3d5a47ba34e6eed83d2a6e3fd35ef5f4f8e0e6632ba30";
const expectedBytes = 5248;

const response = await fetch(sourceUrl);
if (!response.ok) throw new Error(`Material Symbols download failed: ${response.status}`);
const bytes = Buffer.from(await response.arrayBuffer());
const sha256 = createHash("sha256").update(bytes).digest("hex");
if (bytes.length !== expectedBytes || sha256 !== expectedSha256) {
  throw new Error(`Unexpected Material Symbols bytes: ${bytes.length}/${sha256}`);
}

mkdirSync(path.dirname(output), { recursive: true });
writeFileSync(output, bytes);
console.log(`Imported ${path.relative(root, output)} (${bytes.length} bytes, ${sha256}).`);

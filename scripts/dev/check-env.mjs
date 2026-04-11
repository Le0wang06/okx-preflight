#!/usr/bin/env node

import fs from "node:fs";
import path from "node:path";
import process from "node:process";

const cwd = process.cwd();
const fileArgIndex = process.argv.findIndex((arg) => arg === "--file");
const envFile = fileArgIndex >= 0 ? process.argv[fileArgIndex + 1] : ".env.local";
const envPath = path.join(cwd, envFile);
const requireAuth = process.argv.includes("--require-auth");

const requiredCoreKeys = ["OKX_API_BASE_URL"];
const authKeys = ["OKX_API_KEY", "OKX_SECRET_KEY", "OKX_PASSPHRASE"];

if (!fs.existsSync(envPath)) {
  console.error("Missing .env.local. Copy from .env.example first.");
  process.exit(1);
}

const content = fs.readFileSync(envPath, "utf-8");
const lines = content.split(/\r?\n/);
const values = new Map();

for (const line of lines) {
  const trimmed = line.trim();
  if (!trimmed || trimmed.startsWith("#")) {
    continue;
  }

  const normalized = trimmed.startsWith("export ") ? trimmed.slice(7).trim() : trimmed;
  const idx = normalized.indexOf("=");
  if (idx === -1) {
    continue;
  }

  const key = normalized.slice(0, idx).trim();
  const value = normalized
    .slice(idx + 1)
    .trim()
    .replace(/^"(.*)"$/, "$1")
    .replace(/^'(.*)'$/, "$1");
  values.set(key, value);
}

const missing = [];
for (const key of requiredCoreKeys) {
  if (!values.has(key) || values.get(key) === "") {
    missing.push(key);
  }
}

if (requireAuth) {
  for (const key of authKeys) {
    if (!values.has(key) || values.get(key) === "") {
      missing.push(key);
    }
  }
} else {
  const presentAuth = authKeys.filter((key) => values.has(key) && values.get(key) !== "");
  if (presentAuth.length > 0 && presentAuth.length < authKeys.length) {
    missing.push(...authKeys.filter((key) => !presentAuth.includes(key)));
  }
}

const apiBaseUrl = values.get("OKX_API_BASE_URL");
if (apiBaseUrl) {
  try {
    const parsed = new URL(apiBaseUrl);
    if (!["http:", "https:"].includes(parsed.protocol)) {
      missing.push("OKX_API_BASE_URL(valid http/https URL)");
    }
  } catch {
    missing.push("OKX_API_BASE_URL(valid URL)");
  }
}

if (missing.length > 0) {
  console.error(`Environment check failed. Missing keys: ${missing.join(", ")}`);
  process.exit(1);
}

console.log(
  `Environment check passed (${requireAuth ? "auth-required" : "dev-mode"}) on ${envFile}.`,
);

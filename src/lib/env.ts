import "server-only";
import { z } from "zod";

const serverEnvSchema = z.object({
  NODE_ENV: z.enum(["development", "test", "production"]).default("development"),
  OKX_API_BASE_URL: z.string().url().default("https://web3.okx.com"),
  OKX_API_KEY: z.string().trim().min(1).optional(),
  OKX_SECRET_KEY: z.string().trim().min(1).optional(),
  OKX_PASSPHRASE: z.string().trim().min(1).optional(),
  OKX_PROJECT_ID: z.string().trim().min(1).optional(),
});

let cachedEnv: z.infer<typeof serverEnvSchema> | null = null;

function normalizeOptional(value: string | undefined): string | undefined {
  if (!value) {
    return undefined;
  }
  const trimmed = value.trim();
  return trimmed.length === 0 ? undefined : trimmed;
}

export function getEnv() {
  if (cachedEnv) {
    return cachedEnv;
  }

  const parsed = serverEnvSchema.safeParse({
    NODE_ENV: process.env.NODE_ENV,
    OKX_API_BASE_URL: process.env.OKX_API_BASE_URL,
    OKX_API_KEY: normalizeOptional(process.env.OKX_API_KEY),
    OKX_SECRET_KEY: normalizeOptional(process.env.OKX_SECRET_KEY),
    OKX_PASSPHRASE: normalizeOptional(process.env.OKX_PASSPHRASE),
    OKX_PROJECT_ID: normalizeOptional(process.env.OKX_PROJECT_ID),
  });

  if (!parsed.success) {
    throw new Error(`Invalid environment variables: ${parsed.error.message}`);
  }

  cachedEnv = parsed.data;
  return cachedEnv;
}

export function hasOkxCredentials() {
  const values = getEnv();
  return Boolean(values.OKX_API_KEY && values.OKX_SECRET_KEY && values.OKX_PASSPHRASE);
}

export function getOkxCredentials() {
  const values = getEnv();

  const fields = {
    OKX_API_KEY: values.OKX_API_KEY,
    OKX_SECRET_KEY: values.OKX_SECRET_KEY,
    OKX_PASSPHRASE: values.OKX_PASSPHRASE,
  };

  const providedCount = Object.values(fields).filter(Boolean).length;
  if (providedCount === 0) {
    return null;
  }

  if (providedCount !== Object.keys(fields).length) {
    const missing = Object.entries(fields)
      .filter(([, value]) => !value)
      .map(([key]) => key);
    throw new Error(`Incomplete OKX credentials. Missing: ${missing.join(", ")}`);
  }

  return {
    apiKey: values.OKX_API_KEY as string,
    secretKey: values.OKX_SECRET_KEY as string,
    passphrase: values.OKX_PASSPHRASE as string,
    projectId: values.OKX_PROJECT_ID,
  };
}

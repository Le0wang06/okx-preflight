import { z } from "zod";

const serverEnvSchema = z.object({
  NODE_ENV: z.enum(["development", "test", "production"]).default("development"),
  OKX_API_BASE_URL: z.string().url().default("https://web3.okx.com"),
  OKX_API_KEY: z.string().optional(),
  OKX_SECRET_KEY: z.string().optional(),
  OKX_PASSPHRASE: z.string().optional(),
  OKX_PROJECT_ID: z.string().optional(),
});

const env = serverEnvSchema.safeParse(process.env);

export function getEnv() {
  if (!env.success) {
    throw new Error(`Invalid environment variables: ${env.error.message}`);
  }
  return env.data;
}

export function hasOkxCredentials() {
  const values = getEnv();
  return Boolean(values.OKX_API_KEY && values.OKX_SECRET_KEY && values.OKX_PASSPHRASE);
}

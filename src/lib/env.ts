import { z } from "zod";

const serverEnvSchema = z.object({
  NODE_ENV: z.enum(["development", "test", "production"]).default("development"),
  DATABASE_URL: z.string().url(),
  OKX_API_KEY: z.string().min(1),
  OKX_SECRET_KEY: z.string().min(1),
  OKX_PASSPHRASE: z.string().min(1),
});

export const env = serverEnvSchema.safeParse(process.env);

export function getEnv() {
  if (!env.success) {
    throw new Error(`Invalid environment variables: ${env.error.message}`);
  }
  return env.data;
}

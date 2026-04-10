import "server-only";
import { getEnv, getOkxCredentials } from "@/lib/env";
import { AppError } from "@/server/errors";
import { buildOkxSignature } from "@/server/okx/signature";

type HttpMethod = "GET" | "POST" | "PUT" | "DELETE";

type RequestOptions = {
  method?: HttpMethod;
  query?: Record<string, string | number | boolean>;
  body?: unknown;
  requiresAuth?: boolean;
  timeoutMs?: number;
  maxRetries?: number;
};

function buildQueryString(query?: RequestOptions["query"]) {
  if (!query || Object.keys(query).length === 0) {
    return "";
  }

  const params = new URLSearchParams();
  for (const [key, value] of Object.entries(query)) {
    params.append(key, String(value));
  }
  return `?${params.toString()}`;
}

function normalizePath(path: string) {
  if (!path.startsWith("/")) {
    return `/${path}`;
  }
  return path;
}

function wait(ms: number) {
  return new Promise((resolve) => {
    setTimeout(resolve, ms);
  });
}

function isRetryableStatus(status: number) {
  return status === 429 || status >= 500;
}

export async function okxRequest<T>(path: string, options: RequestOptions = {}): Promise<T> {
  const env = getEnv();
  const method = options.method ?? "GET";
  const timeoutMs = options.timeoutMs ?? 15_000;
  const maxRetries = options.maxRetries ?? 2;
  const normalizedPath = normalizePath(path);
  const queryString = buildQueryString(options.query);
  const requestPath = `${normalizedPath}${queryString}`;
  const url = `${env.OKX_API_BASE_URL}${requestPath}`;
  const body = options.body ? JSON.stringify(options.body) : "";

  let headers: HeadersInit = {
    "Content-Type": "application/json",
  };

  if (options.requiresAuth) {
    const credentials = getOkxCredentials();
    if (!credentials) {
      throw new AppError({
        message: "Missing OKX API credentials. Set OKX_API_KEY, OKX_SECRET_KEY, OKX_PASSPHRASE.",
        code: "OKX_AUTH_MISSING",
        statusCode: 500,
      });
    }

    const timestamp = new Date().toISOString();
    headers = {
      ...headers,
      "OK-ACCESS-KEY": credentials.apiKey,
      "OK-ACCESS-PASSPHRASE": credentials.passphrase,
      "OK-ACCESS-TIMESTAMP": timestamp,
      "OK-ACCESS-SIGN": buildOkxSignature({
        timestamp,
        method,
        requestPath,
        body,
        secretKey: credentials.secretKey,
      }),
    };

    if (credentials.projectId) {
      headers = {
        ...headers,
        "OK-ACCESS-PROJECT": credentials.projectId,
      };
    }
  }

  for (let attempt = 0; attempt <= maxRetries; attempt += 1) {
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), timeoutMs);

    try {
      const response = await fetch(url, {
        method,
        headers,
        body: method === "GET" ? undefined : body,
        cache: "no-store",
        signal: controller.signal,
      });

      if (!response.ok) {
        const text = await response.text();
        const retryable = isRetryableStatus(response.status);

        if (retryable && attempt < maxRetries) {
          await wait(300 * (attempt + 1));
          continue;
        }

        throw new AppError({
          message: `OKX request failed (${response.status})`,
          code: "OKX_REQUEST_FAILED",
          statusCode: response.status,
          retryable,
          details: text,
        });
      }

      return (await response.json()) as T;
    } catch (error) {
      const isAbortError = error instanceof Error && error.name === "AbortError";
      const retryable = isAbortError;

      if (retryable && attempt < maxRetries) {
        await wait(300 * (attempt + 1));
        continue;
      }

      if (error instanceof AppError) {
        throw error;
      }

      throw new AppError({
        message: isAbortError ? "OKX request timed out." : "Unexpected error while calling OKX.",
        code: isAbortError ? "OKX_TIMEOUT" : "OKX_UNKNOWN_ERROR",
        statusCode: 500,
        retryable,
        details: error instanceof Error ? error.message : String(error),
      });
    } finally {
      clearTimeout(timer);
    }
  }

  throw new AppError({
    message: "OKX request failed after retries.",
    code: "OKX_RETRY_EXHAUSTED",
    statusCode: 503,
    retryable: true,
  });
}

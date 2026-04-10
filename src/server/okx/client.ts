import { getEnv, hasOkxCredentials } from "@/lib/env";
import { buildOkxSignature } from "@/server/okx/signature";

type HttpMethod = "GET" | "POST" | "PUT" | "DELETE";

type RequestOptions = {
  method?: HttpMethod;
  query?: Record<string, string | number | boolean>;
  body?: unknown;
  requiresAuth?: boolean;
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

export async function okxRequest<T>(path: string, options: RequestOptions = {}): Promise<T> {
  const env = getEnv();
  const method = options.method ?? "GET";
  const queryString = buildQueryString(options.query);
  const requestPath = `${path}${queryString}`;
  const url = `${env.OKX_API_BASE_URL}${requestPath}`;
  const body = options.body ? JSON.stringify(options.body) : "";

  let headers: HeadersInit = {
    "Content-Type": "application/json",
  };

  if (options.requiresAuth) {
    if (!hasOkxCredentials()) {
      throw new Error("Missing OKX API credentials. Set OKX_API_KEY, OKX_SECRET_KEY, OKX_PASSPHRASE.");
    }

    const timestamp = new Date().toISOString();
    headers = {
      ...headers,
      "OK-ACCESS-KEY": env.OKX_API_KEY as string,
      "OK-ACCESS-PASSPHRASE": env.OKX_PASSPHRASE as string,
      "OK-ACCESS-TIMESTAMP": timestamp,
      "OK-ACCESS-SIGN": buildOkxSignature({
        timestamp,
        method,
        requestPath,
        body,
        secretKey: env.OKX_SECRET_KEY as string,
      }),
    };

    if (env.OKX_PROJECT_ID) {
      headers = {
        ...headers,
        "OK-ACCESS-PROJECT": env.OKX_PROJECT_ID,
      };
    }
  }

  const response = await fetch(url, {
    method,
    headers,
    body: method === "GET" ? undefined : body,
    cache: "no-store",
  });

  if (!response.ok) {
    const text = await response.text();
    throw new Error(`OKX request failed (${response.status}): ${text}`);
  }

  return (await response.json()) as T;
}

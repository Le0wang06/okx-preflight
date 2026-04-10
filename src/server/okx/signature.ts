import "server-only";
import crypto from "node:crypto";

type OkxSignatureParams = {
  timestamp: string;
  method: "GET" | "POST" | "PUT" | "DELETE";
  requestPath: string;
  body?: string;
  secretKey: string;
};

export function buildOkxSignature({
  timestamp,
  method,
  requestPath,
  body = "",
  secretKey,
}: OkxSignatureParams) {
  const message = `${timestamp}${method}${requestPath}${body}`;
  return crypto.createHmac("sha256", secretKey).update(message).digest("base64");
}

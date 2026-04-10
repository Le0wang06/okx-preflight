import "server-only";

export class AppError extends Error {
  code: string;
  statusCode: number;
  retryable: boolean;
  details?: unknown;

  constructor(params: {
    message: string;
    code: string;
    statusCode?: number;
    retryable?: boolean;
    details?: unknown;
  }) {
    super(params.message);
    this.name = "AppError";
    this.code = params.code;
    this.statusCode = params.statusCode ?? 500;
    this.retryable = params.retryable ?? false;
    this.details = params.details;
  }
}

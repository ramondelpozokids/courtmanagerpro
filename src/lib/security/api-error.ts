/**
 * Respuestas de error de API homogéneas: formato, código, logging y JSON.
 */
import { NextResponse } from 'next/server';

export type ApiErrorCode =
  | 'UNAUTHORIZED'
  | 'FORBIDDEN'
  | 'BAD_REQUEST'
  | 'NOT_FOUND'
  | 'RATE_LIMITED'
  | 'INTERNAL'
  | 'MISCONFIGURED';

export type ApiErrorBody = {
  error: string;
  code: ApiErrorCode;
  details?: Record<string, unknown>;
};

const STATUS_BY_CODE: Record<ApiErrorCode, number> = {
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  BAD_REQUEST: 400,
  NOT_FOUND: 404,
  RATE_LIMITED: 429,
  INTERNAL: 500,
  MISCONFIGURED: 500,
};

export function logApiError(
  code: ApiErrorCode,
  message: string,
  details?: Record<string, unknown>
): void {
  const payload = { code, message, ...(details || {}) };
  if (code === 'INTERNAL' || code === 'MISCONFIGURED') {
    console.error('[api-error]', payload);
  } else {
    console.warn('[api-error]', payload);
  }
}

export function apiError(
  code: ApiErrorCode,
  message: string,
  options?: {
    details?: Record<string, unknown>;
    headers?: HeadersInit;
    status?: number;
    log?: boolean;
  }
): NextResponse {
  const status = options?.status ?? STATUS_BY_CODE[code];
  if (options?.log !== false) {
    logApiError(code, message, options?.details);
  }
  const body: ApiErrorBody = {
    error: message,
    code,
  };
  if (options?.details) body.details = options.details;
  return NextResponse.json(body, { status, headers: options?.headers });
}

export function unauthorized(message = 'Unauthorized'): NextResponse {
  return apiError('UNAUTHORIZED', message, { log: false });
}

export function forbidden(message = 'Forbidden'): NextResponse {
  return apiError('FORBIDDEN', message, { log: false });
}

export function badRequest(message: string, details?: Record<string, unknown>): NextResponse {
  return apiError('BAD_REQUEST', message, { details, log: false });
}

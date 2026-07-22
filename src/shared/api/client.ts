import { apiBaseUrl } from '@/shared/config/appMode';

import { clearAuthSession, getAuthToken } from './session';

type RequestOptions = Omit<RequestInit, 'body'> & {
  body?: FormData | Record<string, unknown>;
  query?: Record<string, string | undefined>;
};

type ApiErrorPayload = {
  error?: {
    code?: string;
    message?: string;
  };
};

export class ApiError extends Error {
  code: string;
  status: number;

  constructor(status: number, code: string, message: string) {
    super(message);
    this.code = code;
    this.status = status;
  }
}

export function resolveApiUrl(path: string): string {
  if (/^https?:\/\//i.test(path)) {
    return path;
  }

  return `${apiBaseUrl}${path.startsWith('/') ? path : `/${path}`}`;
}

export async function apiRequest<T>(path: string, options: RequestOptions = {}): Promise<T> {
  
  const url = new URL(resolveApiUrl(path));

  Object.entries(options.query ?? {}).forEach(([key, value]) => {
    if (value) {
      url.searchParams.set(key, value);
    }
  });

  const headers = new Headers(options.headers);
  const token = await getAuthToken();
  const body = options.body instanceof FormData ? options.body : JSON.stringify(options.body ?? {});
  let response : Response;

  if (!(options.body instanceof FormData)) {
    headers.set('Content-Type', 'application/json');
  }

  if (token) {
    headers.set('Authorization', `Bearer ${token}`);
  }


  try{
     response = await fetch(url.toString(), {
        ...options,
        body: options.method && options.method !== 'GET' ? body : undefined,
        headers,
      });
      
  }catch(error){
    console.error('apiRequest error', error);
    throw new ApiError(0, 'network_error', 'Erro de comunicação com o servidor');
  }

  if (response.status === 204) {
    return undefined as T;
  }

  const text = await response.text();
  const payload = text ? (JSON.parse(text) as ApiErrorPayload | T) : undefined;

  if (!response.ok) {
    const errorPayload = payload as ApiErrorPayload | undefined;
    const code = errorPayload?.error?.code ?? `http_${response.status}`;

    if (response.status === 401) {
      await clearAuthSession();
    }

    throw new ApiError(response.status, code, errorPayload?.error?.message ?? 'Erro de comunicação com o servidor');
  }

  return payload as T;
}

export const API_BASE =
    process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:3000";

const API_TIMEOUT_MS = Number.parseInt(
    process.env.NEXT_PUBLIC_API_TIMEOUT ?? "30000",
    10
);
const DEFAULT_TIMEOUT =
    Number.isFinite(API_TIMEOUT_MS) && API_TIMEOUT_MS > 0
        ? API_TIMEOUT_MS
        : 30000;

type Method = "GET" | "POST" | "PUT" | "PATCH" | "DELETE";

export type JsonValue =
    | string
    | number
    | boolean
    | null
    | { [key: string]: JsonValue | undefined }
    | JsonValue[];

export interface ApiOptions {
    method?: Method;
    body?: JsonValue;
    headers?: Record<string, string>;
    cache?: RequestCache;
    credentials?: RequestCredentials;
    timeout?: number;
}

export class ApiError extends Error {
    constructor(
        message: string,
        public status: number,
        public statusText: string
    ) {
        super(message);
        this.name = "ApiError";
    }
}

export async function api<TResponse>(
    path: string,
    opts: ApiOptions = {}
): Promise<TResponse | null> {
    const {
        method = "GET",
        body,
        headers = {},
        cache = "no-store",
        credentials = "include",
        timeout = DEFAULT_TIMEOUT,
    } = opts;

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), timeout);

    try {
        const res = await fetch(`${API_BASE}${path}`, {
            method,
            headers: {
                ...(body !== undefined && {
                    "Content-Type": "application/json",
                }),
                ...headers,
            },
            credentials,
            body: body === undefined ? undefined : JSON.stringify(body),
            cache,
            signal: controller.signal,
        });

        clearTimeout(timeoutId);

        if (!res.ok) {
            let errorMsg: string;
            try {
                const errorData = await res.json();
                errorMsg =
                    errorData?.message ??
                    errorData?.error ??
                    JSON.stringify(errorData);
            } catch {
                errorMsg = await res.text().catch(() => res.statusText);
            }
            throw new ApiError(
                errorMsg || `HTTP ${res.status}`,
                res.status,
                res.statusText
            );
        }

        if (res.status === 204) {
            return null;
        }

        return (await res.json()) as TResponse;
    } catch (error) {
        clearTimeout(timeoutId);
        if (error instanceof Error && error.name === "AbortError") {
            throw new Error(`Request timeout after ${timeout}ms`);
        }
        throw error;
    }
}
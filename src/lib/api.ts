export const API_BASE =
    process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:3000";

type Method = "GET" | "POST" | "PUT" | "PATCH" | "DELETE";

export async function api<T>(
    path: string,
    opts: { method?: Method; body?: any; headers?: Record<string, string> } = {}
): Promise<T> {
    const { method = "GET", body, headers = {} } = opts;

    const res = await fetch(`${API_BASE}${path}`, {
        method,
        headers: {
            "Content-Type": "application/json",
            ...headers,
        },
        credentials: "include",
        body: body ? JSON.stringify(body) : undefined,
        cache: "no-store",
    });

    if (!res.ok) {
        const msg = await res.text().catch(() => res.statusText);
        throw new Error(msg || `HTTP ${res.status}`);
    }

    return (await res.json()) as T;
}

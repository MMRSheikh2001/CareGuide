

export class ApiError extends Error {
    constructor(message, status, errors = []) {
        super(message);
        this.status = status;
        this.errors = errors; // per-field validation errors from the backend
    }
}

export async function api(path, { method = "GET", body, params } = {}) {
    // Drop empty filter values so they don't end up in the URL
    const query = params
        ? new URLSearchParams(
            Object.entries(params).filter(([, v]) => v !== "" && v != null)
        ).toString()
        : "";

    const res = await fetch(`/api${path}${query ? `?${query}` : ""}`, {
        method,
        credentials: "include",
        headers: body ? { "Content-Type": "application/json" } : undefined,
        body: body ? JSON.stringify(body) : undefined,
    });

    const json = await res.json().catch(() => ({}));

    if (!res.ok) {
        throw new ApiError(json.message || "Something went wrong", res.status, json.errors);
    }
    return json;
}
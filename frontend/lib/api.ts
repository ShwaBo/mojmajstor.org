export const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

/**
 * Generic fetch wrapper for API calls to the FastAPI backend.
 * Currently it just forwards the relative endpoint to the configured URL.
 * 
 * In the future, this can be extended to automatically attach 
 * the Clerk JWT token in the Authorization header.
 * 
 * @param endpoint - The API route starting with a slash, e.g. "/categories/"
 * @param init - Standard fetch init options
 */
export async function fetchApi(endpoint: string, init?: RequestInit) {
    const response = await fetch(`${API_URL}${endpoint}`, {
        ...init,
        headers: {
            "Content-Type": "application/json",
            ...init?.headers,
        },
    });

    if (!response.ok) {
        throw new Error(`API Error: ${response.status} - ${response.statusText}`);
    }

    return response.json();
}

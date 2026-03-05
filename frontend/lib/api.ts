export const BASE_URL = process.env.NEXT_PUBLIC_API_URL || "https://mojmajstororg-production.up.railway.app";

/**
 * Generic fetch wrapper for API calls to the FastAPI backend.
 * 
 * @param endpoint - The API route starting with a slash, e.g. "/categories"
 * @param init - Standard fetch init options
 */
export async function fetchData(endpoint: string, init?: RequestInit) {
    try {
        const response = await fetch(`${BASE_URL}${endpoint}`, {
            ...init,
            headers: {
                "Content-Type": "application/json",
                ...init?.headers,
            },
        });

        if (!response.ok) {
            throw new Error(`API Error: ${response.status} - ${response.statusText}`);
        }

        return await response.json();
    } catch (error) {
        console.error(`[fetchData Error] on endpoint ${endpoint}:`, error);
        throw error;
    }
}

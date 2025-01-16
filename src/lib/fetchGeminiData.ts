export interface GeminiRequest {
    method: 'GET' | 'POST' | 'PUT' | 'DELETE';
    endpoint: string;
    data?: any;
}

export const fetchGeminiData = async <T>(request: GeminiRequest): Promise<T> => {
    const response = await fetch('/api/gemini', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(request),
    });

    if (!response.ok) {
        throw new Error(`API Error: ${response.statusText}`);
    }

    return response.json();
};

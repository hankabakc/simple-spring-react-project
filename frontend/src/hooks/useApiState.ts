import { useState, useCallback } from 'react';

type ApiState<T> = {
    data: T | null;
    loading: boolean;
    error: string | null;
    execute: (apiCall: () => Promise<T>) => Promise<{
        success: boolean;
        data?: T;
        error?: string;
    }>;
};

const useApiState = <T>(initialData: T | null = null): ApiState<T> => {
    const [data, setData] = useState<T | null>(initialData);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const execute = useCallback(async (apiCall: () => Promise<T>) => {
        setLoading(true);
        setError(null);

        try {
            const result = await apiCall();
            setData(result);
            return { success: true, data: result };
        } catch (err: any) {
            const message =
                err?.response?.data?.message || err?.message || 'An error occurred.';
            setError(message);
            return { success: false, error: message };
        } finally {
            setLoading(false);
        }
    }, []);

    return { data, loading, error, execute };
};

export default useApiState;

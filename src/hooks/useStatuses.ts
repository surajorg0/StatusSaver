import { useState, useEffect } from 'react';
import { type StatusMedia, fetchStatuses } from '../utils/mediaUtils';
import Saf from '../plugins/Saf';

export const useStatuses = (type: 'image' | 'video' | 'all' = 'all') => {
    const [statuses, setStatuses] = useState<StatusMedia[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const loadData = async () => {
        setLoading(true);
        try {
            // make sure access is granted
            await Saf.requestAccess();
            const all = await fetchStatuses();

            const filtered = all.filter((s) => {
                if (type === 'image') return s.type.startsWith('image');
                if (type === 'video') return s.type.startsWith('video');
                return true;
            });
            setStatuses(filtered);
            setError(null);
        } catch (err: any) {
            setError(err?.message || 'Permission denied or error fetching statuses.');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadData();
    }, []);

    return { statuses, loading, error, refetch: loadData };
};

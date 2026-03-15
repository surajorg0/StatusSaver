import { useState, useEffect } from 'react';
import { type StatusMedia, fetchStatuses } from '../utils/mediaUtils';
import Saf from '../plugins/Saf';

export const useStatuses = (type: 'image' | 'video' | 'all' = 'all', source: 'wa' | 'wab' | 'both' = 'both') => {
    const [statuses, setStatuses] = useState<StatusMedia[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const loadData = async () => {
        setLoading(true);
        try {
            let all: StatusMedia[] = [];

            if (source === 'wa' || source === 'both') {
                try {
                    await Saf.requestAccess({ type: 'wa' });
                    const wa = await fetchStatuses('wa');
                    all = [...all, ...wa];
                } catch (e) {
                    console.log('WA access failed or not requested yet');
                }
            }

            if (source === 'wab' || source === 'both') {
                try {
                    await Saf.requestAccess({ type: 'wab' });
                    const wab = await fetchStatuses('wab');
                    all = [...all, ...wab];
                } catch (e) {
                    console.log('WAB access failed or not requested yet');
                }
            }

            const filtered = all.filter((s) => {
                if (type === 'image') return s.type.startsWith('image');
                if (type === 'video') return s.type.startsWith('video');
                return true;
            });

            // Deduplicate by name? Some people might have both apps.
            const unique = Array.from(new Map(filtered.map(item => [item.name, item])).values());

            setStatuses(unique.sort((a, b) => b.lastModified - a.lastModified));
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

import { IonContent, IonPage } from '@ionic/react';
import { StatusGrid } from '../components/StatusGrid';
import { getCachedStatuses, type StatusMedia } from '../utils/mediaUtils';
import { useEffect, useState } from 'react';
import PageHeader from '../components/PageHeader';

const Saved: React.FC = () => {
    const [statuses, setStatuses] = useState<StatusMedia[]>([]);
    const [loading, setLoading] = useState(true);

    const loadData = async () => {
        setLoading(true);
        const data = await getCachedStatuses();
        setStatuses(data);
        setLoading(false);
    };

    useEffect(() => {
        loadData();
    }, []);

    return (
        <IonPage>
            <PageHeader title="Saved" onRefresh={loadData} loading={loading} />
            <IonContent fullscreen>
                <StatusGrid statuses={statuses} isLoading={loading} onRefresh={loadData} />
            </IonContent>
        </IonPage>
    );
};

export default Saved;

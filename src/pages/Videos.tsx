import { IonContent, IonPage } from '@ionic/react';
import { StatusGrid } from '../components/StatusGrid';
import { useStatuses } from '../hooks/useStatuses';
import PageHeader from '../components/PageHeader';

const Videos: React.FC = () => {
    const { statuses, loading, error, refetch } = useStatuses('video');

    return (
        <IonPage>
            <PageHeader title="Videos" onRefresh={refetch} loading={loading} />
            <IonContent fullscreen>
                {error ? (
                    <div className="flex flex-col items-center justify-center p-8 h-full bg-red-50 dark:bg-red-900/10">
                        <p className="text-red-500 text-center mb-4">{error}</p>
                        <button className="bg-green-500 text-white px-4 py-2 rounded-lg" onClick={refetch}>
                            Grant Permissions
                        </button>
                    </div>
                ) : (
                    <StatusGrid statuses={statuses} isLoading={loading} onRefresh={refetch} />
                )}
            </IonContent>
        </IonPage>
    );
};

export default Videos;

import React, { useState } from 'react';
import { PlayCircle, Download } from 'lucide-react';
import { saveStatusToGallery, type StatusMedia } from '../utils/mediaUtils';
import { IonLoading, IonToast, IonModal } from '@ionic/react';

interface Props {
    statuses: StatusMedia[];
    onRefresh?: () => void;
    isLoading?: boolean;
}

export const StatusGrid: React.FC<Props> = ({ statuses, isLoading }) => {
    const [selected, setSelected] = useState<StatusMedia | null>(null);
    const [saving, setSaving] = useState(false);
    const [toastMessage, setToastMessage] = useState('');

    const handleSave = async (media: StatusMedia) => {
        setSaving(true);
        const success = await saveStatusToGallery(media);
        setSaving(false);
        setToastMessage(success ? 'Saved successfully!' : 'Failed to save.');
    };

    if (isLoading) {
        return (
            <div className="flex-1 flex justify-center items-center h-full text-gray-400">
                Loading...
            </div>
        );
    }

    if (statuses.length === 0) {
        return (
            <div className="flex-1 flex justify-center items-center h-full text-gray-500">
                No statuses found. Open WhatsApp to view some!
            </div>
        );
    }

    return (
        <>
            <div className="grid grid-cols-3 gap-1 md:gap-2 p-1 md:p-2 auto-rows-[120px] md:auto-rows-[160px]">
                {statuses.map((media) => (
                    <div
                        key={media.id}
                        className="relative cursor-pointer hover:opacity-90 transition group overflow-hidden bg-gray-200 dark:bg-gray-800 rounded shadow"
                        onClick={() => setSelected(media)}
                    >
                        {media.type.startsWith('video') ? (
                            <>
                                <div className="absolute inset-0 flex items-center justify-center bg-black/30 z-10">
                                    <PlayCircle size={32} className="text-white opacity-80" />
                                </div>
                                <video
                                    src={media.uri}
                                    className="w-full h-full object-cover"
                                    preload="metadata"
                                    muted
                                    playsInline
                                />
                            </>
                        ) : (
                            <img src={media.uri} className="w-full h-full object-cover" alt="Status" loading="lazy" />
                        )}

                        <button
                            className="absolute bottom-2 right-2 bg-black/60 p-2 rounded-full text-white hover:bg-black/80 z-20"
                            onClick={(e) => { e.stopPropagation(); handleSave(media); }}
                        >
                            <Download size={18} />
                        </button>
                    </div>
                ))}
            </div>

            <IonToast
                isOpen={!!toastMessage}
                message={toastMessage}
                duration={2000}
                onDidDismiss={() => setToastMessage('')}
                position="bottom"
                color={toastMessage.includes('success') ? 'success' : 'danger'}
            />

            <IonModal isOpen={!!selected} onDidDismiss={() => setSelected(null)}>
                <div className="flex flex-col h-full bg-black text-white">
                    <div className="flex justify-between items-center p-4">
                        <button className="p-2" onClick={() => setSelected(null)}>Close</button>
                        <button
                            className="px-4 py-2 bg-green-500 rounded font-semibold flex items-center gap-2"
                            onClick={() => selected && handleSave(selected)}
                        >
                            <Download size={20} /> Save
                        </button>
                    </div>

                    <div className="flex-1 flex items-center justify-center p-0 bg-black">
                        {selected?.type.startsWith('video') ? (
                            <video src={selected.uri} controls autoPlay className="max-w-full max-h-full" />
                        ) : (
                            <img src={selected?.uri} className="max-w-full max-h-full object-contain" />
                        )}
                    </div>
                </div>
            </IonModal>

            <IonLoading isOpen={saving} message={'Saving...'} />
        </>
    );
};

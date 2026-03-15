import React, { useState } from 'react';
import { PlayCircle, Download } from 'lucide-react';
import { saveStatusToGallery, type StatusMedia } from '../utils/mediaUtils';
import { IonLoading, IonToast, IonModal, IonIcon } from '@ionic/react';
import { shareStatus } from '../utils/mediaUtils';
import { shareSocial, checkmarkCircle, ellipseOutline } from 'ionicons/icons';

interface Props {
    statuses: StatusMedia[];
    onRefresh?: () => void;
    isLoading?: boolean;
}

export const StatusGrid: React.FC<Props> = ({ statuses, isLoading }) => {
    const [selected, setSelected] = useState<StatusMedia | null>(null);
    const [saving, setSaving] = useState(false);
    const [toastMessage, setToastMessage] = useState('');
    const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
    const [isMultiSelect, setIsMultiSelect] = useState(false);

    const handleSave = async (media: StatusMedia | StatusMedia[]) => {
        setSaving(true);
        let success = true;
        if (Array.isArray(media)) {
            for (const m of media) {
                const ok = await saveStatusToGallery(m);
                if (!ok) success = false;
            }
        } else {
            success = await saveStatusToGallery(media);
        }
        setSaving(false);
        setToastMessage(success ? 'Saved successfully!' : 'Some files failed to save.');
        if (Array.isArray(media)) {
            setIsMultiSelect(false);
            setSelectedIds(new Set());
        }
    };

    const handleShare = async (media: StatusMedia) => {
        await shareStatus(media);
    };

    const toggleSelect = (id: string) => {
        const next = new Set(selectedIds);
        if (next.has(id)) next.delete(id);
        else next.add(id);
        setSelectedIds(next);
        if (next.size === 0) setIsMultiSelect(false);
    };

    const handleLongPress = (id: string) => {
        setIsMultiSelect(true);
        toggleSelect(id);
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
            {isMultiSelect && (
                <div className="fixed bottom-20 left-1/2 -translate-x-1/2 z-50 bg-green-500 text-white px-6 py-3 rounded-full shadow-lg flex items-center gap-4 animate-in slide-in-from-bottom">
                    <span className="font-bold">{selectedIds.size} selected</span>
                    <button
                        className="bg-white text-green-600 px-4 py-1 rounded-full font-bold text-sm"
                        onClick={() => handleSave(statuses.filter(s => selectedIds.has(s.id)))}
                    >
                        Save All
                    </button>
                    <button onClick={() => { setIsMultiSelect(false); setSelectedIds(new Set()); }}>Cancel</button>
                </div>
            )}

            <div className="grid grid-cols-3 gap-1 md:gap-2 p-1 md:p-2 auto-rows-[120px] md:auto-rows-[160px]">
                {statuses.map((media) => (
                    <div
                        key={media.id}
                        className={`relative cursor-pointer transition group overflow-hidden bg-gray-200 dark:bg-gray-800 rounded shadow ${selectedIds.has(media.id) ? 'ring-4 ring-green-500 ring-inset' : 'hover:opacity-90'}`}
                        onClick={() => isMultiSelect ? toggleSelect(media.id) : setSelected(media)}
                        onContextMenu={(e) => { e.preventDefault(); handleLongPress(media.id); }}
                    >
                        {media.type.startsWith('video') ? (
                            <>
                                <div className="absolute inset-0 flex items-center justify-center bg-black/30 z-10">
                                    <PlayCircle size={32} className="text-white opacity-80" />
                                </div>
                                <img
                                    src={media.thumbnail || media.uri}
                                    className="w-full h-full object-cover"
                                    alt="Video Preview"
                                />
                            </>
                        ) : (
                            <img src={media.uri} className="w-full h-full object-cover" alt="Status" loading="lazy" />
                        )}

                        {isMultiSelect ? (
                            <div className="absolute top-2 left-2 z-20">
                                <IonIcon
                                    icon={selectedIds.has(media.id) ? checkmarkCircle : ellipseOutline}
                                    className={`text-2xl ${selectedIds.has(media.id) ? 'text-green-500' : 'text-white/70'}`}
                                />
                            </div>
                        ) : (
                            <button
                                className="absolute bottom-2 right-2 bg-black/60 p-2 rounded-full text-white hover:bg-black/80 z-20"
                                onClick={(e) => { e.stopPropagation(); handleSave(media); }}
                            >
                                <Download size={18} />
                            </button>
                        )}

                        <div className="absolute top-1 right-1 bg-black/40 px-1 rounded text-[10px] text-white z-10 font-mono">
                            {media.appType === 'wab' ? 'WA Biz' : 'WA'}
                        </div>
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
                <div className="flex flex-col h-full bg-black text-white safe-area-top">
                    <div className="flex justify-between items-center p-4 z-50">
                        <button className="p-2 text-lg" onClick={() => setSelected(null)}>Back</button>
                        <div className="text-sm opacity-70">{selected?.appType === 'wab' ? 'WhatsApp Business' : 'WhatsApp'}</div>
                    </div>

                    <div className="flex-1 flex items-center justify-center p-0 bg-black relative">
                        {selected?.type.startsWith('video') ? (
                            <video
                                src={selected.uri}
                                controls
                                autoPlay
                                className="max-w-full max-h-full"
                                playsInline
                            />
                        ) : (
                            <img src={selected?.uri} className="max-w-full max-h-full object-contain" />
                        )}

                        {/* Updated Preview Buttons at Bottom */}
                        <div className="absolute bottom-10 left-0 right-0 flex justify-center gap-6 px-4">
                            <button
                                className="w-14 h-14 bg-white/10 backdrop-blur-md rounded-full flex items-center justify-center text-white"
                                onClick={() => selected && handleShare(selected)}
                            >
                                <IonIcon icon={shareSocial} size="large" />
                            </button>
                            <button
                                className="flex-1 max-w-[200px] bg-green-500 h-14 rounded-full flex items-center justify-center gap-2 font-bold text-lg shadow-lg"
                                onClick={() => selected && handleSave(selected)}
                            >
                                <Download size={24} /> Save
                            </button>
                        </div>
                    </div>
                </div>
            </IonModal>

            <IonLoading isOpen={saving} message={'Saving...'} />
        </>
    );
};

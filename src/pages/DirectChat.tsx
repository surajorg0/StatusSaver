import { IonContent, IonPage, IonInput, IonItem, IonLabel, IonButton, IonIcon, IonList, IonNote } from '@ionic/react';
import React, { useState } from 'react';
import PageHeader from '../components/PageHeader';
import { MessageCircle } from 'lucide-react';
import { logoWhatsapp } from 'ionicons/icons';

const DirectChat: React.FC = () => {
    const [phone, setPhone] = useState('');
    const [message, setMessage] = useState('');

    const openWhatsApp = () => {
        if (!phone) return;
        // Clean phone number: remove non-numeric
        const cleanPhone = phone.replace(/\D/g, '');
        const url = `https://wa.me/${cleanPhone}?text=${encodeURIComponent(message)}`;
        window.open(url, '_blank');
    };

    return (
        <IonPage>
            <PageHeader title="Direct Chat" />
            <IonContent className="ion-padding bg-gray-50 dark:bg-[#121212]">
                <div className="max-w-md mx-auto mt-8 flex flex-col items-center">
                    <div className="w-20 h-20 bg-green-500 rounded-full flex items-center justify-center text-white mb-6 shadow-lg shadow-green-500/20">
                        <MessageCircle size={40} />
                    </div>
                    <div className="text-center mb-8">
                        <h1 className="text-2xl font-bold mb-2">Message without Saving</h1>
                        <p className="text-gray-500 text-sm">Send a WhatsApp message directly to any number without adding it to your contacts.</p>
                    </div>

                    <IonList inset className="w-full bg-white dark:bg-gray-800 rounded-2xl overflow-hidden shadow-sm">
                        <IonItem lines="full" className="py-2">
                            <IonLabel position="stacked">Phone Number (with Country Code)</IonLabel>
                            <IonInput
                                placeholder="e.g. 919876543210"
                                value={phone}
                                onIonInput={e => setPhone(e.detail.value!)}
                                type="tel"
                                className="text-lg font-mono"
                            />
                        </IonItem>
                        <IonItem lines="none" className="py-2">
                            <IonLabel position="stacked">Message (Optional)</IonLabel>
                            <IonInput
                                placeholder="Type your message..."
                                value={message}
                                onIonInput={e => setMessage(e.detail.value!)}
                            />
                        </IonItem>
                    </IonList>

                    <IonButton
                        expand="block"
                        className="w-full mt-8 h-12 ion-margin-top font-bold"
                        color="success"
                        onClick={openWhatsApp}
                        disabled={!phone}
                    >
                        <IonIcon slot="start" icon={logoWhatsapp} />
                        Open in WhatsApp
                    </IonButton>

                    <IonNote className="text-center mt-6 text-xs opacity-60">
                        We don't store your phone numbers or messages. Your privacy is our priority.
                    </IonNote>
                </div>
            </IonContent>
        </IonPage>
    );
};

export default DirectChat;

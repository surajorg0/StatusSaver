import { IonContent, IonPage, IonList, IonItem, IonLabel, IonToggle, IonNote } from '@ionic/react';
import { useEffect, useState } from 'react';
import { isDarkTheme, setDarkTheme } from '../utils/theme';
import PageHeader from '../components/PageHeader';

const Settings: React.FC = () => {
    const [dark, setDark] = useState(false);

    useEffect(() => {
        isDarkTheme().then(setDark);
    }, []);

    const toggleDark = (checked: boolean) => {
        setDark(checked);
        setDarkTheme(checked);
    };

    const getPermissionText = () => {
        const lang = navigator.language || 'en';
        if (lang.startsWith('hi')) {
            return "हमें WhatsApp स्टेटस फ़ोल्डर को एक्सेस करने के लिए स्टोरेज अनुमति की आवश्यकता है। यह अनुमति केवल स्टेटस दिखाने और डाउनलोड करने के लिए उपयोग की जाती है और कोई डेटा शेयर नहीं किया जाता। इसे 'StatusSaver' फ़ोल्डर में सहेजा जाएगा।";
        }
        return "We require storage permission to access the WhatsApp status folder. This permission is only used to display and download your statuses locally and no data is shared or uploaded. Media will be saved in your 'StatusSaver' folder.";
    };

    return (
        <IonPage>
            <PageHeader title="Settings" />
            <IonContent fullscreen className="bg-gray-100 dark:bg-[#121212]">

                <IonList inset>
                    <IonItem>
                        <IonLabel>Dark Mode</IonLabel>
                        <IonToggle checked={dark} onIonChange={e => toggleDark(e.detail.checked)} />
                    </IonItem>
                </IonList>

                <div className="mx-4 mt-6 p-4 bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-100 dark:border-gray-700">
                    <h2 className="text-lg font-semibold mb-2">Permissions Explanation</h2>
                    <p className="text-sm text-gray-600 dark:text-gray-300 leading-relaxed">
                        {getPermissionText()}
                    </p>
                </div>

                <div className="mt-8 text-center bg-gray-50 dark:bg-[#121212] py-8">
                    <IonNote color="medium" className="text-sm">
                        Developed by surajorg © {new Date().getFullYear()}
                    </IonNote>
                </div>

            </IonContent>
        </IonPage>
    );
};

export default Settings;

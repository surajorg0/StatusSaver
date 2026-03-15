import React, { useState, useEffect } from 'react';
import { IonHeader, IonToolbar, IonTitle, IonButtons, IonButton } from '@ionic/react';
import { Moon, Sun, RefreshCcw } from 'lucide-react';
import { isDarkTheme, setDarkTheme } from '../utils/theme';

interface Props {
    title: string;
    onRefresh?: () => void;
    loading?: boolean;
}

const PageHeader: React.FC<Props> = ({ title, onRefresh, loading }) => {
    const [dark, setDark] = useState(false);

    useEffect(() => {
        isDarkTheme().then(setDark);
    }, []);

    const toggle = async () => {
        const newVal = !dark;
        setDark(newVal);
        await setDarkTheme(newVal);
    };

    return (
        <IonHeader>
            <IonToolbar className="dark:!bg-gray-900 !border-b dark:!border-gray-800">
                <IonTitle className="font-bold">{title}</IonTitle>
                <IonButtons slot="end">
                    {onRefresh && (
                        <IonButton onClick={onRefresh}>
                            <RefreshCcw size={20} className={loading ? 'animate-spin' : ''} />
                        </IonButton>
                    )}
                    <IonButton onClick={toggle}>
                        {dark ? <Sun size={20} className="text-yellow-400" /> : <Moon size={20} />}
                    </IonButton>
                </IonButtons>
            </IonToolbar>
        </IonHeader>
    );
};

export default PageHeader;

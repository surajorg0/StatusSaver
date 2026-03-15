import React, { useState, useRef } from 'react';
import {
    IonIcon,
    IonLabel,
    IonTabBar,
    IonTabButton,
} from '@ionic/react';
import { images, videocam, bookmark, settings, chatbubbleEllipses } from 'ionicons/icons';
import { Swiper, SwiperSlide } from 'swiper/react';
import Home from '../pages/Home';
import Videos from '../pages/Videos';
import Saved from '../pages/Saved';
import DirectChat from '../pages/DirectChat';
import Settings from '../pages/Settings';

// Import Swiper styles
import 'swiper/css';

const TabsContainer: React.FC = () => {
    const [activeTab, setActiveTab] = useState(0);
    const swiperRef = useRef<any>(null);

    const tabs = [
        { id: 0, label: 'Images', icon: images, component: <Home /> },
        { id: 1, label: 'Videos', icon: videocam, component: <Videos /> },
        { id: 2, label: 'Direct Chat', icon: chatbubbleEllipses, component: <DirectChat /> },
        { id: 3, label: 'Saved', icon: bookmark, component: <Saved /> },
        { id: 4, label: 'Settings', icon: settings, component: <Settings /> },
    ];

    const handleTabChange = (index: number) => {
        setActiveTab(index);
        swiperRef.current?.slideTo(index);
    };

    return (
        <div className="flex flex-col h-full bg-white dark:bg-black">
            <div className="flex-1 overflow-hidden">
                <Swiper
                    onSwiper={(swiper: any) => (swiperRef.current = swiper)}
                    onSlideChange={(swiper: any) => setActiveTab(swiper.activeIndex)}
                    className="h-full"
                    initialSlide={0}
                >
                    {tabs.map((tab) => (
                        <SwiperSlide key={tab.id} className="h-full overflow-y-auto">
                            {tab.component}
                        </SwiperSlide>
                    ))}
                </Swiper>
            </div>

            <IonTabBar slot="bottom" className="dark:bg-gray-900 border-t dark:border-gray-800">
                {tabs.map((tab) => (
                    <IonTabButton
                        key={tab.id}
                        tab={tab.label.toLowerCase().replace(' ', '-')}
                        selected={activeTab === tab.id}
                        onClick={() => handleTabChange(tab.id)}
                        className={activeTab === tab.id ? 'text-green-500' : 'dark:text-gray-400'}
                    >
                        <IonIcon aria-hidden="true" icon={tab.icon} />
                        <IonLabel>{tab.label}</IonLabel>
                    </IonTabButton>
                ))}
            </IonTabBar>
        </div>
    );
};

export default TabsContainer;

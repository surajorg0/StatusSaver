import { Redirect, Route } from 'react-router-dom';
import {
  IonApp,
  IonIcon,
  IonLabel,
  IonRouterOutlet,
  IonTabBar,
  IonTabButton,
  IonTabs,
  setupIonicReact
} from '@ionic/react';
import { IonReactRouter } from '@ionic/react-router';
import { images, videocam, bookmark, settings } from 'ionicons/icons';
import Home from './pages/Home';
import Videos from './pages/Videos';
import Saved from './pages/Saved';
import Settings from './pages/Settings';
import { App as CapacitorApp } from '@capacitor/app';
import { useState, useEffect } from 'react';
import { IonAlert } from '@ionic/react';
import { initializeTheme } from './utils/theme';

setupIonicReact({
  mode: 'md',
});

const App: React.FC = () => {
  const [showExitConfirm, setShowExitConfirm] = useState(false);

  useEffect(() => {
    initializeTheme();

    const handleBackButton = (ev: any) => {
      ev.detail.register(10, (_processNextHandler: () => void) => {
        const currentPath = window.location.pathname;
        // Check if any modal or alert is open first? Ionic usually handles this at priority 100
        if (currentPath === '/images' || currentPath === '' || currentPath === '/') {
          setShowExitConfirm(true);
        } else {
          // If on other tabs, go back to home tab
          window.location.href = '/images';
        }
      });
    };

    document.addEventListener('ionBackButton', handleBackButton);

    return () => {
      document.removeEventListener('ionBackButton', handleBackButton);
    };
  }, []);

  return (
    <IonApp>
      <IonReactRouter>
        <IonTabs>
          <IonRouterOutlet>
            <Route exact path="/images">
              <Home />
            </Route>
            <Route exact path="/videos">
              <Videos />
            </Route>
            <Route exact path="/saved">
              <Saved />
            </Route>
            <Route exact path="/settings">
              <Settings />
            </Route>
            <Route exact path="/">
              <Redirect to="/images" />
            </Route>
          </IonRouterOutlet>

          <IonTabBar slot="bottom" className="dark:bg-gray-900 border-t dark:border-gray-800">
            <IonTabButton tab="images" href="/images" className="dark:text-gray-400">
              <IonIcon aria-hidden="true" icon={images} />
              <IonLabel>Images</IonLabel>
            </IonTabButton>
            <IonTabButton tab="videos" href="/videos" className="dark:text-gray-400">
              <IonIcon aria-hidden="true" icon={videocam} />
              <IonLabel>Videos</IonLabel>
            </IonTabButton>
            <IonTabButton tab="saved" href="/saved" className="dark:text-gray-400">
              <IonIcon aria-hidden="true" icon={bookmark} />
              <IonLabel>Saved (7 days)</IonLabel>
            </IonTabButton>
            <IonTabButton tab="settings" href="/settings" className="dark:text-gray-400">
              <IonIcon aria-hidden="true" icon={settings} />
              <IonLabel>Settings</IonLabel>
            </IonTabButton>
          </IonTabBar>
        </IonTabs>
      </IonReactRouter>

      <IonAlert
        isOpen={showExitConfirm}
        onDidDismiss={() => setShowExitConfirm(false)}
        header="Exit App"
        message="Are you sure you want to exit?"
        buttons={[
          { text: 'Cancel', role: 'cancel' },
          { text: 'Exit', handler: () => CapacitorApp.exitApp() }
        ]}
      />
    </IonApp>
  );
};

export default App;

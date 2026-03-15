import { IonApp, setupIonicReact, IonAlert } from '@ionic/react';
import { IonReactRouter } from '@ionic/react-router';
import { App as CapacitorApp } from '@capacitor/app';
import { useState, useEffect } from 'react';
import { initializeTheme } from './utils/theme';
import TabsContainer from './components/TabsContainer';
import { Redirect, Route, Switch } from 'react-router-dom';

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
        // Since we are using TabsContainer as a single page now, 
        // we might need to handle internal tab state if we want to go back to tab 0.
        // For now, if on home or roots, exit.
        if (currentPath === '/' || currentPath === '/tabs') {
          setShowExitConfirm(true);
        } else {
          window.location.href = '/';
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
        <Switch>
          <Route exact path="/">
            <TabsContainer />
          </Route>
          <Route path="*">
            <Redirect to="/" />
          </Route>
        </Switch>
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

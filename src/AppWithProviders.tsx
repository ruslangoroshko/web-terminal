import React, { useState, useEffect } from 'react';
import MainApp from './MainApp';
import { useStores } from './hooks/useStores';
import { init } from 'mixpanel-browser';
import '../i18n';
import LoaderFullscreen from './components/LoaderFullscreen';

const AppWithProviders = () => {
  const [isLoading, setIsLoading] = useState(true);
  const { mainAppStore } = useStores();
  useEffect(() => {
    async function fetchInit() {
      try {
        await mainAppStore.initApp();
        init(
          mainAppStore.initModel.mixpanelToken ||
            '582507549d28c813188211a0d15ec940'
        );
        mainAppStore.handleInitConnection();
        setIsLoading(false);
      } catch (error) {
        setIsLoading(false);
      }
    }
    fetchInit();
  }, []);

  return isLoading ? <LoaderFullscreen isLoading={true} /> : <MainApp />;
};

export default AppWithProviders;

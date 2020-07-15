import React, { useState, useEffect } from 'react';
import MainApp from './MainApp';
import { useStores } from './hooks/useStores';
import { init } from 'mixpanel-browser';
import '../i18n';
import { useTranslation } from 'react-i18next';

const AppWithProviders = () => {
  const [isLoading, setIsLoading] = useState(true);
  const { mainAppStore } = useStores();
  const { i18n} = useTranslation();
  useEffect(() => {
    async function fetchInit() {
      try {
        await mainAppStore.initApp();
        init(MIXPANEL_TOKEN);

        setIsLoading(false);
      } catch (error) {
        setIsLoading(false);
      }
    }
    fetchInit();
  }, []);

  return isLoading ? null : <MainApp></MainApp>;
};

export default AppWithProviders;

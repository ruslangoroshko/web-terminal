import React, { useState, useEffect } from 'react';
import MainApp from './MainApp';
import { useStores } from './hooks/useStores';

const AppWithProviders = () => {
  const [isLoading, setIsLoading] = useState(true);
  const { mainAppStore } = useStores();
  useEffect(() => {
    async function fetchInit() {
      try {
        await mainAppStore.initApp();
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

import React, { useEffect } from 'react';
import { useParams, useHistory } from 'react-router-dom';
import { useStores } from '../hooks/useStores';
import { OperationApiResponseCodes } from '../enums/OperationApiResponseCodes';
import Page from '../constants/Pages';

const LpLogin = () => {
  const { token } = useParams();
  const { push } = useHistory();
  const { mainAppStore } = useStores();
  useEffect(() => {
    async function fetchLpLogin() {
      try {
        const response = await mainAppStore.signInLpLogin({
          token: token || '',
        });
        if (response === OperationApiResponseCodes.Ok) {
          push(Page.DASHBOARD);
        } else {
          push(Page.SIGN_IN);
        }
      } catch (error) {
        push(Page.SIGN_IN);
      }
    }
    fetchLpLogin();
  }, []);

  return <div></div>;
};

export default LpLogin;

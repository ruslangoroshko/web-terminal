import React, { useEffect } from 'react';
import { useParams, useHistory, useLocation } from 'react-router-dom';
import { useStores } from '../hooks/useStores';
import { OperationApiResponseCodes } from '../enums/OperationApiResponseCodes';
import Page from '../constants/Pages';
import { useTranslation } from 'react-i18next';
import { observer } from 'mobx-react-lite';

interface QueryParams {
  lang: string;
  token: string;
  page?: 'withdrawal' | 'deposit';
}

const LpLogin = observer(() => {
  const { token, lang, page } = useParams<QueryParams>();
  const { push } = useHistory();
  const { mainAppStore, depositFundsStore } = useStores();
  const { i18n } = useTranslation();
  const location = useLocation();

  const pageParams = new URLSearchParams(location.search);
  useEffect(() => {
    async function fetchLpLogin() {
      try {
        const response = await mainAppStore.signInLpLogin({
          token: token || '',
        });
        if (response === OperationApiResponseCodes.Ok) {
          mainAppStore.setLpLoginFlag(true);
          mainAppStore.setSignUpFlag(true);
          const pageParam = pageParams.get('page');
          switch (pageParam) {
            case 'deposit':
              depositFundsStore.togglePopup();
              push(Page.DASHBOARD);
              break;

            case 'withdrawal':
              push(Page.ACCOUNT_WITHDRAW);
              break;

            default:
              push(Page.DASHBOARD);
              break;
          }
        } else {
          push(Page.SIGN_IN);
        }
      } catch (error) {
        push(Page.SIGN_IN);
      }
    }
    fetchLpLogin();
    const pageLang = pageParams.get('lang');
    if (pageLang) {
      i18n.changeLanguage(pageLang);
    }
  }, []);

  return <div></div>;
});

export default LpLogin;

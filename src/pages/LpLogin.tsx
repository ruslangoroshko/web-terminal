import React, { useEffect } from 'react';
import { useParams, useHistory, useLocation } from 'react-router-dom';
import { useStores } from '../hooks/useStores';
import { OperationApiResponseCodes } from '../enums/OperationApiResponseCodes';
import Page from '../constants/Pages';
import { useTranslation } from 'react-i18next';
import { observer } from 'mobx-react-lite';
import { CountriesEnum } from '../enums/CountriesEnum';

interface QueryParams {
  lang: CountriesEnum;
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

  let timer: any;
  useEffect(() => {
    async function fetchLpLogin() {
      try {
        const response = await mainAppStore.signInLpLogin({
          token: token || '',
        });
        console.log('response LpLogin 2', response);
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

            default: {
              const showOnBoarding = await mainAppStore.checkOnboardingShowLPLogin();
              if (showOnBoarding) {
                await mainAppStore.addTriggerShowOnboarding();
                timer = setTimeout(() => {
                  push(Page.ONBOARDING);
                }, 500);
              } else {
                push(Page.DASHBOARD);
              }
              
              break;
            }
          }
        } else {
          push(Page.SIGN_IN);
        }
      } catch (error) {
        push(Page.SIGN_IN);
      }
    }
    fetchLpLogin();
    const pageLang: CountriesEnum =
      (pageParams.get('lang')?.toLowerCase() as CountriesEnum) ||
      CountriesEnum.EN;

    i18n.changeLanguage(pageLang);
    mainAppStore.setLanguage(pageLang);

    return () => {
      clearTimeout(timer);
    }
  }, []);

  return <></>;
});

export default LpLogin;

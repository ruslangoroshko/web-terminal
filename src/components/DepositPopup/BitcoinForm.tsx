import React, { useEffect, useState, FC } from 'react';
import { FlexContainer } from '../../styles/FlexContainer';
import {
  PrimaryTextParagraph,
  PrimaryTextSpan,
} from '../../styles/TextsElements';
import styled from '@emotion/styled';
import CopyIcon from '../../assets/svg/icon-copy.svg';
import SvgIcon from '../SvgIcon';
import QRCode from 'react-qr-code';
import API from '../../helpers/API';
import { useStores } from '../../hooks/useStores';
import { DepositCurrency } from '../../enums/DepositCurrency';
import { DepositApiResponseCodes } from '../../enums/DepositApiResponseCodes';
import LoaderForComponents from '../LoaderForComponents';
import { ButtonWithoutStyles } from '../../styles/ButtonWithoutStyles';
import { useTranslation } from 'react-i18next';
import mixpanel from 'mixpanel-browser';
import mixpanelEvents from '../../constants/mixpanelEvents';
import mixapanelProps from '../../constants/mixpanelProps';
import depositMethod from '../../constants/depositMethod';
import testIds from '../../constants/testIds';
import depositApiResponseCodeMessages from '../../constants/depositApiResponseCodeMessages';

const BitcoinForm: FC = () => {
  const [bitcoinWalletString, setBitcoinWalletString] = useState('');
  const [isLoading, setLoading] = useState(true);

  const { t } = useTranslation();

  const { mainAppStore, notificationStore, badRequestPopupStore } = useStores();

  const handleCopyText = () => {
    if (bitcoinWalletString) {
      var el = document.createElement('textarea');
      el.value = bitcoinWalletString;
      el.setAttribute('readonly', '');
      document.body.appendChild(el);
      el.select();
      document.execCommand('copy');
      document.body.removeChild(el);

      notificationStore.setNotification(t('Copied to clipboard'));
      notificationStore.setIsSuccessfull(true);
      notificationStore.openNotification();
    }
  };

  useEffect(() => {
    async function fetchBitcoinString() {
      try {
        const response = await API.getCryptoWallet({
          currency: DepositCurrency.BTC,
          accountId:
            mainAppStore.accounts.find((item) => item.isLive)?.id || '',
        });

        if (response.status === DepositApiResponseCodes.Success) {
          setBitcoinWalletString(response.walletAddress);
        } else if (response.status === DepositApiResponseCodes.PaymentDisabled){
          notificationStore.setNotification(
            t(depositApiResponseCodeMessages[response.status])
          );
          notificationStore.setIsSuccessfull(false);
          notificationStore.openNotification();
        } else {
          notificationStore.setNotification(t('Technical error'));
          notificationStore.setIsSuccessfull(false);
          notificationStore.openNotification();
        }
        
        setLoading(false);
      } catch (error) {
      }
    }
    fetchBitcoinString();
  }, []);

  useEffect(() => {
    mixpanel.track(mixpanelEvents.DEPOSIT_METHOD_VIEW, {
      [mixapanelProps.DEPOSIT_METHOD]: depositMethod.BITCOIN,
    });
  }, []);

  return (
    <FlexContainer flexDirection="column" padding="24px 0">
      <LoaderForComponents backgroundColor="#1c2026" isLoading={isLoading} />
      <PrimaryTextParagraph
        fontSize="16px"
        color="#fffccc"
        fontWeight="bold"
        marginBottom="12px"
      >
        {t('Bitcoin')}
      </PrimaryTextParagraph>
      <PrimaryTextParagraph fontSize="13px" color="#fff" marginBottom="38px">
        {t('Send funds to the address provided below')}
      </PrimaryTextParagraph>
      <FlexContainer>
        <PrimaryTextSpan
          fontSize="11px"
          textTransform="uppercase"
          color="rgba(255, 255, 255, 0.4)"
          marginRight="4px"
        >
          {t('Deposit Address (BTC)')}
        </PrimaryTextSpan>
      </FlexContainer>
      <BitcoinWalletStringWrapper
        justifyContent="space-between"
        marginBottom="20px"
      >
        <PrimaryTextSpan fontWeight="bold" fontSize="14px" color="#fffccc">
          {bitcoinWalletString}
        </PrimaryTextSpan>
        <ButtonWithoutStyles
          data-testid={testIds.BITCOIN_COPY_BUTTON}
          onClick={handleCopyText}
        >
          <SvgIcon {...CopyIcon} fillColor="rgba(255, 255, 255, 0.6)" />
        </ButtonWithoutStyles>
      </BitcoinWalletStringWrapper>
      <FlexContainer flexDirection="column" width="250px">
        <FlexContainer
          backgroundColor="#23262F"
          borderRadius="4px"
          width="224px"
          height="224px"
          marginBottom="30px"
          padding="10px"
        >
          <QRCode value={bitcoinWalletString} size={204}></QRCode>
        </FlexContainer>
        <FlexContainer flexDirection="column">
          <PrimaryTextSpan fontSize="13px" color="rgba(255, 255, 255, 0.4)">
            {t('Important')}:
            <br />
            <br />
            {t(
              'Send only amount in BTC to this deposit address. Sending any other currency to this address may result in the loss of your deposit.'
            )}
            <br />
            <br />
            {t('Time to fund: Depending on the Blockchain')} ({t('approx')}{' '}
            20-60 min)
          </PrimaryTextSpan>
        </FlexContainer>
      </FlexContainer>
    </FlexContainer>
  );
};

export default BitcoinForm;

const BitcoinWalletStringWrapper = styled(FlexContainer)`
  border-bottom: 1px solid rgba(255, 255, 255, 0.2);
  padding-bottom: 8px;
`;

const FixedNotify = styled.span`
  position: fixed;
  z-index: 9999;
  bottom: 40px;
  left: 40px;
`;

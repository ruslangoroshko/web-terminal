import React, { useEffect, useState } from 'react';
import { FlexContainer } from '../../styles/FlexContainer';
import {
  PrimaryTextParagraph,
  PrimaryTextSpan,
} from '../../styles/TextsElements';
import InformationPopup from '../InformationPopup';
import styled from '@emotion/styled';
import CopyIcon from '../../assets/svg/icon-copy.svg';
import SvgIcon from '../SvgIcon';
import QRCode from 'react-qr-code';
import API from '../../helpers/API';
import { useStores } from '../../hooks/useStores';
import { GetCryptoWalletStatuses } from '../../enums/GetCryptoWalletStatuses';
import {
  GetCryptoWalletDTO,
  GetCryptoWalletParams,
} from '../../types/DepositTypes';
import { DepositCurrency } from '../../enums/DepositCurrency';
import { DepositApiResponseCodes } from '../../enums/DepositApiResponseCodes';
import LoaderForComponents from '../LoaderForComponents';
import { Observer } from 'mobx-react-lite';
import NotificationPopup from '../NotificationPopup';
import { ButtonWithoutStyles } from '../../styles/ButtonWithoutStyles';

const BitcoinForm = () => {
  const [bitcoinWalletString, setBitcoinWalletString] = useState('');
  const [isLoading, setLoading] = useState(true);

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

      notificationStore.notificationMessage = 'Copied to clipboard';
      notificationStore.isSuccessfull = true;
      notificationStore.openNotification();
    }
  };

  useEffect(() => {
    async function fetchBitcoinString() {
      try {
        const response = await API.getCryptoWallet({
          authToken: mainAppStore.token || '',
          currency: DepositCurrency.BTC,
        });
        if (response.status === DepositApiResponseCodes.Success) {
          setBitcoinWalletString(response.walletAddress);
          setLoading(false);
        } else {
          badRequestPopupStore.setMessage('Technical error');
          badRequestPopupStore.openModal();
          setLoading(false);
        }
      } catch (error) {
        badRequestPopupStore.setMessage(error);
        badRequestPopupStore.openModal();
      }
    }
    fetchBitcoinString();
  }, []);

  return (
    <FlexContainer flexDirection="column" padding="24px 0">
      <Observer>
        {() => (
          <FixedNotify>
            <NotificationPopup
              show={notificationStore.isActiveNotification}
            ></NotificationPopup>
          </FixedNotify>
        )}
      </Observer>
      <LoaderForComponents backgroundColor="#1c2026" isLoading={isLoading} />
      <PrimaryTextParagraph
        fontSize="16px"
        color="#fffccc"
        fontWeight="bold"
        marginBottom="12px"
      >
        Bitcoin
      </PrimaryTextParagraph>
      <PrimaryTextParagraph fontSize="13px" color="#fff" marginBottom="38px">
        Send funds to the address provided below
      </PrimaryTextParagraph>
      <FlexContainer>
        <PrimaryTextSpan
          fontSize="11px"
          textTransform="uppercase"
          color="rgba(255, 255, 255, 0.4)"
          marginRight="4px"
        >
          Deposit Address (BTC)
        </PrimaryTextSpan>
        {/* <InformationPopup>

      </InformationPopup> */}
      </FlexContainer>
      <BitcoinWalletStringWrapper
        justifyContent="space-between"
        marginBottom="20px"
      >
        <PrimaryTextSpan
          fontWeight="bold"
          fontSize="14px"
          color="#fffccc"
        >
          {bitcoinWalletString}
        </PrimaryTextSpan>
        <ButtonWithoutStyles onClick={handleCopyText}>
          <SvgIcon {...CopyIcon} fillColor="rgba(255, 255, 255, 0.6)" />
        </ButtonWithoutStyles>
      </BitcoinWalletStringWrapper>
      <FlexContainer>
        <FlexContainer
          backgroundColor="#23262F"
          borderRadius="4px"
          width="224px"
          height="224px"
          marginRight="30px"
          padding="10px"
        >
          <QRCode value={bitcoinWalletString} size={204}></QRCode>
        </FlexContainer>
        <FlexContainer flexDirection="column">
          <PrimaryTextSpan fontSize="13px" color="rgba(255, 255, 255, 0.4)">
            Important:
            <br />
            <br />
            Send only amount in BTC to this deposit address. Sending any other
            currency to this address may result in the loss of your deposit.
            <br />
            <br />
            Time to fund: Depending on the Blockchain (approx 20-60 min)
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

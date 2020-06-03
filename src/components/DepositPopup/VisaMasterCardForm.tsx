import React, { useState, useEffect } from 'react';
import { FlexContainer } from '../../styles/FlexContainer';
import {
  PrimaryTextParagraph,
  PrimaryTextSpan,
} from '../../styles/TextsElements';
import styled from '@emotion/styled';
import MastercardIdCheckImage from '../../assets/images/mastercard-id-check.png';
import SslCertifiedImage from '../../assets/images/ssl-certified.png';
import VisaSecureImage from '../../assets/images/visa-secure.png';
import { useStores } from '../../hooks/useStores';
import AmountPlaceholder from './AmountPlaceholder';
import CurrencyDropdown from './CurrencyDropdown';
import { paymentCurrencies } from '../../constants/paymentCurrencies';
import Checkbox from '../Checkbox';
import { Link } from 'react-router-dom';
import { PrimaryButton } from '../../styles/Buttons';
import API from '../../helpers/API';
import { DepositApiResponseCodes } from '../../enums/DepositApiResponseCodes';

const VisaMasterCardForm = () => {
  const [amount, setAmount] = useState(500);
  const [currency, setCurrency] = useState(paymentCurrencies[0]);

  const [imCardHolder, setImCardHolder] = useState(false);

  const placeholderValues = [250, 500, 1000];

  const { mainAppStore, notificationStore, badRequestPopupStore } = useStores();

  const investOnBeforeInputHandler = (e: any) => {
    if ([',', '.'].includes(e.data)) {
      if (
        !e.currentTarget.value ||
        (e.currentTarget.value && e.currentTarget.value.includes('.'))
      ) {
        e.preventDefault();
        return;
      }
    }
    if (!e.data.match(/^\d|\.|\,/)) {
      e.preventDefault();
      return;
    }
  };

  const handleChangeAmount = (e: React.ChangeEvent<HTMLInputElement>) => {
    setAmount(+e.target.value);
  };

  const handleChangeCheckbox = (event: React.ChangeEvent<HTMLInputElement>) => {
    setImCardHolder(event.target.checked);
  };

  useEffect(() => {
    console.log()
  }, []);

  const handleClickDepositButton = async () => {
    const params = {
      paymentMethod: 'BANK_CARDS',
      depositSum: amount,
      currency: 'USD',
      authToken: mainAppStore.token || '',
    };
    try {
      const response = await API.createDeposit(params);
      if (response.status === DepositApiResponseCodes.Success) {
        window.location.href = response.redirectUrl;
      } else {
        badRequestPopupStore.setMessage('Technical error');
        badRequestPopupStore.openModal();
      }
    } catch (error) {
      badRequestPopupStore.setMessage(error);
      badRequestPopupStore.openModal();
    }
  };

  return (
    <FlexContainer flexDirection="column" padding="32px 0 0 68px">
      <PrimaryTextParagraph
        textTransform="uppercase"
        fontSize="11px"
        color="rgba(255,255,255,0.3)"
        marginBottom="6px"
      >
        Amount
      </PrimaryTextParagraph>
      <FlexContainer
        borderRadius="4px"
        border="1px solid #FFFCCC"
        backgroundColor="#292C33"
        marginBottom="10px"
        maxHeight="48px"
        alignItems="center"
      >
        <Input
          value={amount}
          onChange={handleChangeAmount}
          onBeforeInput={investOnBeforeInputHandler}
        />
        <CurrencyDropdown
          disabled={true}
          width="80px"
          handleSelectCurrency={setCurrency}
          selectedCurrency={currency}
        ></CurrencyDropdown>
      </FlexContainer>
      
      <FlexContainer marginBottom="92px">
      {placeholderValues.map(item => (
          <AmountPlaceholder
            key={item}
            isActive={item === amount}
            value={item}
            currencySymbol={`${mainAppStore.activeAccount?.symbol}`}
            handleClick={setAmount}
          />
        ))}
      </FlexContainer>

      <FlexContainer alignItems="center" justifyContent="space-around" marginBottom="20px">
        <ImageBadge src={SslCertifiedImage} width={120}></ImageBadge>
        <ImageBadge src={MastercardIdCheckImage} width={110}></ImageBadge>
        <ImageBadge src={VisaSecureImage} width={28}></ImageBadge>
      </FlexContainer>

      <FlexContainer marginBottom="40px">
        <PrimaryButton
          padding="12px 20px"
          width="100%"
          onClick={handleClickDepositButton}
        >
          <PrimaryTextSpan color="#003A38" fontSize="14px" fontWeight="bold">
            Deposit {mainAppStore.activeAccount?.symbol}{amount}
          </PrimaryTextSpan>
        </PrimaryButton>
      </FlexContainer>
    </FlexContainer>
  );
};

export default VisaMasterCardForm;

const ImageBadge = styled.img``;


const Input = styled.input`
  border: none;
  outline: none;
  width: calc(100% - 80px);
  height: 48px;
  color: #fffccc;
  font-size: 14px;
  font-weight: bold;
  padding: 24px 16px;
  background-color: transparent;
  border-right: 1px solid rgba(255, 255, 255, 0.19);
`;


const LearnMoreLink = styled(Link)`
  color: #fffccc;
  line-height: 120%;
  &:hover {
    color: #fffccc;
  }
`;

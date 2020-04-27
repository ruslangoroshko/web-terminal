import React, { useState } from 'react';
import { FlexContainer } from '../../styles/FlexContainer';
import { PrimaryTextParagraph } from '../../styles/TextsElements';
import styled from '@emotion/styled';
import AmountPlaceholder from './AmountPlaceholder';
import CurrencyDropdown from './CurrencyDropdown';
import { paymentCurrencies } from '../../constants/paymentCurrencies';

const VisaMasterCardForm = () => {
  const [amount, setAmount] = useState(1);
  const [currency, setCurrency] = useState(paymentCurrencies[0]);

  const placeholderValues = [50, 100, 250, 500, 1000];

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

  return (
    <FlexContainer flexDirection="column" padding="50px 0 0 0">
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
        border="1px solid rgba(255, 255, 255, 0.19)"
        backgroundColor="rgba(255, 255, 255, 0.06)"
        marginBottom="10px"
      >
        <Input
          value={amount}
          onChange={handleChangeAmount}
          onBeforeInput={investOnBeforeInputHandler}
        />
        <CurrencyDropdown
          handleSelectCurrency={setCurrency}
          selectedCurrency={currency}
        ></CurrencyDropdown>
      </FlexContainer>
      <GridDiv>
        {placeholderValues.map(item => (
          <AmountPlaceholder
            key={item}
            isActive={item === amount}
            value={item}
            currencySymbol=""
            handleClick={setAmount}
          />
        ))}
      </GridDiv>
    </FlexContainer>
  );
};

export default VisaMasterCardForm;

const GridDiv = styled.div`
  width: 100%;
  display: grid;
  grid-template-columns: 1fr 1fr;
  grid-gap: 10px;
  margin-bottom: 30px;
`;

const Input = styled.input`
  border: none;
  outline: none;
  width: calc(100% - 140px);
  height: 100%;
  color: #fffccc;
  font-size: 14px;
  font-weight: bold;
  padding: 12px;
  background-color: transparent;
  border-right: 1px solid rgba(255, 255, 255, 0.19);
`;

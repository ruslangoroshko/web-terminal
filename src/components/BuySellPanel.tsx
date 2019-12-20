import React from 'react';
import { FlexContainer } from '../styles/FlexContainer';
import styled from '@emotion/styled';
import MaskedInput from 'react-text-mask';
import { ButtonWithoutStyles } from '../styles/ButtonWithoutStyles';
import SvgIcon from './SvgIcon';
import IconShevronUp from '../assets/svg/icon-shevron-up.svg';
import IconShevronDown from '../assets/svg/icon-shevron-down.svg';

interface Props {
  currencySymbol: string;
}

function BuySellPanel(props: Props) {
  const { currencySymbol } = props;

  return (
    <FlexContainer
      padding="16px"
      flexDirection="column"
      backgroundColor="#1A1E22"
    >
      <FlexContainer
        justifyContent="space-between"
        flexWrap="wrap"
        margin="0 0 4px 0"
      >
        <Label>Invest</Label>
        <InfoIcon
          justifyContent="center"
          alignItems="center"
          width="14px"
          height="14px"
        >
          i
        </InfoIcon>
      </FlexContainer>
      <MaskedInput
        mask={[currencySymbol, /\d/, /\d/, /\d/, /\d/, /\d/, /\d/]}
        showMask={false}
        guide={false}
        placeholder={currencySymbol}
        render={(ref, props) => <InvestInput ref={ref} {...props} />}
      ></MaskedInput>
      <FlexContainer
        justifyContent="space-between"
        flexWrap="wrap"
        margin="0 0 4px 0"
      >
        <Label>Leverage</Label>
        <InfoIcon
          justifyContent="center"
          alignItems="center"
          width="14px"
          height="14px"
        >
          i
        </InfoIcon>
      </FlexContainer>
      <MaskedInput
        mask={['x', /\d/, /\d/, /\d/, /\d/, /\d/, /\d/]}
        showMask={false}
        guide={false}
        placeholder="x"
        render={(ref, props) => <InvestInput ref={ref} {...props} />}
      ></MaskedInput>
      <FlexContainer
        justifyContent="space-between"
        flexWrap="wrap"
        margin="0 0 4px 0"
      >
        <Label>Autoclose</Label>
        <InfoIcon
          justifyContent="center"
          alignItems="center"
          width="14px"
          height="14px"
        >
          i
        </InfoIcon>
      </FlexContainer>
      <ButtonAutoClosePurchase>Set</ButtonAutoClosePurchase>
      <FlexContainer
        justifyContent="space-between"
        flexWrap="wrap"
        margin="0 0 4px 0"
      >
        <Label>Purchase at</Label>
        <InfoIcon
          justifyContent="center"
          alignItems="center"
          width="14px"
          height="14px"
        >
          i
        </InfoIcon>
      </FlexContainer>
      <ButtonAutoClosePurchase>Set</ButtonAutoClosePurchase>
      <FlexContainer justifyContent="space-between" margin="0 0 8px 0">
        <Label>VOLUME</Label>
        <ValueText>
          {currencySymbol}
          {1000200}
        </ValueText>
      </FlexContainer>
      <FlexContainer justifyContent="space-between" margin="0 0 16px 0">
        <Label>Spread</Label>
        <ValueText>
          {currencySymbol}
          {1.3}
        </ValueText>
      </FlexContainer>

      <ButtonBuy>
        <FlexContainer margin="0 8px 0 0">
          <SvgIcon {...IconShevronUp} fill="#003A38"></SvgIcon>
        </FlexContainer>
        Buy
      </ButtonBuy>
      <ButtonSell>
        <FlexContainer margin="0 8px 0 0">
          <SvgIcon {...IconShevronDown} fill="#fff"></SvgIcon>
        </FlexContainer>
        Sell
      </ButtonSell>
    </FlexContainer>
  );
}

export default BuySellPanel;

const Dropdown = styled(FlexContainer)`
  margin-bottom: 14px;
`;

const ButtonAutoClosePurchase = styled(ButtonWithoutStyles)`
  height: 40px;
  background: rgba(255, 255, 255, 0.12);
  border-radius: 4px;
  width: 100%;
  font-size: 14px;
  line-height: 24px;
  color: #ffffff;
  margin-bottom: 14px;
`;

const InvestInput = styled.input`
  padding: 4px;
  height: 40px;
  width: 100%;
  outline: none;
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 4px;
  background-color: transparent;
  font-weight: bold;
  font-size: 14px;
  line-height: 16px;
  color: #ffffff;
  margin-bottom: 14px;

  &:before {
    content: '';
    position: absolute;
    top: 0;
    bottom: 0;
    left: 0;
    right: 0;
    background-color: rgba(255, 255, 255, 0.06);
  }
  ::-webkit-input-placeholder {
    color: #fff;
  }

  :-ms-input-placeholder {
    color: #fff;
  }

  ::placeholder {
    color: #fff;
  }
`;

const Label = styled.span`
  font-size: 11px;
  line-height: 12px;
  text-transform: uppercase;
  color: #ffffff;
  opacity: 0.3;
`;

const InfoIcon = styled(FlexContainer)`
  font-size: 11px;
  border-radius: 50%;
  background-color: rgba(255, 255, 255, 0.2);
  color: white;
  font-style: italic;
`;

const ValueText = styled.span`
  font-family: Roboto;
  font-size: 12px;
  line-height: 14px;
  color: #ffffff;
`;

const ButtonSell = styled(ButtonWithoutStyles)`
  background: linear-gradient(0deg, #ed145b, #ed145b);
  border-radius: 4px;
  height: 56px;
  color: #fff;
  font-weight: bold;
  font-size: 20px;
  line-height: 24px;
  display: flex;
  justify-content: center;
  align-items: center;
`;

const ButtonBuy = styled(ButtonSell)`
  background: linear-gradient(0deg, #00fff2, #00fff2);
  box-shadow: 0px 4px 8px rgba(0, 255, 242, 0.17),
    inset 0px -3px 6px rgba(0, 255, 242, 0.26);
  color: #003a38;
  margin-bottom: 8px;
`;

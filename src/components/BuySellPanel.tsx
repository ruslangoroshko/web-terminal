import React from 'react';
import { FlexContainer } from '../styles/FlexContainer';
import styled from '@emotion/styled';
import MaskedInput from 'react-text-mask';

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
        showMask
        guide={false}
        placeholder={currencySymbol}
        render={(ref, props) => <InvestInput ref={ref} {...props} />}
      ></MaskedInput>
    </FlexContainer>
  );
}

export default BuySellPanel;

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
  border-radius: 50%;
  background-color: rgba(255, 255, 255, 0.2);
  color: white;
  font-style: italic;
`;

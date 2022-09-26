import styled from '@emotion/styled';
import React from 'react';
import Colors from '../../constants/Colors';
import { Button, PrimaryButton } from '../../styles/Buttons';
import { FlexContainer } from '../../styles/FlexContainer';
import { PrimaryTextSpan } from '../../styles/TextsElements';
import IconClose from '../../assets/svg/icon-popup-close.svg';
import SvgIcon from '../SvgIcon';
import { ButtonWithoutStyles } from '../../styles/ButtonWithoutStyles';
import InformationPopup from '../InformationPopup';
import { useTranslation } from 'react-i18next';
import AssetSelectorInput from '../AssetSelectorInput';
import { useStores } from '../../hooks/useStores';

const PositionCalculator = () => {
  const {} = useStores();
  const [on, setToggle] = React.useState(false);
  const { t } = useTranslation();

  const handleToggleBtn = () => {
    setToggle(!on);
  };

  const handleClosePopup = () => {
    setToggle(false);
  };

  return (
    <FlexContainer marginBottom="12px" position="relative">
      <Button onClick={handleToggleBtn} type="button">
        <PrimaryTextSpan color={Colors.ACCENT} fontSize="14px">
          Calculator
        </PrimaryTextSpan>
      </Button>

      {on && (
        <ModalWrapper
          position="absolute"
          bottom="0px"
          right="calc(100% + 16px)"
        >
          <Wrapper flexDirection="column">
            <FlexContainer
              width="100%"
              justifyContent="flex-end"
              position="absolute"
              top="12px"
              right="12px"
            >
              <FlexContainer>
                {/* <PrimaryTextSpan marginBottom="24px" marginRight="12px">
                Position calculator
              </PrimaryTextSpan> */}
                <InformationPopup
                  bgColor={Colors.DARK_BLACK}
                  classNameTooltip="leverage"
                  width="212px"
                  direction="left"
                >
                  <PrimaryTextSpan color={Colors.ACCENT} fontSize="12px">
                    {t(
                      'The indicative numbers are for reference only. The realized numbers may be slightly different due to trading fees.'
                    )}
                  </PrimaryTextSpan>
                </InformationPopup>
              </FlexContainer>
              <ButtonClose type="button" onClick={handleClosePopup}>
                <SvgIcon
                  {...IconClose}
                  fillColor={Colors.WHITE_DARK}
                  hoverFillColor={Colors.PRIMARY}
                ></SvgIcon>
              </ButtonClose>
            </FlexContainer>

            {/*  */}

            <FlexContainer marginBottom="12px" flexDirection="column">
              <PrimaryTextSpan
                fontSize="11px"
                lineHeight="12px"
                color="rgba(255, 255, 255, 0.3)"
                textTransform="uppercase"
                marginBottom="12px"
              >
                {t('Select instrument')}
              </PrimaryTextSpan>

              <AssetSelectorInput />
            </FlexContainer>

            <FlexContainer
              width="100%"
              borderRadius="8px"
              overflow="hidden"
              marginBottom="16px"
            >
              <TabLabelWrap>
                <TabInput
                  type="radio"
                  id="tab-calc-buy"
                  name="tab-calc"
                  value="buy"
                  operation="buy"
                  defaultChecked={true}
                />
                <TabLabel operation="buy">Buy/Long</TabLabel>
              </TabLabelWrap>

              <TabLabelWrap>
                <TabInput
                  type="radio"
                  id="tab-calc-sell"
                  name="tab-calc"
                  value="sell"
                  operation="sell"
                />
                <TabLabel operation="sell">Sell/Short</TabLabel>
              </TabLabelWrap>
            </FlexContainer>

            <InputWrapper>
              <PrimaryTextSpan
                fontSize="11px"
                lineHeight="12px"
                color="rgba(255, 255, 255, 0.3)"
                textTransform="uppercase"
                marginBottom="4px"
              >
                {t('Invest')}
              </PrimaryTextSpan>
              <Input placeholder="Invest" />
            </InputWrapper>

            <InputWrapper>
              <PrimaryTextSpan
                fontSize="11px"
                lineHeight="12px"
                color="rgba(255, 255, 255, 0.3)"
                textTransform="uppercase"
              >
                {t('Leverage')}
              </PrimaryTextSpan>
              <Input placeholder="Leverage" />
            </InputWrapper>

            <InputWrapper>
              <PrimaryTextSpan
                fontSize="11px"
                lineHeight="12px"
                color="rgba(255, 255, 255, 0.3)"
                textTransform="uppercase"
              >
                {t('Entry price')}
              </PrimaryTextSpan>
              <Input placeholder="Entry price" />
            </InputWrapper>

            <InputWrapper>
              <PrimaryTextSpan
                fontSize="11px"
                lineHeight="12px"
                color="rgba(255, 255, 255, 0.3)"
                textTransform="uppercase"
              >
                {t('Exit price')}
              </PrimaryTextSpan>
              <Input placeholder="Exit price" />
            </InputWrapper>

            <InputWrapper>
              <PrimaryTextSpan
                fontSize="11px"
                lineHeight="12px"
                color="rgba(255, 255, 255, 0.3)"
                textTransform="uppercase"
              >
                {t('Profit/Loss, USD')}
              </PrimaryTextSpan>
              <Input placeholder="Profit/Loss, USD" />
            </InputWrapper>

            <InputWrapper>
              <PrimaryTextSpan
                fontSize="11px"
                lineHeight="12px"
                color="rgba(255, 255, 255, 0.3)"
                textTransform="uppercase"
              >
                {t('Profit/Loss, %')}
              </PrimaryTextSpan>

              {/* <PrimaryTextSpan fontSize="16px">$1000</PrimaryTextSpan> */}
              <Input placeholder="Profit/Loss, %" />
            </InputWrapper>

            <InputWrapper>
              <PrimaryTextSpan
                fontSize="11px"
                lineHeight="12px"
                color="rgba(255, 255, 255, 0.3)"
                textTransform="uppercase"
              >
                {t('Liquidation price')}
              </PrimaryTextSpan>

              <Input placeholder="Profit/Loss, %" />
            </InputWrapper>

            <ButtonBuy>Calculate</ButtonBuy>
          </Wrapper>
        </ModalWrapper>
      )}
    </FlexContainer>
  );
};

export default PositionCalculator;

const ButtonSell = styled(ButtonWithoutStyles)`
  background-color: ${Colors.DANGER};
  border-radius: 4px;
  height: 40px;
  color: ${Colors.WHITE};
  font-weight: bold;
  font-size: 14px;
  line-height: 24px;
  display: flex;
  justify-content: center;
  align-items: center;
  margin-bottom: 18px;
  transition: background-color 0.2s ease;
  will-change: background-color;

  &:hover,
  &:focus {
    background-color: ${Colors.DANGER_DARK};
  }

  &:disabled {
    background-color: rgba(255, 255, 255, 0.04);
  }
`;

const ButtonBuy = styled(ButtonSell)`
  background-color: ${Colors.PRIMARY};
  color: ${Colors.DARK_BLACK};
  margin-bottom: 8px;

  &:hover {
    background-color: ${Colors.PRIMARY_LIGHT};
  }

  &:disabled {
    background-color: rgba(255, 255, 255, 0.04);
  }
`;

const Input = styled.input`
  background-color: transparent;
  border: none;
  outline: none;
  width: 100%;
  height: 100%;
  font-weight: bold;
  font-size: 14px;
  line-height: 16px;
  padding: 8px 0 8px 8px;
  border-radius: 4px;
  border: 1px solid rgba(255, 255, 255, 0.1);
  color: ${Colors.WHITE};
  background-color: rgba(255, 255, 255, 0.06);

  &:-webkit-input-placeholder {
    color: ${Colors.WHITE};
    opacity: 0.3;
    font-weight: normal;
  }

  &:-ms-input-placeholder {
    color: ${Colors.WHITE};
    opacity: 0.3;
    font-weight: normal;
  }

  &::placeholder {
    color: ${Colors.WHITE};
    opacity: 0.3;
    font-weight: normal;
  }
`;

const InputWrapper = styled(FlexContainer)`
  /* flex-direction: column; */
  justify-content: space-between;
  align-items: center;
  margin-bottom: 12px;
  input {
    width 50%;
  }

  &.half {
    width: 50%;
  }
`;

const TabLabelWrap = styled(FlexContainer)`
  width: 50%;
  position: relative;
`;
const TabLabel = styled.label<{ operation: 'sell' | 'buy' }>`
  width: 100%;
  margin: 0;
  padding: 4px 12px;
  font-size: 12px;
  font-weight: 700;
  text-align: center;
  cursor: pointer;
  color: ${Colors.WHITE_LIGHT};
  border: ${`1px solid ${Colors.INPUT_BORDER}`};

  border-radius: ${(props) =>
    props.operation === 'buy' ? '8px 0 0 8px' : '0 8px 8px 0'};
`;

const TabInput = styled.input<{ operation: 'sell' | 'buy' }>`
  position: absolute;
  z-index: -1;
  opacity: 0;

  &:checked + label {
    background-color: ${(props) =>
      props.operation === 'buy' ? Colors.PRIMARY : Colors.DANGER};
    color: ${(props) =>
      props.operation === 'buy' ? Colors.DARK_BLACK : Colors.WHITE};
    border-color: ${(props) =>
      props.operation === 'buy' ? Colors.PRIMARY : Colors.DANGER};
  }
`;

const ModalWrapper = styled(FlexContainer)`
  width: 260px;
  bottom: auto;
  @media (max-height: 700px) {
    top: auto;
    bottom: 0;
  }
`;

const Wrapper = styled(FlexContainer)`
  width: 100%;
  padding: 14px 12px 12px;
  box-shadow: 0px 12px 24px rgba(0, 0, 0, 0.25),
    0px 6px 12px rgba(0, 0, 0, 0.25);
  border-radius: 4px;
  background-color: rgba(0, 0, 0, 1);
  @supports ((-webkit-backdrop-filter: none) or (backdrop-filter: none)) {
    background-color: rgba(0, 0, 0, 0.4);
    backdrop-filter: blur(12px);
  }
`;

const ButtonClose = styled(ButtonWithoutStyles)`
  /* position: absolute;
  top: 12px;
  right: 12px; */
  display: flex;
  justify-content: center;
  align-items: center;
`;

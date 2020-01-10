import React, {
  ChangeEvent,
  useContext,
  useState,
  useRef,
  useEffect,
} from 'react';
import styled from '@emotion/styled';
import { FlexContainer } from '../../styles/FlexContainer';
import IconClose from '../../assets/svg/icon-popup-close.svg';
import { ButtonWithoutStyles } from '../../styles/ButtonWithoutStyles';
import SvgIcon from '../SvgIcon';
import {
  PrimaryTextParagraph,
  PrimaryTextSpan,
} from '../../styles/TextsElements';
import MaskedInput from 'react-text-mask';
import Fields from '../../constants/fields';
import { useStores } from '../../hooks/useStores';
import { Observer } from 'mobx-react-lite';

interface Props {
  setFieldValue: (field: any, value: any) => void;
  purchaseAtValue?: number;
  instrumentId: string;
}

function PurchaseAtPopup(props: Props) {
  const { setFieldValue, purchaseAtValue, instrumentId } = props;

  const handleChangePurchaseAt = (e: ChangeEvent<HTMLInputElement>) => {
    setFieldValue(Fields.PURCHASE_AT, e.target.value);
  };
  const [on, toggle] = useState(false);

  const wrapperRef = useRef<HTMLDivElement>(null);

  const { quotesStore } = useStores();

  const handleToggle = () => {
    toggle(!on);
  };

  const handleClickOutside = (e: any) => {
    if (wrapperRef.current && !wrapperRef.current.contains(e.target)) {
      toggle(false);
    }
  };

  useEffect(() => {
    document.addEventListener('mousedown', handleClickOutside);

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  });

  return (
    <FlexContainer position="relative" ref={wrapperRef}>
      <ButtonAutoClosePurchase onClick={handleToggle} type="button">
        <PrimaryTextSpan color="#fffccc">Purchase at</PrimaryTextSpan>
      </ButtonAutoClosePurchase>
      {on && (
        <FlexContainer position="absolute" top="20px" right="100%">
          <Wrapper
            position="relative"
            padding="16px"
            flexDirection="column"
            width="200px"
          >
            <ButtonClose onClick={handleToggle}>
              <SvgIcon {...IconClose} fill="rgba(255, 255, 255, 0.6)"></SvgIcon>
            </ButtonClose>
            <PrimaryTextParagraph marginBottom="16px">
              Purchase At
            </PrimaryTextParagraph>
            <FlexContainer
              margin="0 0 6px 0"
              alignItems="center"
              justifyContent="space-between"
            >
              <PrimaryTextSpan
                fontSize="11px"
                lineHeight="12px"
                color="rgba(255, 255, 255, 0.3)"
                textTransform="uppercase"
              >
                When Price is
              </PrimaryTextSpan>
              <InfoIcon
                width="14px"
                justifyContent="center"
                alignItems="center"
              >
                i
              </InfoIcon>
            </FlexContainer>
            <InputWrapper
              margin="0 0 16px 0"
              height="32px"
              width="100%"
              position="relative"
              justifyContent="space-between"
            >
              <MaskedInput
                mask={[/\d/, /\d/, /\d/, /\d/, /\d/, /\d/]}
                showMask={false}
                onChange={handleChangePurchaseAt}
                value={purchaseAtValue}
                guide={false}
                placeholder="Non Set"
                render={(ref, props) => (
                  <InputPnL ref={ref} {...props}></InputPnL>
                )}
              ></MaskedInput>
              <FlexContainer>
                <ButtonIncreaseDecreasePrice>
                  <PrimaryTextSpan
                    fontSize="16px"
                    fontWeight="bold"
                    color="rgba(255, 255, 255, 0.5)"
                  >
                    -
                  </PrimaryTextSpan>
                </ButtonIncreaseDecreasePrice>
                <ButtonIncreaseDecreasePrice>
                  <PrimaryTextSpan
                    fontSize="16px"
                    fontWeight="bold"
                    color="rgba(255, 255, 255, 0.5)"
                  >
                    +
                  </PrimaryTextSpan>
                </ButtonIncreaseDecreasePrice>
              </FlexContainer>
            </InputWrapper>
            <FlexContainer
              justifyContent="space-between"
              alignItems="center"
              margin="0 0 16px 0"
            >
              <PrimaryTextSpan
                color="rgba(255, 255, 255, 0.3)"
                fontSize="11px"
                lineHeight="12px"
              >
                Current price
              </PrimaryTextSpan>
              <PrimaryTextSpan
                textDecoration="underline"
                color="rgba(255, 255, 255, 0.8)"
                fontSize="11px"
                lineHeight="12px"
              >
                <Observer>
                  {() => <>{quotesStore.quotes[instrumentId].bid.c}</>}
                </Observer>
              </PrimaryTextSpan>
            </FlexContainer>
            <ButtonApply>Apply</ButtonApply>
          </Wrapper>
        </FlexContainer>
      )}
    </FlexContainer>
  );
}

export default PurchaseAtPopup;

const Wrapper = styled(FlexContainer)`
  box-shadow: 0px 12px 24px rgba(0, 0, 0, 0.25),
    0px 6px 12px rgba(0, 0, 0, 0.25);
  border-radius: 4px;
  background-color: rgba(0, 0, 0, 0.8);
  @supports ((-webkit-backdrop-filter: none) or (backdrop-filter: none)) {
    background-color: rgba(0, 0, 0, 0.4);
    backdrop-filter: blur(12px);
  }
`;

const InfoIcon = styled(FlexContainer)`
  font-size: 11px;
  border-radius: 50%;
  background-color: rgba(255, 255, 255, 0.2);
  color: #fffccc;
  font-style: italic;
`;

const ButtonClose = styled(ButtonWithoutStyles)`
  position: absolute;
  top: 12px;
  right: 12px;
  display: flex;
  justify-content: center;
  align-items: center;
`;

const InputPnL = styled.input`
  background-color: transparent;
  border: none;
  outline: none;
  width: 100%;
  height: 100%;
  font-weight: bold;
  font-size: 14px;
  line-height: 16px;
  color: #ffffff;
  padding: 8px 0 8px 8px;

  &:-webkit-input-placeholder {
    color: #fff;
    opacity: 0.3;
    font-weight: normal;
  }

  &:-ms-input-placeholder {
    color: #fff;
    opacity: 0.3;
    font-weight: normal;
  }

  &::placeholder {
    color: #fff;
    opacity: 0.3;
    font-weight: normal;
  }
`;

const InputWrapper = styled(FlexContainer)`
  border-radius: 4px;
  border: 1px solid rgba(255, 255, 255, 0.1);
  color: #fff;
  background-color: rgba(255, 255, 255, 0.06);
`;

const ButtonIncreaseDecreasePrice = styled(ButtonWithoutStyles)`
  padding: 0 4px;
  height: 100%;
`;

const ButtonApply = styled(ButtonWithoutStyles)`
  background: linear-gradient(0deg, #00fff2, #00fff2);
  border-radius: 4px;
  font-weight: bold;
  font-size: 14px;
  line-height: 16px;
  color: #003a38;
  height: 32px;
`;
const ButtonAutoClosePurchase = styled(ButtonWithoutStyles)`
  height: 40px;
  background: rgba(255, 255, 255, 0.12);
  border-radius: 4px;
  width: 100%;
  margin-bottom: 14px;
`;

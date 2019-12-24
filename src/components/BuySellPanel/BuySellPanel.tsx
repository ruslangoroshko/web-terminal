import React, { useState } from 'react';
import { FlexContainer } from '../../styles/FlexContainer';
import styled from '@emotion/styled';
import MaskedInput from 'react-text-mask';
import { ButtonWithoutStyles } from '../../styles/ButtonWithoutStyles';
import SvgIcon from '../SvgIcon';
import IconShevronUp from '../../assets/svg/icon-shevron-up.svg';
import IconShevronDown from '../../assets/svg/icon-shevron-down.svg';
import Toggle from '../Toggle';
import AutoClosePopup from './AutoClosePopup';
import PurchaseAtPopup from './PurchaseAtPopup';
import * as yup from 'yup';
import { v4 } from 'uuid';
import {
  OpenPositionModel,
  OpenPositionModelFormik,
} from '../../types/Positions';
import { InstrumentModelWSDTO } from '../../types/Instruments';
import { AskBidEnum } from '../../enums/AskBid';
import API from '../../helpers/API';
import NotificationTooltip from '../NotificationTooltip';
import { PrimaryTextSpan } from '../../styles/TextsElements';
import { Formik, Field, FieldProps, ErrorMessage, Form } from 'formik';
import Fields from '../../constants/fields';

interface Props {
  currencySymbol: string;
  accountId: OpenPositionModel['accountId'];
  instrument: InstrumentModelWSDTO;
  multiplier: OpenPositionModel['multiplier'];
}

interface OpenModel {
  sl: OpenPositionModel['sl'];
  tp: OpenPositionModel['tp'];
  slRate: OpenPositionModel['slRate'];
  tpRate: OpenPositionModel['tpRate'];
  investmentAmount: OpenPositionModel['investmentAmount'];
  multiplier: OpenPositionModel['multiplier'];
}

function BuySellPanel(props: Props) {
  const { currencySymbol, accountId, instrument, multiplier } = props;

  const initialValues: OpenPositionModelFormik = {
    processId: v4(),
    accountId,
    instrumentId: instrument.id,
    operation: AskBidEnum.Buy,
    multiplier,
    investmentAmount: '',
  };

  const validationSchema = yup.object().shape<OpenModel>({
    investmentAmount: yup
      .number()
      .min(instrument.minOperationVolume / multiplier, 'minOperationVolume')
      .max(instrument.maxOperationVolume / multiplier, 'maxOperationVolume')
      .required('Required amount'),
    multiplier: yup.number().required('Required amount'),
    tp: yup.number(),
    tpRate: yup.number(),
    sl: yup.number(),
    slRate: yup.number(),
  });

  const handleOpenPosition = (
    values: OpenPositionModelFormik,
    actions: any
  ) => {
    actions.setSubmitting(false);
    // API.openPosition({ ...values, operation: openPositionOption });
  };

  return (
    <FlexContainer
      padding="16px"
      flexDirection="column"
      backgroundColor="#1A1E22"
    >
      <Formik
        initialValues={initialValues}
        onSubmit={handleOpenPosition}
        validationSchema={validationSchema}
      >
        {({ isSubmitting, isValid, setFieldValue, values }) => (
          <CustomForm>
            <FlexContainer
              justifyContent="space-between"
              flexWrap="wrap"
              margin="0 0 4px 0"
            >
              <PrimaryTextSpan
                fontSize="11px"
                lineHeight="12px"
                textTransform="uppercase"
                opacity="0.3"
              >
                Invest
              </PrimaryTextSpan>
              <InfoIcon
                justifyContent="center"
                alignItems="center"
                width="14px"
                height="14px"
              >
                i
              </InfoIcon>
            </FlexContainer>
            <Field type="text" name={Fields.AMOUNT}>
              {({ field }: FieldProps) => (
                <FlexContainer
                  flexDirection="column"
                  position="relative"
                  padding="0 0 4px 0"
                >
                  <MaskedInput
                    {...field}
                    mask={[
                      currencySymbol,
                      /\d/,
                      /\d/,
                      /\d/,
                      /\d/,
                      /\d/,
                      /\d/,
                      /\d/,
                      /\d/,
                    ]}
                    showMask={false}
                    guide={false}
                    placeholder={currencySymbol}
                    render={(ref, props) => (
                      <InvestInput ref={ref} {...props} />
                    )}
                  ></MaskedInput>
                </FlexContainer>
              )}
            </Field>

            <FlexContainer
              justifyContent="space-between"
              flexWrap="wrap"
              margin="0 0 4px 0"
            >
              <PrimaryTextSpan
                fontSize="11px"
                lineHeight="12px"
                textTransform="uppercase"
                opacity="0.3"
              >
                Leverage
              </PrimaryTextSpan>
              <NotificationTooltip
                bgColor="#000000"
                textColor="#fff"
                classNameTooltip="leverage"
              >
                The amount you’d like to invest
              </NotificationTooltip>
            </FlexContainer>
            <Field type="text" name={Fields.MULTIPLIER}>
              {({ field }: FieldProps) => (
                <FlexContainer
                  flexDirection="column"
                  position="relative"
                  padding="0 0 4px 0"
                >
                  <MaskedInput
                    {...field}
                    disabled={true}
                    mask={['x', /\d/, /\d/, /\d/, /\d/, /\d/, /\d/]}
                    showMask={false}
                    guide={false}
                    placeholder="x"
                    render={(ref, props) => (
                      <InvestInput ref={ref} {...props} />
                    )}
                  ></MaskedInput>
                </FlexContainer>
              )}
            </Field>
            <FlexContainer
              justifyContent="space-between"
              flexWrap="wrap"
              margin="0 0 4px 0"
            >
              <PrimaryTextSpan
                fontSize="11px"
                lineHeight="12px"
                textTransform="uppercase"
                opacity="0.3"
              >
                Autoclose
              </PrimaryTextSpan>
              <InfoIcon
                justifyContent="center"
                alignItems="center"
                width="14px"
                height="14px"
              >
                i
              </InfoIcon>
            </FlexContainer>
            <FlexContainer position="relative">
              <Toggle>
                {({ on, toggle }) => (
                  <>
                    <ButtonAutoClosePurchase onClick={toggle}>
                      Set
                    </ButtonAutoClosePurchase>
                    {on && (
                      <FlexContainer
                        position="absolute"
                        top="20px"
                        right="100%"
                      >
                        <AutoClosePopup
                          toggle={toggle}
                          setFieldValue={setFieldValue}
                          values={values}
                        ></AutoClosePopup>
                      </FlexContainer>
                    )}
                  </>
                )}
              </Toggle>
            </FlexContainer>
            <FlexContainer
              justifyContent="space-between"
              flexWrap="wrap"
              margin="0 0 4px 0"
            >
              <PrimaryTextSpan
                fontSize="11px"
                lineHeight="12px"
                textTransform="uppercase"
                opacity="0.3"
              >
                Purchase at
              </PrimaryTextSpan>
              <InfoIcon
                justifyContent="center"
                alignItems="center"
                width="14px"
                height="14px"
              >
                i
              </InfoIcon>
            </FlexContainer>
            <FlexContainer position="relative">
              <Toggle>
                {({ on, toggle }) => (
                  <>
                    <ButtonAutoClosePurchase onClick={toggle}>
                      Set
                    </ButtonAutoClosePurchase>
                    {on && (
                      <FlexContainer
                        position="absolute"
                        top="20px"
                        right="100%"
                      >
                        <PurchaseAtPopup toggle={toggle}></PurchaseAtPopup>
                      </FlexContainer>
                    )}
                  </>
                )}
              </Toggle>
            </FlexContainer>
            <FlexContainer justifyContent="space-between" margin="0 0 8px 0">
              <PrimaryTextSpan
                fontSize="11px"
                lineHeight="12px"
                textTransform="uppercase"
                opacity="0.3"
              >
                VOLUME
              </PrimaryTextSpan>
              <ValueText>
                {currencySymbol}
                {1000200}
              </ValueText>
            </FlexContainer>
            <FlexContainer justifyContent="space-between" margin="0 0 16px 0">
              <PrimaryTextSpan
                fontSize="11px"
                lineHeight="12px"
                textTransform="uppercase"
                opacity="0.3"
              >
                Spread
              </PrimaryTextSpan>
              <ValueText>
                {currencySymbol}
                {1.3}
              </ValueText>
            </FlexContainer>
            <FlexContainer flexDirection="column">
              <ButtonBuy type="button" disabled={!isValid || isSubmitting}>
                <FlexContainer margin="0 8px 0 0">
                  <SvgIcon {...IconShevronUp} fill="#003A38"></SvgIcon>
                </FlexContainer>
                Buy
              </ButtonBuy>
              <ButtonSell type="button" disabled={!isValid || isSubmitting}>
                <FlexContainer margin="0 8px 0 0">
                  <SvgIcon {...IconShevronDown} fill="#fff"></SvgIcon>
                </FlexContainer>
                Sell
              </ButtonSell>
            </FlexContainer>
          </CustomForm>
        )}
      </Formik>
    </FlexContainer>
  );
}

export default BuySellPanel;

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

const CustomForm = styled(Form)`
  margin: 0;
`;

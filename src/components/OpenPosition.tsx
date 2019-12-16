import React, { useState, useContext } from 'react';
import { FlexContainer } from '../styles/FlexContainer';
import { Formik, Form, Field, FieldProps } from 'formik';
import { OpenPositionModel } from '../types/Positions';
import API from '../helpers/API';
import styled from '@emotion/styled';
import { ButtonWithoutStyles } from '../styles/ButtonWithoutStyles';
import * as yup from 'yup';
import Fields from '../constants/fields';
import { AskBidEnum } from '../enums/AskBid';
import { InstrumentModelWSDTO } from '../types/Instruments';
import { v4 } from 'uuid';
import { MainAppContext } from '../store/MainAppProvider';
import { QuotesContext } from '../store/QuotesProvider';

interface Props {
  quoteName: string;
  accountId: OpenPositionModel['accountId'];
  instrument: InstrumentModelWSDTO;
  multiplier: OpenPositionModel['multiplier'];
}

interface OpenModelRate {
  slRate: OpenPositionModel['slRate'];
  tpRate: OpenPositionModel['tpRate'];
  amount: OpenPositionModel['investmentAmount'];
  multiplier: OpenPositionModel['multiplier'];
}

interface OpenModel {
  sl: OpenPositionModel['sl'];
  tp: OpenPositionModel['tp'];
  amount: OpenPositionModel['investmentAmount'];
  multiplier: OpenPositionModel['multiplier'];
}

function OpenPosition(props: Props) {
  const { quoteName, accountId, instrument, multiplier } = props;
  const [isRate, setRate] = useState(false);

  const { quotes } = useContext(QuotesContext);

  const initialValues: OpenPositionModel = {
    processId: v4(),
    accountId,
    instrumentId: instrument.id,
    operation: AskBidEnum.Buy,
    multiplier,
    investmentAmount: 0,
  };

  const validationSchema = yup.object().shape<OpenModel | OpenModelRate>({
    amount: yup
      .number()
      .min(instrument.minOperationVolume, 'minOperationVolume')
      .max(instrument.maxOperationVolume, 'maxOperationVolume')
      .required('Required amount'),
    multiplier: yup.number().required('Required amount'),
    tp: yup.number(),
    tpRate: yup.number(),
    sl: yup.number(),
    slRate: yup.number(),
  });

  const handleOpenPosition = (values: OpenPositionModel, actions: any) => {
    actions.setSubmitting(false);
    API.openPosition({ ...values, operation: openPositionOption });
  };

  const [openPositionOption, setOpenPositionOption] = useState(AskBidEnum.Buy);

  const switchOpenPositionOption = (
    newOpenPositionOption: AskBidEnum
  ) => () => {
    setOpenPositionOption(newOpenPositionOption);
  };

  return (
    <OpenPositionWrapper flexDirection="column" padding="10px 0">
      <Formik
        initialValues={initialValues}
        onSubmit={handleOpenPosition}
        validationSchema={validationSchema}
      >
        {formikBag => (
          <CustomForm>
            <FlexContainer flexDirection="column">
              <FlexContainer margin="0 0 10px">
                <BuyButton
                  type="button"
                  isActive={openPositionOption === AskBidEnum.Buy}
                  onClick={switchOpenPositionOption(AskBidEnum.Buy)}
                >
                  Buy
                </BuyButton>
                <SellButton
                  type="button"
                  isActive={openPositionOption === AskBidEnum.Sell}
                  onClick={switchOpenPositionOption(AskBidEnum.Sell)}
                >
                  Sell
                </SellButton>
              </FlexContainer>
              <Field type="text" name={Fields.AMOUNT}>
                {({ field, meta }: FieldProps) => (
                  <FlexContainer
                    flexDirection="column"
                    position="relative"
                    padding="0 0 4px 0"
                  >
                    <InputLabel>Amount</InputLabel>
                    <Input
                      type="text"
                      {...field}
                      value={field.value || ''}
                      placeholder="Enter value"
                    />
                    <ErrorMessage>{meta.touched && meta.error}</ErrorMessage>
                  </FlexContainer>
                )}
              </Field>
              <Field type="text" name={Fields.MULTIPLIER}>
                {({ field, meta }: FieldProps) => (
                  <FlexContainer
                    flexDirection="column"
                    position="relative"
                    padding="0 0 4px 0"
                  >
                    <InputLabel>Multiplier</InputLabel>
                    <Input
                      type="text"
                      {...field}
                      value={field.value || ''}
                      disabled
                    />
                    <ErrorMessage>{meta.touched && meta.error}</ErrorMessage>
                  </FlexContainer>
                )}
              </Field>
              <FlexContainer justifyContent="space-between" margin="0 0 4px">
                <Field
                  type="text"
                  name={isRate ? Fields.TAKE_PROFIT_RATE : Fields.TAKE_PROFIT}
                >
                  {({ field, meta }: FieldProps) => (
                    <FlexContainer
                      flexDirection="column"
                      margin="0 10px 0 0"
                      position="relative"
                      padding="0 0 4px 0"
                    >
                      <InputLabel>Take profit</InputLabel>
                      <Input
                        type="text"
                        {...field}
                        value={field.value || ''}
                        placeholder="Enter take profit"
                      />
                      <ErrorMessage>{meta.touched && meta.error}</ErrorMessage>
                    </FlexContainer>
                  )}
                </Field>
                <Field
                  type="text"
                  name={isRate ? Fields.STOP_LOSS_RATE : Fields.STOP_LOSS}
                >
                  {({ field, meta }: FieldProps) => (
                    <FlexContainer
                      flexDirection="column"
                      position="relative"
                      padding="0 0 4px 0"
                    >
                      <InputLabel>Stop loss</InputLabel>
                      <Input
                        type="text"
                        {...field}
                        value={field.value || ''}
                        placeholder="Enter stop loss"
                      />
                      <ErrorMessage>{meta.touched && meta.error}</ErrorMessage>
                    </FlexContainer>
                  )}
                </Field>
              </FlexContainer>
              <SubmitButton
                type="submit"
                disabled={!formikBag.isValid || formikBag.isSubmitting}
              >
                Open {quoteName} position
              </SubmitButton>
            </FlexContainer>
          </CustomForm>
        )}
      </Formik>
    </OpenPositionWrapper>
  );
}

export default OpenPosition;

const OpenPositionWrapper = styled(FlexContainer)`
  margin-bottom: 20px;
  :last-of-type {
    margin-bottom: 0;
  }
`;

const Input = styled.input`
  border: 1px solid #353c4d;
  width: 100%;
  background-color: transparent;
  padding: 4px 10px;
  color: #fff;
`;

const InputLabel = styled.p`
  font-size: 14px;
  margin-bottom: 4px;
  color: #fff;
  font-weight: bold;
`;

const BuyButton = styled(ButtonWithoutStyles)<{ isActive: boolean }>`
  background-color: ${props => (props.isActive ? '#2dac41' : 'transparent')};
  padding: 8px;
  color: #fff;
  transition: background-color 0.2s ease;
  width: 100%;
  border-radius: 4px;
  margin-right: 4px;
  &:hover {
    cursor: pointer;
    background-color: ${props => (props.isActive ? '#2dac41' : '#41ec5c')};
  }
`;

const SellButton = styled(BuyButton)`
  background-color: ${props => (props.isActive ? '#e63757' : 'transparent')};
  margin-right: 0;

  &:hover {
    background-color: ${props => (props.isActive ? '#e63757' : '#db1b3f')};
  }
`;

const SubmitButton = styled(ButtonWithoutStyles)`
  padding: 10px;
  color: #fff;
  transition: background-color 0.2s ease;
  width: 100%;
  border-radius: 4px;
  border: 2px solid #2c7be5;
  background-color: transparent;

  &:hover {
    cursor: pointer;
    background-color: #2c7be5;
  }

  &:disabled {
    pointer-events: none;
    &:hover {
      background-color: transparent;
    }
  }
`;

const ErrorMessage = styled.span`
  color: red;
  position: absolute;
  bottom: 0;
`;

const CustomForm = styled(Form)`
  margin: 0;
`;

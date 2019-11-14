import React, { useState } from 'react';
import { FlexContainer } from '../styles/FlexContainer';
import { Formik, Form, Field, FieldProps } from 'formik';
import { OpenPositionModel } from '../types/Positions';
import API from '../helpers/API';
import styled from '@emotion/styled';
import { ButtonWithoutStyles } from '../styles/ButtonWithoutStyles';
import * as yup from 'yup';

interface Props {
  quoteName: string;
  accountId: OpenPositionModel['accountId'];
  instrumentId: OpenPositionModel['instrumentId'];
}

enum OpenPositionOption {
  Buy,
  Sell,
}

function OpenPosition(props: Props) {
  const { quoteName, accountId, instrumentId } = props;

  const validationSchema = yup.object().shape({
    tp: yup
      .string()
      .nullable()
      .required('Required take profit'),
    sl: yup
      .string()
      .nullable()
      .required('Required stop loss'),
    volume: yup
      .number()
      .nullable()
      .required('Required lot'),
  });

  const initialValues: OpenPositionModel = {
    accountId,
    instrumentId,
    operation: 3,
  };

  const handleOpenPosition = (values: OpenPositionModel, actions: any) => {
    actions.setSubmitting(false);
    API.openPosition({ ...values, operation: openPositionOption });
  };

  const [openPositionOption, setOpenPositionOption] = useState(
    OpenPositionOption.Buy
  );

  const switchOpenPositionOption = (
    newOpenPositionOption: OpenPositionOption
  ) => () => {
    setOpenPositionOption(newOpenPositionOption);
  };

  return (
    <OpenPositionWrapper flexDirection="column" padding="10px 0" width="200px">
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
                  isActive={openPositionOption === OpenPositionOption.Buy}
                  onClick={switchOpenPositionOption(OpenPositionOption.Buy)}
                >
                  Buy
                </BuyButton>
                <SellButton
                  type="button"
                  isActive={openPositionOption === OpenPositionOption.Sell}
                  onClick={switchOpenPositionOption(OpenPositionOption.Sell)}
                >
                  Sell
                </SellButton>
              </FlexContainer>
              <Field type="text" name="volume">
                {({ field, form, meta }: FieldProps) => (
                  <FlexContainer
                    flexDirection="column"
                    position="relative"
                    padding="0 0 20px 0"
                  >
                    <InputLabel>Lot</InputLabel>
                    <Input
                      type="text"
                      {...field}
                      value={field.value || ''}
                      placeholder="Enter lot"
                    />
                    <ErrorMessage>{meta.touched && meta.error}</ErrorMessage>
                  </FlexContainer>
                )}
              </Field>
              <FlexContainer justifyContent="space-between" margin="0 0 20px">
                <Field type="text" name="tp">
                  {({ field, form, meta }: FieldProps) => (
                    <FlexContainer
                      flexDirection="column"
                      margin="0 10px 0 0"
                      position="relative"
                      padding="0 0 20px 0"
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
                <Field type="text" name="sl">
                  {({ field, form, meta }: FieldProps) => (
                    <FlexContainer
                      flexDirection="column"
                      position="relative"
                      padding="0 0 20px 0"
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
                disabled={
                  //   !formikBag.touched ||
                  !formikBag.isValid || formikBag.isSubmitting
                }
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

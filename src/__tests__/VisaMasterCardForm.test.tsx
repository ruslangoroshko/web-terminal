import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react';
import VisaMasterCardForm from '../components/DepositPopup/VisaMasterCardForm';
import testIds from '../constants/testIds';
import axios from 'axios';
import API_LIST from '../helpers/apiList';
import {
  CreateDepositInvoiceParams,
  CreateDepositInvoiceDTO,
} from '../types/DepositTypes';
import { DepositRequestStatusEnum } from '../enums/DepositRequestStatusEnum';

const API_DEPOSIT_STRING = 'http://localhost:5680/deposit';
// process.env.NODE_ENV === 'development'
//   ? JSON.stringify('/deposit')
//   : JSON.stringify();

jest.mock('react-router-dom', () => ({
  useHistory: () => ({
    push: jest.fn(),
  }),
}));

jest.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: jest.fn(),
  }),
}));

jest.mock('mixpanel-browser', () => ({
  init: jest.fn(),
  track: jest.fn(),
}));

test('User can make a deposit with Visa Card', () => {
  const createDepositInvoice = async (params: CreateDepositInvoiceParams) => {
    const response = await axios.post<CreateDepositInvoiceDTO>(
      `${API_DEPOSIT_STRING}${API_LIST.DEPOSIT.CREATE_INVOICE}`,
      params
    );
    return response.data;
  };
  const visaCardValues = {
    cardNumber: '4263982640269299',
    cvv: '837',
    expirationDate: new Date(`2023-02`).getTime(),
    fullName: 'Testing Name',
    amount: 500,
    accountId: 'stl00001067usd',
  };

  return createDepositInvoice(visaCardValues).then((data) => {
    expect(data.status).toBe(DepositRequestStatusEnum.Success);
  });
});

test('User can  make a deposit with Master Card', async () => {
  const createDepositInvoice = async (params: CreateDepositInvoiceParams) => {
    const response = await axios.post<CreateDepositInvoiceDTO>(
      `${API_DEPOSIT_STRING}${API_LIST.DEPOSIT.CREATE_INVOICE}`,
      params
    );
    return response.data;
  };
  const visaCardValues = {
    cardNumber: '5425233430109903',
    cvv: '837',
    expirationDate: new Date(`2023-04`).getTime(),
    fullName: 'Testing Master',
    amount: 500,
    accountId: 'stl00001067usd',
  };

  const data = await createDepositInvoice(visaCardValues);
  expect(data.status).toBe(DepositRequestStatusEnum.Success);
});

// expect.assertions(1);

// const { getByTestId } = render(<VisaMasterCardForm />);

// fireEvent.change(getByTestId(testIds.VISAMASTERFORM_AMOUNT), {
//   target: { value: '500' },
// });

// fireEvent.change(getByTestId(testIds.VISAMASTERFORM_CARD), {
//   target: { value: '4263982640269299' },
// });

// fireEvent.change(getByTestId(testIds.VISAMASTERFORM_CARDHOLDER_NAME), {
//   target: { value: 'Testing Name' },
// });

// fireEvent.change(getByTestId(testIds.VISAMASTERFORM_DATE), {
//   target: { value: '02/2023' },
// });

// fireEvent.change(getByTestId(testIds.VISAMASTERFORM_CVV), {
//   target: { value: '837' },
// });//

// expect(getByTestId(testIds.VISAMASTERFORM_AMOUNT)).toHaveProperty(
//   'value',
//   '500'
// );

// await waitFor(
//   () => fireEvent.click(getByTestId(testIds.VISAMASTERFORM_SUBMIT)),

// );

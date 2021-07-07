/**
 * @jest-environment node
 */
import axios from 'axios';
import API_LIST from '../helpers/apiList';
import {
  CreateDepositInvoiceParams,
  CreateDepositInvoiceDTO,
} from '../types/DepositTypes';
import { DepositRequestStatusEnum } from '../enums/DepositRequestStatusEnum';
import AUTH_API_LIST from '../helpers/apiListAuth';
import { UserAuthenticate, UserAuthenticateResponse } from '../types/UserInfo';
import RequestHeaders from '../constants/headers';

const API_DEPOSIT_STRING = process.env.TRADING_URL || 'http://localhost:5682';
const AUTH_URL = process.env.API_AUTH_STRING || 'http://localhost:5679';
const cardNumber = process.env.TEST_CARDNUMBER || '4929980372988546';
const cvv = process.env.TEST_CARD_CVV || '837';
const expirationDate = process.env.TEST_CARD_EXPIRE || '2024-09';
const cardHolder = process.env.TEST_CARDHOLDER || 'Testing Name';

jest.setTimeout(15000);

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

const authenticate = async (credentials: UserAuthenticate, authUrl: string) => {
  const response = await axios.post<UserAuthenticateResponse>(
    `${authUrl}${AUTH_API_LIST.TRADER.AUTHENTICATE}`,
    credentials
  );
  return response.data;
};

const createDepositInvoice = async (
  params: CreateDepositInvoiceParams,
  token: string
) => {
  const response = await axios.post<CreateDepositInvoiceDTO>(
    `${API_DEPOSIT_STRING}/deposit${API_LIST.DEPOSIT.CREATE_INVOICE}`,
    params,
    {
      headers: {
        [RequestHeaders.AUTHORIZATION]: token,
      },
    }
  );
  return response.data;
};

test('User can make a deposit with card, response status', async () => {
  expect.assertions(1);
  const { data: authenticateResponse } = await authenticate(
    {
      email: 'qweasd@mailinator.com',
      password: 'qwe123qwe',
    },
    AUTH_URL
  );

  const visaCardValues = {
    cardNumber,
    cvv,
    expirationDate: new Date(expirationDate).getTime(),
    fullName: cardHolder,
    amount: 10,
    accountId: 'stl00000214usd',
  };
  const response = await createDepositInvoice(
    visaCardValues,
    authenticateResponse.token
  );
  expect(response.status).toEqual(DepositRequestStatusEnum.Success);
});

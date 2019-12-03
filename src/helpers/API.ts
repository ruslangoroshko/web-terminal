import axios from 'axios';
import {
  OpenPositionModel,
  OpenPositionResponseDTO,
  ClosePositionModel,
} from '../types/Positions';
import API_LIST from './apiList';
import { AccountModelDTO } from '../types/Accounts';
import {
  UserAuthenticate,
  UserAuthenticateResponse,
  UserRegistration,
} from '../types/UserInfo';
import { HistoryCandlesType, CandleDTO } from '../types/HistoryTypes';

class API {
  convertParamsToFormData = (params: any) => {
    const formData = new FormData();
    Object.keys(params).forEach(key => {
      formData.append(key, params[key]);
    });
    return formData;
  };

  openPosition = async (position: OpenPositionModel) => {
    const formData = this.convertParamsToFormData(position);
    const response = await axios.post<OpenPositionResponseDTO>(
      `${API_STRING}${API_LIST.POSITIONS.OPEN}`,
      formData
    );
    return response.data;
  };

  closePosition = async (position: ClosePositionModel) => {
    const response = await axios.post<OpenPositionResponseDTO>(
      `${API_STRING}${API_LIST.POSITIONS.CLOSE}`,
      position
    );
    return response.data;
  };

  getAccounts = async () => {
    const response = await axios.get<AccountModelDTO[]>(
      `${API_STRING}${API_LIST.ACCOUNTS.GET_ACCOUNTS}`
    );
    return response.data;
  };

  getAccountById = async (id: number) => {
    const response = await axios.get<AccountModelDTO>(
      `${API_STRING}${API_LIST.ACCOUNTS.GET_ACCOUNT_BY_ID}`,
      {
        params: {
          id,
        },
      }
    );
    return response.data;
  };

  getHeaders = async () => {
    const response = await axios.get<string[]>(
      `${API_STRING}${API_LIST.ACCOUNTS.GET_HEADERS}`
    );
    return response.data;
  };

  authenticate = async (credentials: UserAuthenticate) => {
    const response = await axios.post<UserAuthenticateResponse>(
      `${API_STRING}${API_LIST.TRADER.AUTHENTICATE}`,
      credentials
    );
    return response.data;
  };

  signUpNewTrader = async (credentials: UserRegistration) => {
    const response = await axios.post<UserAuthenticateResponse>(
      `${API_STRING}${API_LIST.TRADER.REGISTER}`,
      credentials
    );
    return response.data;
  };

  getPriceHistory = async (params: HistoryCandlesType) => {
    const response = await axios.get<CandleDTO[]>(
      `${API_STRING}${API_LIST.PRICE_HISTORY.CANDLES}`,
      {
        params,
      }
    );
    const bars = response.data.map(item => ({
      time: item.d * 1000,
      low: item.l,
      high: item.h,
      open: item.o,
      close: item.c,
    }));
    return bars;
  };
}

export default new API();

import axios from 'axios';
import {
  OpenPositionModel,
  OpenPositionResponseDTO,
  ClosePositionModel,
  RemovePendingOrders,
  OpenPositionModelFormik,
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
      if (params[key] !== undefined) {
        formData.append(key, params[key]);
      }
    });
    return formData;
  };

  openPosition = async (position: OpenPositionModelFormik) => {
    const formData = this.convertParamsToFormData(position);
    const response = await axios.post<OpenPositionResponseDTO>(
      `${API_STRING}${API_LIST.POSITIONS.OPEN}`,
      formData
    );
    return response.data;
  };

  closePosition = async (position: ClosePositionModel) => {
    const formData = this.convertParamsToFormData(position);

    const response = await axios.post<OpenPositionResponseDTO>(
      `${API_STRING}${API_LIST.POSITIONS.CLOSE}`,
      formData
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

  getKeyValue = async (key: string) => {
    const response = await axios.get<string>(
      `${API_STRING}${API_LIST.KEY_VALUE.GET}`,
      {
        params: {
          key,
        },
      }
    );
    return response.data;
  };

  setKeyValue = async (params: { key: string; value: string }) => {
    const formData = this.convertParamsToFormData(params);
    const response = await axios.post<void>(
      `${API_STRING}${API_LIST.KEY_VALUE.POST}`,
      formData
    );
    return response.data;
  };

  openPendingOrder = async (position: OpenPositionModelFormik) => {
    const formData = this.convertParamsToFormData(position);
    const response = await axios.post<OpenPositionResponseDTO>(
      `${API_STRING}${API_LIST.PENDING_ORDERS.ADD}`,
      formData
    );
    return response.data;
  };

  removePendingOrder = async (position: RemovePendingOrders) => {
    const formData = this.convertParamsToFormData(position);
    const response = await axios.post<OpenPositionResponseDTO>(
      `${API_STRING}${API_LIST.PENDING_ORDERS.REMOVE}`,
      formData
    );
    return response.data;
  };
}

export default new API();

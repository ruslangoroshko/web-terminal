import axios from 'axios';
import {
  OpenPositionResponseDTO,
  ClosePositionModel,
  RemovePendingOrders,
  UpdateSLTP,
  OpenPositionModel,
  OpenPendingOrder,
} from '../types/Positions';
import API_LIST from './apiList';
import { AccountModelDTO } from '../types/Accounts';
import {
  UserAuthenticate,
  UserAuthenticateResponse,
  UserRegistration,
} from '../types/UserInfo';
import { HistoryCandlesType, CandleDTO } from '../types/HistoryTypes';
import {
  PositionsHistoryReportDTO,
  BalanceHistoryDTO,
  GetHistoryParams,
  BalanceHistoryReport,
} from '../types/HistoryReportTypes';
import AUTH_API_LIST from './apiListAuth';
import { ChangePasswordParams } from '../types/TraderTypes';
import {
  PersonalDataResponse,
  PersonalDataParams,
  PersonalDataPostResponse,
} from '../types/PersonalDataTypes';
import { CountriesEnum } from '../enums/CountriesEnum';
import { Country } from '../types/CountriesTypes';
import { DocumentTypeEnum } from '../enums/DocumentTypeEnum';
import { getProcessId } from './getProcessId';

class API {
  convertParamsToFormData = (params: { [key: string]: any }) => {
    const formData = new FormData();
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        formData.append(key, value);
      }
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
      `${API_AUTH_STRING}${AUTH_API_LIST.TRADER.AUTHENTICATE}`,
      credentials
    );
    return response.data;
  };

  signUpNewTrader = async (credentials: UserRegistration) => {
    const response = await axios.post<UserAuthenticateResponse>(
      `${API_AUTH_STRING}${AUTH_API_LIST.TRADER.REGISTER}`,
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
      time: item.d,
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

  openPendingOrder = async (position: OpenPendingOrder) => {
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

  updateSLTP = async (position: UpdateSLTP) => {
    const formData = this.convertParamsToFormData(position);
    const response = await axios.post<OpenPositionResponseDTO>(
      `${API_STRING}${API_LIST.POSITIONS.UPDATE_SL_TP}`,
      formData
    );
    return response.data;
  };

  confirmEmail = async (link: string) => {
    const response = await axios.post<void>(
      `${API_AUTH_STRING}${AUTH_API_LIST.PERSONAL_DATA.CONFIRM}`,
      {
        link,
      }
    );
    return response.data;
  };

  getPositionsHistory = async (params: GetHistoryParams) => {
    const response = await axios.get<PositionsHistoryReportDTO>(
      `${API_STRING}${API_LIST.REPORTS.POSITIONS_HISTORY}`,
      {
        params,
      }
    );
    return response.data;
  };

  getBalanceHistory = async (params: GetHistoryParams) => {
    const response = await axios.get<BalanceHistoryReport>(
      `${API_STRING}${API_LIST.REPORTS.BALANCE_HISTORY}`,
      {
        params,
      }
    );
    return response.data;
  };

  changePassword = async (params: ChangePasswordParams) => {
    const response = await axios.post<BalanceHistoryDTO[]>(
      `${API_AUTH_STRING}${AUTH_API_LIST.TRADER.CHANGE_PASSWORD}`,
      params
    );
    return response.data;
  };

  getPersonalData = async (processId: string) => {
    const response = await axios.get<PersonalDataResponse>(
      `${API_AUTH_STRING}${AUTH_API_LIST.PERSONAL_DATA.GET}`,
      {
        params: {
          processId,
        },
      }
    );
    return response.data;
  };

  postPersonalData = async (params: PersonalDataParams) => {
    const formData = this.convertParamsToFormData(params);

    const response = await axios.post<PersonalDataPostResponse>(
      `${API_AUTH_STRING}${AUTH_API_LIST.PERSONAL_DATA.POST}`,
      formData
    );
    return response.data;
  };

  getCountries = async (lang = CountriesEnum.EN) => {
    const response = await axios.get<Country[]>(
      `${API_AUTH_STRING}${AUTH_API_LIST.COMMON.COUNTRIES}/${lang}`
    );
    return response.data;
  };

  postDocument = async (documentType: DocumentTypeEnum, file: Blob) => {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('processId', getProcessId());

    const response = await axios.post<void>(
      `${API_AUTH_STRING}${AUTH_API_LIST.DOCUMENT.POST}/${documentType}`,
      formData
    );
    return response.data;
  }
}

export default new API();

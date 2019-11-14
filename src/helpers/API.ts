import axios from 'axios';
import {
  OpenPositionModel,
  OpenPositionResponseDTO,
  ClosePositionModel,
} from '../types/Positions';
import API_LIST from './apiList';
import { AccountModelDTO } from '../types/Accounts';

class API {
  openPosition = async (position: OpenPositionModel) => {
    const response = await axios.post<OpenPositionResponseDTO>(
      `${API_STRING}${API_LIST.POSITIONS.OPEN}`,
      position
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
}

export default new API();

import API from './API';
import KeysInApi from '../constants/keysInApi';

export const setFavouriteInstruments = (instrumentIds: string[]) => {
  return API.setKeyValue({
    key: KeysInApi.FAVOURITE_INSTRUMENTS,
    value: JSON.stringify(instrumentIds),
  });
};

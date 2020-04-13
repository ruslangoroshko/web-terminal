import { InstrumentsStore } from '../store/InstrumentsStore';
import API from './API';
import KeysInApi from '../constants/keysInApi';
import { AccountTypeEnum } from '../enums/AccountTypeEnum';

export const activeInstrumentsInit = async (
  instrumentsStore: InstrumentsStore,
  accountId: string, accountType: AccountTypeEnum
) => {
  const selectedInstruments = await API.getFavoriteInstrumets(
  {
      accountId, type: accountType
  }
  );

  instrumentsStore.setActiveInstrumentsIds(
    selectedInstruments
  )

  instrumentsStore.setActiveInstrument(
    instrumentsStore.instruments[0].instrumentItem.id
  );
};

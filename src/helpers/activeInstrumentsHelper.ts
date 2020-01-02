import { InstrumentsStore } from '../store/InstrumentsStore';
import API from './API';
import KeysInApi from '../constants/keysInApi';

export const activeInstrumentsInit = async (
  instrumentsStore: InstrumentsStore
) => {
  let favouriteInstruments = await API.getKeyValue(
    KeysInApi.FAVOURITE_INSTRUMENTS
  );
  if (favouriteInstruments) {
    instrumentsStore.activeInstrumentsIds = JSON.parse(favouriteInstruments);
  } else {
    const newFavouriteInstrumentsIds = instrumentsStore.instruments.map(
      item => item.id
    );

    const newFavouriteInstruments = newFavouriteInstrumentsIds.length
      ? JSON.stringify(newFavouriteInstrumentsIds.slice(0, 3))
      : JSON.stringify([]);

    await API.setKeyValue({
      key: KeysInApi.FAVOURITE_INSTRUMENTS,
      value: newFavouriteInstruments,
    });

    instrumentsStore.activeInstrumentsIds = newFavouriteInstrumentsIds;
  }

  instrumentsStore.activeInstrument = instrumentsStore.activeInstruments[0];
};

export const toggleFavouriteInstrument = async ({
  instrumentsStore,
  newId,
}: {
  instrumentsStore: InstrumentsStore;
  newId: string;
}) => {
  const newIds =
    instrumentsStore.activeInstrumentsIds.indexOf(newId) > -1
      ? instrumentsStore.activeInstrumentsIds.filter(item => item !== newId)
      : [...instrumentsStore.activeInstrumentsIds, newId];
  await API.setKeyValue({
    key: KeysInApi.FAVOURITE_INSTRUMENTS,
    value: JSON.stringify(newIds),
  });
  instrumentsStore.activeInstrumentsIds = newIds;
};

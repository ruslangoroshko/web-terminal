import { InstrumentsStore } from '../store/InstrumentsStore';
import API from './API';
import KeysInApi from '../constants/keysInApi';

export const activeInstrumentsInit = async (
  instrumentsStore: InstrumentsStore
) => {
  const selectedInstruments = await API.getKeyValue(
    KeysInApi.SELECTED_INSTRUMENTS
  );

  const parsedValue = selectedInstruments
    ? JSON.parse(selectedInstruments)
    : [];

  // TODO: проверить айдишки в наличии инструментов
  if (parsedValue.length) {
    instrumentsStore.activeInstrumentsIds = parsedValue;
  } else {
    const newFavouriteInstrumentsIds = instrumentsStore.instruments.map(
      item => item.id
    );

    const newFavouriteInstruments = newFavouriteInstrumentsIds.length
      ? JSON.stringify(newFavouriteInstrumentsIds.slice(0, 3))
      : JSON.stringify([]);

    await API.setKeyValue({
      key: KeysInApi.SELECTED_INSTRUMENTS,
      value: newFavouriteInstruments,
    });

    instrumentsStore.activeInstrumentsIds = newFavouriteInstrumentsIds;
  }

  instrumentsStore.setActiveInstrument(instrumentsStore.activeInstruments[0]);
  console.log(
    'TCL: instrumentsStore.activeInstrument',
    instrumentsStore.activeInstrument
  );

  const favouriteInstruments = await API.getKeyValue(
    KeysInApi.FAVOURITE_INSTRUMENTS
  );

  instrumentsStore.favouriteInstrumentsIds = favouriteInstruments
    ? JSON.parse(favouriteInstruments)
    : [];
};

export const toggleFavouriteInstrument = async ({
  instrumentsStore,
  newId,
}: {
  instrumentsStore: InstrumentsStore;
  newId: string;
}) => {
  instrumentsStore.favouriteInstrumentsIds = instrumentsStore.favouriteInstrumentsIds.includes(
    newId
  )
    ? instrumentsStore.favouriteInstrumentsIds.filter(item => item !== newId)
    : [...instrumentsStore.favouriteInstrumentsIds, newId];
  await API.setKeyValue({
    key: KeysInApi.FAVOURITE_INSTRUMENTS,
    value: JSON.stringify(instrumentsStore.favouriteInstrumentsIds),
  });
};

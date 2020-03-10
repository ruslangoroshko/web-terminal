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

  if (parsedValue.length) {
    instrumentsStore.setActiveInstrumentsIds(
      instrumentsStore.instruments
        .filter(item => parsedValue.includes(item.instrumentItem.id))
        .map(item => item.instrumentItem.id)
    );
  } else {
    const newFavouriteInstrumentsIds = instrumentsStore.instruments.map(
      item => item.instrumentItem.id
    );

    const newFavouriteInstruments = newFavouriteInstrumentsIds.length
      ? JSON.stringify(newFavouriteInstrumentsIds.slice(0, 3))
      : JSON.stringify([]);

    await API.setKeyValue({
      key: KeysInApi.SELECTED_INSTRUMENTS,
      value: newFavouriteInstruments,
    });

    instrumentsStore.setActiveInstrumentsIds(newFavouriteInstrumentsIds);
  }

  instrumentsStore.setActiveInstrument(
    instrumentsStore.instruments[0].instrumentItem.id
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

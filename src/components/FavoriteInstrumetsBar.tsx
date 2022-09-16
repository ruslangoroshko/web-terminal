import { observer } from 'mobx-react-lite';
import React, { useCallback, useEffect } from 'react';

import IconAddInstrument from '../assets/svg/icon-instrument-add.svg';
import { FlexContainer } from '../styles/FlexContainer';
import AddInstrumentsPopup from './AddInstrumentsPopup';
import InstrumentsScrollWrapper from './InstrumentsScrollWrapper';
import SvgIcon from '../components/SvgIcon';
import Toggle from '../components/Toggle';
import styled from '@emotion/styled';
import { ButtonWithoutStyles } from '../styles/ButtonWithoutStyles';
import { useStores } from '../hooks/useStores';
import { LOCAL_INSTRUMENT_ACTIVE } from '../constants/global';
import { AccountTypeEnum } from '../enums/AccountTypeEnum';
import API from '../helpers/API';
import Colors from '../constants/Colors';

const FavoriteInstrumetsBar = observer(() => {
  const { mainAppStore, instrumentsStore } = useStores();

  const fetchFavoriteInstruments = useCallback(async () => {
    if (mainAppStore.activeAccount) {
      let alreadyAdded = false;
      setTimeout(() => {
        if (!alreadyAdded) {
          instrumentsStore.setActiveInstrumentsIds(
            instrumentsStore.instruments
              .slice(0, 5)
              .map((instr) => instr.instrumentItem.id)
          );
          instrumentsStore.switchInstrument(
            instrumentsStore.instruments[0].instrumentItem.id,
            false,
            false
          );
        }
      }, 5000);
      try {
        const response = await API.getFavoriteInstrumets({
          type: mainAppStore.activeAccount?.isLive
            ? AccountTypeEnum.Live
            : AccountTypeEnum.Demo,
          accountId: mainAppStore.activeAccountId,
        });
        alreadyAdded = true;
        let responseToCheck: string[] = [];
        response.map((instrumentId) => {
          if (instrumentsStore.instruments.find(
            (item) => (item.instrumentItem.id === instrumentId)
          )) {
            responseToCheck.push(instrumentId);
          }
          return instrumentId;
        });
        if (responseToCheck.length === 0) {
          const newInstruments = [];
          for (let i = 0; i < 5; i++) {
            if (instrumentsStore.instruments[i]) {
              newInstruments.push(instrumentsStore.instruments[i].instrumentItem.id)
            }
          }
          responseToCheck = newInstruments;
        }
        instrumentsStore.setActiveInstrumentsIds(responseToCheck);
        const checkAvailable =
          mainAppStore.paramsAsset ||
          localStorage.getItem(LOCAL_INSTRUMENT_ACTIVE);
        const lastActive =
          checkAvailable &&
          instrumentsStore.instruments.find(
            (instrument) => instrument.instrumentItem.id === checkAvailable
          )
            ? checkAvailable
            : false;
        if (checkAvailable && !instrumentsStore.activeInstrumentsIds.includes(checkAvailable)) {
          if (instrumentsStore.activeInstrumentsIds.length > 6) {
            instrumentsStore.activeInstrumentsIds[6] = checkAvailable;
          } else {
            instrumentsStore.activeInstrumentsIds.push(checkAvailable);
          }
          API.postFavoriteInstrumets({
            accountId: mainAppStore.activeAccount!.id,
            type: mainAppStore.activeAccount!.isLive
              ? AccountTypeEnum.Live
              : AccountTypeEnum.Demo,
            instruments: instrumentsStore.activeInstrumentsIds,
          });
        }
        await instrumentsStore.switchInstrument(
          lastActive ||
            responseToCheck[0] ||
            instrumentsStore.instruments[0].instrumentItem.id
        );
      } catch (error) {}
    }
  }, [
    mainAppStore.activeAccountId,
    mainAppStore.activeAccount,
    instrumentsStore.instruments,
  ]);

  useEffect(() => {
    if (instrumentsStore.instruments.length) {
      fetchFavoriteInstruments();
    }
  }, [instrumentsStore.instruments]);

  return (
    <FlexContainer
      marginBottom="20px"
      height={instrumentsStore.activeInstruments.length !== 0 ? '40px' : '0px'}
    >
      {instrumentsStore.activeInstruments.length !== 0 && (
        <>
          <InstrumentsScrollWrapper />
          <FlexContainer position="relative" alignItems="center">
            <Toggle>
              {({ on, toggle }) => (
                <>
                  <AddIntrumentButton onClick={toggle}>
                    <SvgIcon {...IconAddInstrument} fillColor={Colors.ACCENT} />
                  </AddIntrumentButton>
                  {on && <AddInstrumentsPopup toggle={toggle} />}
                </>
              )}
            </Toggle>
          </FlexContainer>
        </>
      )}
    </FlexContainer>
  );
});

export default FavoriteInstrumetsBar;

const AddIntrumentButton = styled(ButtonWithoutStyles)`
  width: 24px;
  height: 24px;
  &:hover {
    background-color: rgba(255, 255, 255, 0.2);
  }
`;

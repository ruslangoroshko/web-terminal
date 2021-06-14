export const getStatesSnapshot = (mainAppStore: any) => {
    const allStates = {
        mainAppStore: {
            initModel: mainAppStore.initModel,
            accounts: mainAppStore.accounts,
            profileStatus: mainAppStore.profileStatus,
        },
        historyStore: {
            positionsHistoryReport: mainAppStore.rootStore.historyStore.positionsHistoryReport,
        },
        instrumentsStore: {
            instruments: mainAppStore.rootStore.instrumentsStore.instruments,
            activeInstrumentsIds: mainAppStore.rootStore.instrumentsStore.activeInstruments,
            favouriteInstrumentsIds: mainAppStore.rootStore.instrumentsStore.favouriteInstrumentsIds,
            activeInstrumentId: mainAppStore.rootStore.instrumentsStore.activeInstrumentId,
            instrumentGroups: mainAppStore.rootStore.instrumentsStore.instrumentGroups,
            activeInstruments: mainAppStore.rootStore.instrumentsStore.activeInstruments,
        },
        markersOnChartStore: {
            activeMarkers: mainAppStore.rootStore.markersOnChartStore.activeMarkers,
        },
        quotesStore: {
            quotes: mainAppStore.rootStore.quotesStore.quotes,
            activePositions: mainAppStore.rootStore.quotesStore.activePositions,
            pendingOrders: mainAppStore.rootStore.quotesStore.pendingOrders,
            selectedPositionId: mainAppStore.rootStore.quotesStore.selectedPositionId,
        },
        SLTPStore: {
            tpType: mainAppStore.rootStore.SLTPstore.tpType,
            slType: mainAppStore.rootStore.SLTPstore.slType,
            closeOpenPrice: mainAppStore.rootStore.SLTPstore.closeOpenPrice,
        },
        withdrawalStore: {
            history: mainAppStore.rootStore.withdrawalStore.history,
        }
    };
    return allStates;
};
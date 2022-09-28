import React, { FC, useEffect } from 'react';
import {
  ChartingLibraryWidgetOptions,
  LanguageCode,
  widget,
  SeriesStyle,
  ResolutionString,
} from '../vendor/charting_library/charting_library';
import { FlexContainer } from '../styles/FlexContainer';
import DataFeedService from '../services/dataFeedService';
import { LineStyles } from '../enums/TradingViewStyles';
import ColorsPallete from '../styles/colorPallete';
import { useStores } from '../hooks/useStores';
import { supportedResolutions } from '../constants/supportedTimeScales';
import { BASIC_RESOLUTION_KEY } from '../constants/chartValues';
import { LOCAL_CHART_TYPE } from '../constants/global';
import { getChartTypeByLabel } from '../constants/chartValues';
import { observer } from 'mobx-react-lite';
import { IActiveInstrument } from '../types/InstrumentsTypes';
import styled from '@emotion/styled';

function getLanguageFromURL(): LanguageCode | null {
  const regex = new RegExp('[\\?&]lang=([^&#]*)');
  const results = regex.exec(location.search);
  return results === null
    ? null
    : (decodeURIComponent(results[1].replace(/\+/g, ' ')) as LanguageCode);
}

const containerId = 'tv_chart_container';

interface IProps {
  instrumentId: string;
  instruments: IActiveInstrument[];
}

const ChartContainer: FC<IProps> = observer(({ instrumentId, instruments }) => {
  const {
    mainAppStore,
    tradingViewStore,
    markersOnChartStore,
    instrumentsStore,
  } = useStores();

  useEffect(() => {
    const localType = localStorage.getItem(LOCAL_CHART_TYPE);
    const currentType = localType
      ? getChartTypeByLabel(localType)
      : SeriesStyle.Area;
    const widgetOptions: ChartingLibraryWidgetOptions = {
      symbol: instrumentId,
      datafeed: new DataFeedService(
        mainAppStore.activeSession!,
        instrumentId,
        instruments
      ),
      theme: 'Dark',
      loading_screen: {
        backgroundColor: 'transparent',
        foregroundColor: 'transparent',
      },
      studies_access: {
        type: 'black',
        tools: [
          {
            name: 'Accumulation/Distribution',
            grayed: false,
          },
          {
            name: 'Chaikin Oscillator',
            grayed: false,
          },
          {
            name: 'Ease Of Movement',
            grayed: false,
          },
          {
            name: "Elder's Force Index",
            grayed: false,
          },
          {
            name: 'Klinger Oscillator',
            grayed: false,
          },
          {
            name: 'Money Flow Index',
            grayed: false,
          },
          {
            name: 'Net Volume',
            grayed: false,
          },
          {
            name: 'On Balance Volume',
            grayed: false,
          },
          {
            name: 'Volume',
            grayed: false,
          },
          {
            name: 'Volume Oscillator',
            grayed: false,
          },
          {
            name: 'VWAP',
            grayed: false,
          },
          {
            name: 'VWMA',
            grayed: false,
          },
          {
            name: 'Zig Zag',
            grayed: false,
          },
          {
            name: 'Chaikin Money Flow',
            grayed: false,
          },
          { name: 'Price Volume Trend', grayed: false },
          { name: 'Correlation - Log', grayed: false },
          { name: 'Correlation Coefficient', grayed: false },
          { name: 'Ratio', grayed: false },
        ],
      },
      interval: supportedResolutions[BASIC_RESOLUTION_KEY] as ResolutionString,
      container_id: containerId,
      library_path: CHARTING_LIBRARY_PATH,
      locale: getLanguageFromURL() || 'en',
      custom_css_url: 'custom_trading_view_styles.css',
      disabled_features: [
        // 'header_widget',
        'timeframes_toolbar',
        'header_symbol_search',
        'header_compare',
        // 'header_indicators',
        // 'header_fullscreen_button',
        // 'use_localstorage_for_settings',
        'border_around_the_chart',
        // 'left_toolbar',
        'symbol',
        'symbol_search',
        'symbol_info',
        'context_menus',
        'main_series_scale_menu',
        'popup_hints',
      ],
      enabled_features: [
        'remove_library_container_border',
        'side_toolbar_in_fullscreen_mode',
        'header_in_fullscreen_mode',
      ],
      fullscreen: false,
      autosize: true,
      overrides: {
        'symbolWatermarkProperties.transparency': 90,
        'mainSeriesProperties.style': currentType,
        'mainSeriesProperties.lineStyle.color': ColorsPallete.MINT,
        'mainSeriesProperties.lineStyle.linestyle': LineStyles.LINESTYLE_SOLID,
        'mainSeriesProperties.lineStyle.linewidth': 2,
        'mainSeriesProperties.lineStyle.priceSource': 'close',
        'mainSeriesProperties.areaStyle.color1': 'rgba(0, 255, 221, 0.08)',
        'mainSeriesProperties.areaStyle.color2': 'rgba(0, 255, 221, 0.08)',
        'mainSeriesProperties.areaStyle.linecolor': ColorsPallete.MINT,
        'mainSeriesProperties.areaStyle.linestyle': LineStyles.LINESTYLE_SOLID,
        'mainSeriesProperties.areaStyle.linewidth': 2,
        'mainSeriesProperties.candleStyle.upColor': '#21B3A4',
        'mainSeriesProperties.candleStyle.downColor': '#ed145b',
        'mainSeriesProperties.candleStyle.drawWick': true,
        'mainSeriesProperties.candleStyle.drawBorder': false,
        'mainSeriesProperties.candleStyle.borderColor': '#28555a',
        'mainSeriesProperties.candleStyle.borderUpColor': '#21B3A4',
        'mainSeriesProperties.candleStyle.borderDownColor': '#ed145b',
        'mainSeriesProperties.candleStyle.wickUpColor': '#255258',
        'mainSeriesProperties.candleStyle.wickDownColor': '#622243',
        'mainSeriesProperties.candleStyle.barColorsOnPrevClose': false,
        'mainSeriesProperties.areaStyle.priceSource': 'close',
        'mainSeriesProperties.priceAxisProperties.autoScale': true,
        'mainSeriesProperties.priceAxisProperties.autoScaleDisabled': false,
        'mainSeriesProperties.priceAxisProperties.percentage': false,
        'mainSeriesProperties.priceAxisProperties.percentageDisabled': false,
        'mainSeriesProperties.priceAxisProperties.logDisabled': true,
        'paneProperties.vertGridProperties.color': 'rgba(255, 255, 255, 0.08)',
        'paneProperties.vertGridProperties.style': LineStyles.LINESTYLE_DOTTED,
        'paneProperties.horzGridProperties.color': 'rgba(255, 255, 255, 0.08)',
        'paneProperties.horzGridProperties.style': LineStyles.LINESTYLE_DOTTED,
        'paneProperties.legendProperties.showStudyArguments': false,
        'paneProperties.legendProperties.showStudyTitles': false,
        'paneProperties.legendProperties.showStudyValues': false,
        'paneProperties.legendProperties.showSeriesTitle': false,
        'paneProperties.legendProperties.showSeriesOHLC': true,
        'paneProperties.legendProperties.showLegend': false,
        'paneProperties.legendProperties.showBarChange': false,
        'linetoolnote.backgroundColor': ColorsPallete.RAZZMATAZZ,
        'scalesProperties.lineColor': 'transparent',
        'scalesProperties.textColor': 'rgba(255, 255, 255, 0.2)',
        'paneProperties.background': 'rgba(0,0,0,0)',
        'mainSeriesProperties.priceLineColor': '#fff',
        'mainSeriesProperties.priceLineWidth': 2,
        'scalesProperties.showSeriesLastValue': true,
        'timeScale.rightOffset': 5,
      },
    };

    const tvWidget = new widget(widgetOptions);

    tvWidget.onChartReady(async () => {
      tradingViewStore.setTradingWidget(tvWidget);
      markersOnChartStore.renderActivePositionsMarkersOnChart();
    });
    return () => {
      tradingViewStore.setTradingWidget(undefined);
      tvWidget.remove();
    };
  }, []);

  return (
    <ChartWrapper
      width="100%"
      height="100%"
      isHidden={instrumentsStore.hiddenChart}
      id={containerId}
    />
  );
});

export default ChartContainer;

const ChartWrapper = styled(FlexContainer)<{ isHidden?: boolean }>`
  visibility: ${(props) => (props.isHidden ? 'hidden' : 'visible')};
`;

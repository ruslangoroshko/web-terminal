import React, { FC, useEffect, useContext } from 'react';

import {
  ChartingLibraryWidgetOptions,
  LanguageCode,
  widget,
  SeriesStyle,
} from '../vendor/charting_library/charting_library.min';
import { FlexContainer } from '../styles/FlexContainer';
import { MainAppContext } from '../store/MainAppProvider';
import DataFeedService from '../services/dataFeedService';
import { supportedResolutions } from '../constants/supportedResolutionsTimeScale';
import { LineStyles } from '../enums/TradingViewStyles';
import ColorsPallete from '../styles/colorPallete';

export interface ChartContainerProps {
  symbol: ChartingLibraryWidgetOptions['symbol'];
  interval: ChartingLibraryWidgetOptions['interval'];

  // BEWARE: no trailing slash is expected in feed URL
  library_path: ChartingLibraryWidgetOptions['library_path'];
  // chartsStorageUrl: ChartingLibraryWidgetOptions['charts_storage_url'];
  // chartsStorageApiVersion: ChartingLibraryWidgetOptions['charts_storage_api_version'];
  clientId: ChartingLibraryWidgetOptions['client_id'];
  userId: ChartingLibraryWidgetOptions['user_id'];
  fullscreen: ChartingLibraryWidgetOptions['fullscreen'];
  autosize: ChartingLibraryWidgetOptions['autosize'];
  studiesOverrides: ChartingLibraryWidgetOptions['studies_overrides'];
  containerId: ChartingLibraryWidgetOptions['container_id'];
}

function getLanguageFromURL(): LanguageCode | null {
  const regex = new RegExp('[\\?&]lang=([^&#]*)');
  const results = regex.exec(location.search);
  return results === null
    ? null
    : (decodeURIComponent(results[1].replace(/\+/g, ' ')) as LanguageCode);
}

const containerId = 'tv_chart_container';

const defaultProps: ChartContainerProps = {
  symbol: 'Coinbase:BTC/USD',
  interval: supportedResolutions[0],
  containerId: containerId,
  library_path: CHARTING_LIBRARY_PATH,
  // chartsStorageUrl: 'https://saveload.tradingview.com',
  // chartsStorageApiVersion: '1.1',
  clientId: 'tradingview.com',
  userId: 'public_user_id',
  fullscreen: false,
  autosize: true,
  studiesOverrides: {},
};

interface IProps {
  intrumentId: string;
}

const ChartContainer: FC<IProps> = ({ intrumentId }) => {
  const { activeSession } = useContext(MainAppContext);
  useEffect(() => {
    const widgetOptions: ChartingLibraryWidgetOptions = {
      symbol: defaultProps.symbol,
      // BEWARE: no trailing slash is expected in feed URL
      // tslint:disable-next-line:no-any
      datafeed: new DataFeedService(activeSession!, intrumentId),
      interval: defaultProps.interval,
      container_id: defaultProps.containerId,
      library_path: defaultProps.library_path,
      locale: getLanguageFromURL() || 'en',
      disabled_features: [
        'use_localstorage_for_settings',
        'volume_force_overlay',
        'compare_symbol',
        'border_around_the_chart',
        'header_saveload',
        'left_toolbar',
        'control_bar',
        'legend_widget',
      ],
      // enabled_features: ['study_templates'],
      // charts_storage_url: defaultProps.chartsStorageUrl,
      // charts_storage_api_version: defaultProps.chartsStorageApiVersion,
      client_id: defaultProps.clientId,
      user_id: defaultProps.userId,
      fullscreen: defaultProps.fullscreen,
      autosize: defaultProps.autosize,
      studies_overrides: defaultProps.studiesOverrides,
      overrides: {
        'mainSeriesProperties.showCountdown': true,
        'symbolWatermarkProperties.transparency': 90,
        'scalesProperties.textColor': '#AAA',
        'mainSeriesProperties.style': SeriesStyle.Area,
        'mainSeriesProperties.candleStyle.wickUpColor': '#336854',
        'mainSeriesProperties.candleStyle.wickDownColor': '#7f323f',
        'mainSeriesProperties.lineStyle.color': ColorsPallete.MINT,
        'mainSeriesProperties.lineStyle.linestyle': LineStyles.LINESTYLE_SOLID,
        'mainSeriesProperties.lineStyle.linewidth': 3,
        'mainSeriesProperties.lineStyle.priceSource': 'close',
        'mainSeriesProperties.areaStyle.color1': 'rgba(0, 224, 255, 0.12)',
        'mainSeriesProperties.areaStyle.color2': 'rgba(0, 224, 255, 0.12)',
        'mainSeriesProperties.areaStyle.linecolor': ColorsPallete.MINT,
        'mainSeriesProperties.areaStyle.linestyle': LineStyles.LINESTYLE_SOLID,
        'mainSeriesProperties.areaStyle.linewidth': 3,
        'mainSeriesProperties.areaStyle.priceSource': 'close',
        'scalesProperties.backgroundColor': '#191e1e',
        'paneProperties.background': '#191e1e',
        'paneProperties.vertGridProperties.color': '#353939',
        'paneProperties.vertGridProperties.style': LineStyles.LINESTYLE_SOLID,
        'paneProperties.horzGridProperties.color': '#353939',
        'paneProperties.horzGridProperties.style': LineStyles.LINESTYLE_SOLID,
        'linetoolnote.backgroundColor': ColorsPallete.RAZZMATAZZ,
      },
      theme: 'Dark',
    };

    let tvWidget = new widget(widgetOptions);

    tvWidget.onChartReady(async () => {
      await tvWidget.headerReady();
      const button = tvWidget.createButton();
      button.setAttribute('title', 'Click to show a notification popup');
      button.classList.add('apply-common-tooltip');
      button.addEventListener('click', () =>
        tvWidget.showNoticeDialog({
          title: 'Notification',
          body: 'TradingView Charting Library API works correctly',
          callback: () => {
            console.log('Noticed!');
          },
        })
      );
      button.innerHTML = 'Check API';
    });
    return () => {
      tvWidget.remove();
    };
  }, []);

  return (
    <FlexContainer width="100%" height="100%" id={defaultProps.containerId} />
  );
};

export default ChartContainer;

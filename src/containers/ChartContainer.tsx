import React, { FC, useEffect, useContext } from 'react';

import {
  ChartingLibraryWidgetOptions,
  LanguageCode,
  widget,
  SeriesStyle,
  IChartingLibraryWidget,
} from '../vendor/charting_library/charting_library.min';
import { FlexContainer } from '../styles/FlexContainer';
import { MainAppContext } from '../store/MainAppProvider';
import DataFeedService from '../services/dataFeedService';
import { supportedResolutions } from '../constants/supportedResolutionsTimeScale';
import { LineStyles } from '../enums/TradingViewStyles';
import ColorsPallete from '../styles/colorPallete';
import { InstrumentModelWSDTO } from '../types/Instruments';

export interface ChartContainerProps {
  interval: ChartingLibraryWidgetOptions['interval'];
  // BEWARE: no trailing slash is expected in feed URL
  library_path: ChartingLibraryWidgetOptions['library_path'];
  clientId: ChartingLibraryWidgetOptions['client_id'];
  userId: ChartingLibraryWidgetOptions['user_id'];
  fullscreen: ChartingLibraryWidgetOptions['fullscreen'];
  autosize: ChartingLibraryWidgetOptions['autosize'];
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
  interval: supportedResolutions[0],
  containerId: containerId,
  library_path: CHARTING_LIBRARY_PATH,
  clientId: 'tradingview.com',
  userId: 'public_user_id',
  fullscreen: false,
  autosize: true,
};

interface IProps {
  intrument: InstrumentModelWSDTO;
  tradingWidgetCallback: (arg0: IChartingLibraryWidget) => void;
}

const ChartContainer: FC<IProps> = ({ intrument, tradingWidgetCallback }) => {
  const { activeSession } = useContext(MainAppContext);
  useEffect(() => {
    const widgetOptions: ChartingLibraryWidgetOptions = {
      symbol: intrument.id,
      // BEWARE: no trailing slash is expected in feed URL
      datafeed: new DataFeedService(activeSession!, intrument),
      interval: defaultProps.interval,
      container_id: defaultProps.containerId,
      library_path: defaultProps.library_path,
      locale: getLanguageFromURL() || 'en',
      disabled_features: [
        'header_widget',
        'legend_widget',
        'timeframes_toolbar',
        'use_localstorage_for_settings',
        'border_around_the_chart',
        'left_toolbar',
        'control_bar',
        'symbol_info',
        'context_menus',
      ],
      client_id: defaultProps.clientId,
      user_id: defaultProps.userId,
      fullscreen: defaultProps.fullscreen,
      autosize: defaultProps.autosize,
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
        'paneProperties.vertGridProperties.style': LineStyles.LINESTYLE_DOTTED,
        'paneProperties.horzGridProperties.color': '#353939',
        'paneProperties.horzGridProperties.style': LineStyles.LINESTYLE_DOTTED,
        'paneProperties.legendProperties.showStudyArguments': false,
        'paneProperties.legendProperties.showStudyTitles': false,
        'paneProperties.legendProperties.showStudyValues': false,
        'paneProperties.legendProperties.showSeriesTitle': false,
        'paneProperties.legendProperties.showSeriesOHLC': false,
        'paneProperties.legendProperties.showLegend': false,
        'paneProperties.legendProperties.showBarChange': false,
        'paneProperties.legendProperties.showOnlyPriceSource': false,
        'linetoolnote.backgroundColor': ColorsPallete.RAZZMATAZZ,
      },
      theme: 'Dark',
    };

    let tvWidget = new widget(widgetOptions);

    tvWidget.onChartReady(async () => {
      tvWidget.chart().crossHairMoved(({ time, price }) => {
        console.log({ time, price });
      });
      tradingWidgetCallback(tvWidget);
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

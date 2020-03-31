import React, { FC, useEffect } from 'react';
import {
  ChartingLibraryWidgetOptions,
  LanguageCode,
  widget,
  SeriesStyle,
  IChartingLibraryWidget,
} from '../vendor/charting_library/charting_library.min';
import { FlexContainer } from '../styles/FlexContainer';
import DataFeedService from '../services/dataFeedService';
import { LineStyles } from '../enums/TradingViewStyles';
import ColorsPallete from '../styles/colorPallete';
import { supportedResolutions } from '../constants/supportedTimeScales';
import { BASIC_RESOLUTION_KEY } from '../constants/chartValues';
import { observer } from 'mobx-react-lite';
import { HubConnection } from '@aspnet/signalr';

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
  activeSession: HubConnection;
  callbackWidget: (widget: IChartingLibraryWidget) => void;
}

const MobileChartContainer: FC<IProps> = ({
  instrumentId,
  activeSession,
  callbackWidget,
}) => {
  alert(`MobileChartContainer -> instrumentId: ${instrumentId}`);
  useEffect(() => {
    const widgetOptions: ChartingLibraryWidgetOptions = {
      symbol: instrumentId,
      datafeed: new DataFeedService(activeSession, instrumentId),
      interval: supportedResolutions[BASIC_RESOLUTION_KEY],
      container_id: containerId,
      library_path: CHARTING_LIBRARY_PATH,
      locale: 'en',
      custom_css_url: 'custom_trading_view_styles.css',
      disabled_features: [
        'header_widget',
        'timeframes_toolbar',
        'use_localstorage_for_settings',
        'border_around_the_chart',
        'left_toolbar',
        'symbol_info',
        'context_menus',
        'main_series_scale_menu',
      ],
      enabled_features: ['remove_library_container_border'],
      fullscreen: false,
      autosize: true,
      overrides: {
        'symbolWatermarkProperties.transparency': 90,
        'mainSeriesProperties.style': SeriesStyle.Area,
        'mainSeriesProperties.lineStyle.color': ColorsPallete.MINT,
        'mainSeriesProperties.lineStyle.linestyle': LineStyles.LINESTYLE_SOLID,
        'mainSeriesProperties.lineStyle.linewidth': 3,
        'mainSeriesProperties.lineStyle.priceSource': 'close',
        'mainSeriesProperties.areaStyle.color1': 'rgba(0, 255, 221, 0.08)',
        'mainSeriesProperties.areaStyle.color2': 'rgba(0, 255, 221, 0.08)',
        'mainSeriesProperties.areaStyle.linecolor': ColorsPallete.MINT,
        'mainSeriesProperties.areaStyle.linestyle': LineStyles.LINESTYLE_SOLID,
        'mainSeriesProperties.areaStyle.linewidth': 3,
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
        'paneProperties.axisProperties.autoScale': false,
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
        'paneProperties.legendProperties.showOnlyPriceSource': false,
        'linetoolnote.backgroundColor': ColorsPallete.RAZZMATAZZ,
        'scalesProperties.lineColor': 'transparent',
        'scalesProperties.textColor': 'rgba(255, 255, 255, 0.2)',
        'scalesProperties.backgroundColor': 'transparent',
        'paneProperties.background': 'rgba(0,0,0,0)',
        'mainSeriesProperties.priceLineColor': '#fff',
        'mainSeriesProperties.priceLineWidth': 2,
        'timeScale.rightOffset': 5,
      },
    };

    const tvWidget = new widget(widgetOptions);

    tvWidget.onChartReady(async () => {
      alert('widget loaded');
      callbackWidget(tvWidget);
    });
    return () => {
      tvWidget.remove();
    };
  }, []);

  return <FlexContainer width="100%" height="100%" id={containerId} />;
};

export default MobileChartContainer;

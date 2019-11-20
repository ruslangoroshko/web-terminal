import React, { useContext } from 'react';
import TradingViewWidget, { Themes } from 'react-tradingview-widget';
import { InstrumentModelDTO } from '../types/Instruments';

interface Props {
  activeInstrument: InstrumentModelDTO;
}

function TradingGraph(props: Props) {
  const { activeInstrument } = props;
  return (
    <TradingViewWidget
      symbol={`FX:${activeInstrument.base}${activeInstrument.quote}`}
      theme={Themes.DARK}
      autosize
    />
  );
}

export default TradingGraph;

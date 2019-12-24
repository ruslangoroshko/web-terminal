import React, { useState, FC } from 'react';
import { OpenPositionModelFormik } from '../types/Positions';
import { AutoCloseTypesEnum } from '../enums/AutoCloseTypesEnum';

interface ContextProps {
  initialValues?: OpenPositionModelFormik;
  setInitialValues: (initValues: OpenPositionModelFormik) => void;
  autoCloseProfit: AutoCloseTypesEnum;
  setAutoCloseProfit: (arg0: AutoCloseTypesEnum) => void;
  autoCloseLoss: AutoCloseTypesEnum;
  setAutoCloseLoss: (arg0: AutoCloseTypesEnum) => void;
  takeProfitValue: string;
  setTakeProfitValue: (arg0: string) => void;
  stopLossValue: string;
  setStopLossValue: (arg0: string) => void;
}

export const BuySellContext = React.createContext<ContextProps>(
  {} as ContextProps
);

interface Props {}

const BuySellProvider: FC<Props> = ({ children }) => {
  const [initialValues, setInitialValues] = useState<OpenPositionModelFormik>();

  const [autoCloseProfit, handleAutoCloseProfit] = useState(
    AutoCloseTypesEnum.Profit
  );

  const [autoCloseLoss, handleAutoCloseLoss] = useState(
    AutoCloseTypesEnum.Profit
  );

  const setAutoCloseLoss = (autoCloseLoss: AutoCloseTypesEnum) => {
    setStopLossValue('');
    handleAutoCloseLoss(autoCloseLoss);
  };

  const setAutoCloseProfit = (autoCloseProfit: AutoCloseTypesEnum) => {
    setStopLossValue('');
    handleAutoCloseProfit(autoCloseProfit);
  };

  const setPurchaseAt = () => {

  }

  const [takeProfitValue, setTakeProfitValue] = useState('');
  const [stopLossValue, setStopLossValue] = useState('');

  return (
    <BuySellContext.Provider
      value={{
        initialValues,
        setInitialValues,
        autoCloseLoss,
        autoCloseProfit,
        setAutoCloseLoss,
        setAutoCloseProfit,
        setStopLossValue,
        setTakeProfitValue,
        stopLossValue,
        takeProfitValue,
      }}
    >
      {children}
    </BuySellContext.Provider>
  );
};

export default BuySellProvider;

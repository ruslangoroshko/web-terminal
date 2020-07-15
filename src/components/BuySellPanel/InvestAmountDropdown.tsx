import React, { FC } from 'react';
import {
  PrimaryTextSpan,
  PrimaryTextParagraph,
} from '../../styles/TextsElements';
import styled from '@emotion/styled';
import { FlexContainer } from '../../styles/FlexContainer';
import Fields from '../../constants/fields';
import { useStores } from '../../hooks/useStores';
import { observer } from 'mobx-react-lite';
import { useTranslation } from 'react-i18next';

interface Props {
  setFieldValue: any;
  toggle: () => void;
}

const currencies = [2000, 1000, 500, 250, 100];

const InvestAmountDropdown: FC<Props> = observer(props => {
  const { setFieldValue, toggle } = props;
  const { t } = useTranslation();

  const handleChangeAmount = (value: number) => () => {
    setFieldValue(Fields.AMOUNT, value);
    toggle();
  };

  const { mainAppStore } = useStores();

  return (
    <MultiplierDropdownWrapper
      backgroundColor="rgba(0, 0, 0, 0.4)"
      flexDirection="column"
      position="absolute"
      top="0"
      right="calc(100% + 8px)"
      width="140px"
    >
      {currencies.map(item => (
        <DropDownItem
          key={item}
          alignItems="center"
          onClick={handleChangeAmount(item)}
        >
          <PrimaryTextSpan fontSize="16px" fontWeight="bold" color="#fffccc">
            {mainAppStore.activeAccount?.symbol}
            {item}
          </PrimaryTextSpan>
        </DropDownItem>
      ))}
      <DropDownItem
        flexDirection="column"
        onClick={handleChangeAmount(mainAppStore.activeAccount?.balance || 0)}
      >
        <PrimaryTextParagraph
          color="rgba(255,255,255,0.3)"
          marginBottom="10px"
          fontSize="11px"
          lineHeight="12px"
        >
          {t('Available Balance')}
        </PrimaryTextParagraph>
        <PrimaryTextSpan fontSize="16px" fontWeight="bold" color="#fffccc">
          {mainAppStore.activeAccount?.symbol}
          {mainAppStore.activeAccount?.balance.toFixed(2)}
        </PrimaryTextSpan>
      </DropDownItem>
    </MultiplierDropdownWrapper>
  );
});

export default InvestAmountDropdown;

const MultiplierDropdownWrapper = styled(FlexContainer)`
  box-shadow: 0px 12px 24px rgba(0, 0, 0, 0.25),
    0px 6px 12px rgba(0, 0, 0, 0.25);
  background-color: rgba(0, 0, 0, 0.8);
  @supports ((-webkit-backdrop-filter: none) or (backdrop-filter: none)) {
    background-color: rgba(0, 0, 0, 0.34);
    backdrop-filter: blur(12px);
  }
  border-radius: 4px;
`;

const DropDownItem = styled(FlexContainer)`
  padding: 12px 16px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.08);

  &:hover {
    cursor: pointer;
    > span {
      color: #00ffdd;
    }
  }
`;

import React, { FC, useEffect, useRef, useState } from 'react';
import { FlexContainer } from '../../styles/FlexContainer';
import styled from '@emotion/styled';
import { PrimaryTextParagraph } from '../../styles/TextsElements';
import { ButtonWithoutStyles } from '../../styles/ButtonWithoutStyles';
import { useStores } from '../../hooks/useStores';
import { Observer } from 'mobx-react-lite';
import SvgIcon from '../SvgIcon';
import { SeriesStyle } from '../../vendor/charting_library/charting_library.min';
import {
  getChartLabelByType,
  getChartIconByType,
  availableChartTypes,
} from '../../constants/chartValues';

interface Props {}

const ChartTypeDropdown: FC<Props> = props => {
  const { tradingViewStore } = useStores();

  const [on, toggle] = useState(false);

  const wrapperRef = useRef<HTMLDivElement>(null);

  const handleChangeChart = (chartType: SeriesStyle) => () => {
    tradingViewStore.tradingWidget?.chart().setChartType(chartType);
    tradingViewStore.chartType = chartType;
    toggle(false);
  };

  const handleToggle = () => {
    toggle(!on);
  };

  const handleClickOutside = (e: any) => {
    if (wrapperRef.current && !wrapperRef.current.contains(e.target)) {
      toggle(false);
    }
  };

  useEffect(() => {
    document.addEventListener('mousedown', handleClickOutside);

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  });

  return (
    <FlexContainer position="relative" ref={wrapperRef}>
      <Observer>
        {() => (
          <SettingsButton onClick={handleToggle}>
            <SvgIcon
              fillColor={on ? '#00FFDD' : 'rgba(255, 255, 255, 0.5)'}
              {...getChartIconByType(tradingViewStore.chartType)}
            ></SvgIcon>
          </SettingsButton>
        )}
      </Observer>
      {on && (
        <ChartResolutionsDropdownWrapper
          flexDirection="column"
          alignItems="flex-start"
        >
          <Observer>
            {() => (
              <>
                {availableChartTypes.map(chartType => (
                  <ButtonWithoutStyles
                    key={chartType}
                    onClick={handleChangeChart(chartType)}
                  >
                    <PrimaryTextParagraph
                      fontSize="12px"
                      color="#fffccc"
                      marginBottom="12px"
                      whiteSpace="nowrap"
                    >
                      {getChartLabelByType(chartType)}
                    </PrimaryTextParagraph>
                  </ButtonWithoutStyles>
                ))}
              </>
            )}
          </Observer>
          <Triangle />
        </ChartResolutionsDropdownWrapper>
      )}
    </FlexContainer>
  );
};

export default ChartTypeDropdown;

const ChartResolutionsDropdownWrapper = styled(FlexContainer)`
  position: absolute;
  bottom: calc(100% + 8px);
  border-radius: 4px;
  left: 50%;
  transform: translateX(-50%);
  flex-direction: column;
  padding: 12px 12px 0 12px;
  box-shadow: 0px 4px 8px rgba(41, 42, 57, 0.09),
    0px 8px 16px rgba(37, 38, 54, 0.24);

  background-color: rgba(0, 0, 0, 0.8);
  @supports ((-webkit-backdrop-filter: none) or (backdrop-filter: none)) {
    background-color: rgba(0, 0, 0, 0.34);
    backdrop-filter: blur(40px);
  }
`;

const Triangle = styled.div`
  position: absolute;
  top: 100%;
  left: 50%;
  transform: translateX(-50%);
  width: 0;
  height: 0;
  border-style: solid;
  border-width: 8px 7px 0 7px;
  border-color: rgba(0, 0, 0, 0.34) transparent transparent transparent;
`;

const SettingsButton = styled(ButtonWithoutStyles)`
  padding: 8px;
  color: rgba(255, 255, 255, 0.6);
  font-size: 12px;
  line-height: 16px;
`;
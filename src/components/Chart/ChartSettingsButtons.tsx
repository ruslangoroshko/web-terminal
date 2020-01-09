import React from 'react';
import { FlexContainer } from '../../styles/FlexContainer';
import styled from '@emotion/styled';
import { ButtonWithoutStyles } from '../../styles/ButtonWithoutStyles';
import SvgIcon from '../SvgIcon';
import IconSettings from '../../assets/svg/icon-chart-settings.svg';
import IconLineStyle from '../../assets/svg/icon-chart-line-style.svg';
import Toggle from '../Toggle';
import ChartResolutionsDropdown from './ChartResolutionsDropdown';

interface Props {}

function ChartSettingsButtons(props: Props) {
  const {} = props;

  return (
    <FlexContainer alignItems="center">
      <SettingsButton>
        <SvgIcon {...IconSettings} fill="rgba(255, 255, 255, 0.6)"></SvgIcon>
      </SettingsButton>
      <SettingsButton>
        <SvgIcon {...IconLineStyle} fill="rgba(255, 255, 255, 0.6)"></SvgIcon>
      </SettingsButton>
      <ChartResolutionsDropdown />
    </FlexContainer>
  );
}

export default ChartSettingsButtons;

const SettingsButton = styled(ButtonWithoutStyles)`
  padding: 8px;
  color: rgba(255, 255, 255, 0.6);
  font-size: 12px;
  line-height: 16px;
`;

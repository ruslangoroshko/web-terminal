import React, { FC } from 'react';
import { observer } from 'mobx-react-lite';
import { FlexContainer } from '../styles/FlexContainer';
import styled from '@emotion/styled';
import IconSearch from '../assets/svg/icon-instrument-search.svg';
import IconClose from '../assets/svg/icon-instrument-close.svg';
import SvgIcon from './SvgIcon';

interface Props {}

const AddInstrumentsPopup: FC<Props> = observer(props => {
  const {} = props;

  return (
    <AddInstrumentsPopupWrapper
      width="320px"
      position="relative"
      alignItems="center"
      flexDirection="column"
    >
      <FlexContainer padding="12px 12px 0 20px" margin="0 0 20px 0" width="100%">
        <FlexContainer margin="0 6px 0 0">
          <SvgIcon {...IconSearch} fill="rgba(255, 255, 255, 0.5)"></SvgIcon>
        </FlexContainer>
        <SearchInput />
        <FlexContainer>
          <SvgIcon {...IconClose} fill="rgba(255, 255, 255, 0.5)"></SvgIcon>
        </FlexContainer>
      </FlexContainer>
    </AddInstrumentsPopupWrapper>
  );
});

export default AddInstrumentsPopup;

const AddInstrumentsPopupWrapper = styled(FlexContainer)`
  box-shadow: 0px 12px 24px rgba(0, 0, 0, 0.25),
    0px 6px 12px rgba(28, 33, 33, 0.24);
  backdrop-filter: blur(12px);
  border-radius: 2px;

  &:before {
    content: '';
    z-index: -1;
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background-color: rgba(11, 14, 19, 0.61);
  }
`;

const SearchInput = styled.input`
  outline: none;
  background-color: transparent;
  border: none;
  height: 18px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.2);
  margin-right: 2px;
  width: 100%;
  color: white;
  font-size: 12px;
  line-height: 14px;

  &:focus {
    content: '';
    border-bottom: 1px solid #21b3a4;
  }
`;

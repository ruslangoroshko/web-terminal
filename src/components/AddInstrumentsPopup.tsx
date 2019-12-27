import React, { FC } from 'react';
import { observer } from 'mobx-react-lite';
import { FlexContainer } from '../styles/FlexContainer';
import styled from '@emotion/styled';

interface Props {}

const AddInstrumentsPopup: FC<Props> = observer(props => {
  const {} = props;

  return (
    <AddInstrumentsPopupWrapper backgroundColor="rgba(11, 14, 19, 0.61)" padding="12px"></AddInstrumentsPopupWrapper>
  );
});

export default AddInstrumentsPopup;

const AddInstrumentsPopupWrapper = styled(FlexContainer)`
  box-shadow: 0px 12px 24px rgba(0, 0, 0, 0.25),
    0px 6px 12px rgba(28, 33, 33, 0.24);
  backdrop-filter: blur(12px);
  border-radius: 2px;
`;

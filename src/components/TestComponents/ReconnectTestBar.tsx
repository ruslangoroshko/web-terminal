import React from 'react';
import API from '../../helpers/API';
import { logger } from '../../helpers/ConsoleLoggerTool';
import { PrimaryButton } from '../../styles/Buttons';
import { FlexContainer } from '../../styles/FlexContainer';
import Modal from '../Modal';

const ReconnectTestBar = () => {
  const handleClickClient = async () => {
    try {
      const response = await API.testClinetrequest();
      logger(response);
    } catch (error) {}
  };

  const handleClickBG = async () => {
    try {
      const response = await API.testBGrequest();
      logger(response);
    } catch (error) {}
  };

  return (
    <Modal>
      <FlexContainer
        width="340px"
        height="90px"
        backgroundColor="rgba(0,0,0,0.5)"
        alignItems="center"
        justifyContent="space-around"
        position="fixed"
        zIndex="99999"
        top="40%"
        left="16px"
      >
        <PrimaryButton padding="16px" width="40%" onClick={handleClickClient}>
          Client Req
        </PrimaryButton>

        <PrimaryButton padding="16px" width="40%" onClick={handleClickBG}>
          Background Req
        </PrimaryButton>
      </FlexContainer>
    </Modal>
  );
};

export default ReconnectTestBar;

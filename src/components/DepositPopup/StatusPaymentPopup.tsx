import React, { FC, useEffect } from 'react';
import { FlexContainer } from '../../styles/FlexContainer';
import Modal from '../Modal';
import styled from '@emotion/styled';
import { PrimaryTextParagraph } from '../../styles/TextsElements';

interface Props {
  status: string;
}

const StatusPaymentPopup: FC<Props> = ({ status }) => {
// const render 
  return (
    <>
      <Modal>
        <BackgroundWrapperLayout
          position="fixed"
          top="0"
          left="0"
          right="0"
          bottom="0"
          justifyContent="center"
          alignItems="center"
          zIndex="1000"
        >
          <FlexContainer
            boxShadow="0px 12px 24px rgba(0, 0, 0, 0.25), 0px 6px 12px rgba(0, 0, 0, 0.25)"
            borderRadius="4px"
            backgroundColor="rgba(0,0,0,0.4)"
            position="relative"
            width="534px"
            flexDirection="column"
            padding="65px 52px 40px"
            alignItems="center"
          >
            <PrimaryTextParagraph
              fontSize="20px"
              fontWeight="bold"
              marginBottom="10px"
              color="#fffccc"
            >
              Congratulations!
            </PrimaryTextParagraph>
            <PrimaryTextParagraph
              fontSize="11px"
              color="#fffccc"
              marginBottom="42px"
            >
              You Have Been Successfully Registered
            </PrimaryTextParagraph>
            <FlexContainer justifyContent="space-between"></FlexContainer>
          </FlexContainer>
        </BackgroundWrapperLayout>
      </Modal>
    </>
  );
};

export default StatusPaymentPopup;

const BackgroundWrapperLayout = styled(FlexContainer)`
  background-color: rgba(0, 0, 0, 0.7);
  @supports ((-webkit-backdrop-filter: none) or (backdrop-filter: none)) {
    background-color: rgba(0, 0, 0, 0.34);
    backdrop-filter: blur(12px);
  }
`;

import React, { useState, useEffect } from 'react';
import SignFlowLayout from '../components/SignFlowLayout';
import { PrimaryTextParagraph, PrimaryTextSpan } from '../styles/TextsElements';
import { FlexContainer } from '../styles/FlexContainer';
import { useParams, Link } from 'react-router-dom';
import API from '../helpers/API';
import styled from '@emotion/styled';
import Page from '../constants/Pages';
import LoaderFullscreen from '../components/LoaderFullscreen';
import { Observer } from 'mobx-react-lite';
import { useStores } from '../hooks/useStores';
import BadRequestPopup from '../components/BadRequestPopup';

interface Props {}

function EmailConfirmation(props: Props) {
  const { id } = useParams();

  const { badRequestPopupStore, mainAppStore } = useStores();

  const [isLoading, setIsLoading] = useState(true);
  const [isSuccessful, setIsSuccessfull] = useState(false);

  useEffect(() => {
    API.confirmEmail(id || '')
      .then((response) => {
        setIsSuccessfull(!!response.result);
        mainAppStore.fetchTradingUrl();
      })
      .catch(error => {
        setIsSuccessfull(false);
        badRequestPopupStore.openModal();
        badRequestPopupStore.setMessage(error);
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, []);

  return (
    <SignFlowLayout>
      <Observer>
        {() => <>{badRequestPopupStore.isActive && <BadRequestPopup />}</>}
      </Observer>
      <LoaderFullscreen isLoading={isLoading} />
      <FlexContainer width="100%" flexDirection="column" alignItems="center">
        {isSuccessful ? (
          <>
            <PrimaryTextParagraph
              color="#fffccc"
              fontSize="24px"
              fontWeight="bold"
              marginBottom="24px"
            >
              Thank you!
            </PrimaryTextParagraph>
            <PrimaryTextParagraph color="#fffccc" marginBottom="24px">
              You have successfully verified your email.
            </PrimaryTextParagraph>
          </>
        ) : (
          <>
            <PrimaryTextParagraph
              color="#fffccc"
              fontSize="24px"
              fontWeight="bold"
              marginBottom="24px"
            >
              Email verification failed
            </PrimaryTextParagraph>
            <PrimaryTextParagraph color="#fffccc" marginBottom="12px">
              This link has been expired. Please login to request a new
              verification email.
            </PrimaryTextParagraph>
          </>
        )}
        <LinkToDashboard to={Page.DASHBOARD}>
          <PrimaryTextSpan color="#003a38" fontWeight="bold">
            Go to Platform
          </PrimaryTextSpan>
        </LinkToDashboard>
      </FlexContainer>
    </SignFlowLayout>
  );
}

export default EmailConfirmation;

const LinkToDashboard = styled(Link)`
  border-radius: 4px;
  padding: 8px;
  display: flex;
  justify-content: center;
  align-items: center;
  transition: background-color 0.2s ease;
  will-change: background-color;
  background-color: #00ffdd;
  box-shadow: 0px 4px 8px rgba(0, 255, 242, 0.17),
    inset 0px -3px 6px rgba(0, 255, 242, 0.26);

  &:hover {
    background-color: #9ffff2;
    text-decoration: none;
  }

  &:focus {
    background-color: #21b3a4;
  }

  &:disabled {
    background-color: rgba(255, 255, 255, 0.04);
  }
`;

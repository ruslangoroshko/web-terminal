import React from 'react';
import { FlexContainer } from '../styles/FlexContainer';
import RealDemoImage from '../assets/images/demo-real.png';
import { PrimaryTextParagraph, PrimaryTextSpan } from '../styles/TextsElements';
import styled from '@emotion/styled';
import { ButtonWithoutStyles } from '../styles/ButtonWithoutStyles';
import Modal from './Modal';
import { useStores } from '../hooks/useStores';
import API from '../helpers/API';
import KeysInApi from '../constants/keysInApi';
import Topics from '../constants/websocketTopics';
import Fields from '../constants/fields';
import { Observer } from 'mobx-react-lite';
import BadRequestPopup from './BadRequestPopup';
import { push } from 'mixpanel-browser';
import HashLocation from '../constants/hashLocation';
import { useHistory } from 'react-router-dom';

function DemoRealPopup() {
  const {push} = useHistory();
  const { mainAppStore, badRequestPopupStore, depositFundsStore } = useStores();

  const selectDemoAccount = async () => {
    const acc = mainAppStore.accounts.find(item => !item.isLive);
    if (acc) {
      try {
        await API.setKeyValue({
          key: KeysInApi.ACTIVE_ACCOUNT_ID,
          value: acc.id,
        });
        mainAppStore.activeSession?.send(Topics.SET_ACTIVE_ACCOUNT, {
          [Fields.ACCOUNT_ID]: acc.id,
        });
        mainAppStore.setActiveAccount(acc);
        mainAppStore.isDemoRealPopup = false;
      } catch (error) {
        badRequestPopupStore.openModal();
        badRequestPopupStore.setMessage(error);
      }
    }
  };

  const selectRealAccount = async () => {
    const acc = mainAppStore.accounts.find(item => item.isLive);
    if (acc) {
      try {
        await API.setKeyValue({
          key: KeysInApi.ACTIVE_ACCOUNT_ID,
          value: acc.id,
        });
        mainAppStore.activeSession?.send(Topics.SET_ACTIVE_ACCOUNT, {
          [Fields.ACCOUNT_ID]: acc.id,
        });
        mainAppStore.setActiveAccount(acc);
        mainAppStore.isDemoRealPopup = false;
        push(`/${HashLocation.Deposit}`);
      } catch (error) {
        badRequestPopupStore.openModal();
        badRequestPopupStore.setMessage(error);
      }
    }
  };

  const handleInvestReal = () => {
    selectRealAccount();
  }

  return (
    <>
      <Observer>
        {() => <>{badRequestPopupStore.isActive && <BadRequestPopup />}</>}
      </Observer>

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
            <FlexContainer margin="0 0 42px 0" flexDirection="column">
              <img width={174} src={RealDemoImage}></img>
            </FlexContainer>
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
            <FlexContainer justifyContent="space-between">
              <DemoButton onClick={selectDemoAccount}>
                <PrimaryTextSpan fontSize="14px" fontWeight="bold" color="#fff">
                  Practice on Demo
                </PrimaryTextSpan>
              </DemoButton>
              <RealButton onClick={handleInvestReal}>
                <PrimaryTextSpan fontSize="14px" fontWeight="bold" color="#000">
                  Invest Real funds
                </PrimaryTextSpan>
              </RealButton>
            </FlexContainer>
          </FlexContainer>
        </BackgroundWrapperLayout>
      </Modal>
    </>
  );
}

export default DemoRealPopup;

const DemoButton = styled(ButtonWithoutStyles)`
  border-radius: 4px;
  background-color: #ff0764;
  width: 200px;
  height: 40px;
  margin-right: 30px;
  transition: all 0.2s ease;
  will-change: background-color;

  &:hover {
    background-color: #ff557e;
  }
`;

const RealButton = styled(ButtonWithoutStyles)`
  border-radius: 4px;
  background-color: #00fff2;
  width: 200px;
  height: 40px;
  transition: all 0.2s ease;
  will-change: background-color;

  &:hover {
    background-color: #9ffff2;
  }
`;

const BackgroundWrapperLayout = styled(FlexContainer)`
  background-color: rgba(0, 0, 0, 0.7);
  @supports ((-webkit-backdrop-filter: none) or (backdrop-filter: none)) {
    background-color: rgba(0, 0, 0, 0.34);
    backdrop-filter: blur(12px);
  }
`;

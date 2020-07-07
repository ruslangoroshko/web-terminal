import React, { FC, useEffect, Props } from 'react';
import { FlexContainer } from '../../styles/FlexContainer';
import { PrimaryTextSpan } from '../../styles/TextsElements';
import styled from '@emotion/styled';
import { Link, useLocation } from 'react-router-dom';
import Page from '../../constants/Pages';
import { useStores } from '../../hooks/useStores';
import { PersonalDataKYCEnum } from '../../enums/PersonalDataKYCEnum';
import IconClose from '../../assets/svg/icon-close.svg';
import VisaMasterImage from '../../assets/images/visa-master.png';
import BitcoinImage from '../../assets/images/bitcoin.png';

import SvgIcon from '../SvgIcon';
import { ButtonWithoutStyles } from '../../styles/ButtonWithoutStyles';
import { DepositTypeEnum } from '../../enums/DepositTypeEnum';
import Modal from '../Modal';
import VisaMasterCardForm from './VisaMasterCardForm';
import { Observer } from 'mobx-react-lite';
import BitcoinForm from './BitcoinForm';
import BadRequestPopup from '../BadRequestPopup';
import HashLocation from '../../constants/hashLocation';

const DepositPopupWrapper: FC = () => {
  const location = useLocation();

  useEffect(() => {
    if (location.hash === HashLocation.Deposit) {
      depositFundsStore.openPopup();
    }
  }, [location]);

  const { depositFundsStore } = useStores();
  return (
    <Observer>
      {() => <>{depositFundsStore.isActivePopup && <DepositPopupInner />}</>}
    </Observer>
  );
};

const DepositPopupInner: FC = ({ children }) => {
  const { mainAppStore, depositFundsStore, badRequestPopupStore } = useStores();
  const setActiveDepositType = (depositType: DepositTypeEnum) => () => {
    depositFundsStore.setActiveDepositType(depositType);
  };

  const renderDepositType = () => {
    switch (depositFundsStore.activeDepositType) {
      case DepositTypeEnum.VisaMaster:
        return <VisaMasterCardForm />;

      case DepositTypeEnum.BankTransfer:
        return <VisaMasterCardForm />;

      case DepositTypeEnum.Bitcoin:
        return <BitcoinForm />;

      default:
        return null;
    }
  };

  return (
    <Modal>
      <Observer>
        {() => <>{badRequestPopupStore.isActive && <BadRequestPopup />}</>}
      </Observer>
      <ModalBackground
        position="fixed"
        top="0"
        left="0"
        right="0"
        bottom="0"
        alignItems="center"
        justifyContent="center"
        zIndex="1001"
      >
        <FlexContainer
          flexDirection="column"
          width="752px"
          backgroundColor="rgba(0, 0, 0, 0.32)"
          boxShadow="box-shadow: 0px 4px 8px rgba(41, 42, 57, 0.24), 0px 8px 16px rgba(37, 38, 54, 0.6)"
        >
          <Observer>
            {() => (
              <>
                {mainAppStore.profileStatus ===
                  PersonalDataKYCEnum.NotVerified && (
                  <FlexContainer
                    backgroundColor="rgba(0,0,0,0.2)"
                    padding="20px 12px"
                  >
                    <PrimaryTextSpan
                      marginRight="4px"
                      color="rgba(255,255,255, 0.4)"
                      fontSize="12px"
                    >
                      Plese be aware that you need to verify your account within
                      15 days after deposit.
                    </PrimaryTextSpan>
                    <CustomLink to={Page.PERSONAL_DATA}>Upload now</CustomLink>
                  </FlexContainer>
                )}
              </>
            )}
          </Observer>

          <FlexContainer position="relative" flexDirection="column">
            <HeaderDepositPopup position="relative">
              <FlexContainer
                position="absolute"
                right="32px"
                top="26px"
                zIndex="300"
              >
                <ButtonWithoutStyles onClick={depositFundsStore.togglePopup}>
                  <SvgIcon
                    {...IconClose}
                    fillColor="rgba(255, 255, 255, 0.6)"
                    hoverFillColor="#00FFF2"
                  />
                </ButtonWithoutStyles>
              </FlexContainer>
              <FlexContainer padding="24px 48px" flexDirection="column">
                <PrimaryTextSpan
                  fontSize="16px"
                  fontWeight="bold"
                  color="#fffccc"
                >
                  Deposit Funds
                </PrimaryTextSpan>
              </FlexContainer>
            </HeaderDepositPopup>

            <FlexContainer>
              <FlexContainer
                padding="32px"
                flexDirection="column"
                width="292px"
              >
                <FlexContainer flexDirection="column">
                  <Observer>
                    {() => (
                      <>
                        <PaymentMethodItem
                          isActive={
                            depositFundsStore.activeDepositType ===
                            DepositTypeEnum.VisaMaster
                          }
                          onClick={setActiveDepositType(
                            DepositTypeEnum.VisaMaster
                          )}
                        >
                          <FlexContainer marginRight="8px">
                            <img src={VisaMasterImage} width={32} height={28} />
                          </FlexContainer>
                          <FlexContainer flexDirection="column">
                            <PrimaryTextSpan fontSize="12px" color="#fffccc">
                              Visa / Mastercard
                            </PrimaryTextSpan>
                            <PrimaryTextSpan
                              fontSize="12px"
                              color="rgba(255,255,255,0.4)"
                            >
                              Instantly
                            </PrimaryTextSpan>
                          </FlexContainer>
                        </PaymentMethodItem>
                        <PaymentMethodItem
                          isActive={
                            depositFundsStore.activeDepositType ===
                            DepositTypeEnum.Bitcoin
                          }
                          onClick={setActiveDepositType(
                            DepositTypeEnum.Bitcoin
                          )}
                        >
                          <FlexContainer marginRight="8px">
                            <img src={BitcoinImage} width={26} height={26} />
                          </FlexContainer>
                          <FlexContainer flexDirection="column">
                            <PrimaryTextSpan fontSize="12px" color="#fffccc">
                              Bitcoin
                            </PrimaryTextSpan>
                            <PrimaryTextSpan
                              fontSize="12px"
                              color="rgba(255,255,255,0.4)"
                            >
                              Instantly
                            </PrimaryTextSpan>
                          </FlexContainer>
                        </PaymentMethodItem>
                      </>
                    )}
                  </Observer>
                </FlexContainer>
              </FlexContainer>
              <FlexContainer
                flexDirection="column"
                padding="0 40px 20px 0"
                width="calc(100% - 292px)"
                position="relative"
              >
                <Observer>{() => <>{renderDepositType()}</>}</Observer>
              </FlexContainer>
            </FlexContainer>
          </FlexContainer>
        </FlexContainer>
      </ModalBackground>
    </Modal>
  );
};

export default DepositPopupWrapper;

const HeaderDepositPopup = styled(FlexContainer)`
  border-bottom: 1px solid rgba(112, 113, 117, 0.5);
`;

const CustomLink = styled(Link)`
  font-size: 12px;
  color: #00fff2;
  font-weight: bold;
  line-height: 120%;
  &:hover {
    text-decoration: none;
  }
`;

const PaymentMethodItem = styled(FlexContainer)<{ isActive: boolean }>`
  background: ${props =>
    props.isActive
      ? `radial-gradient(
      13.51% 50% at 0% 50%,
      rgba(0, 255, 221, 0.08) 0%,
      rgba(0, 255, 221, 0) 100%
    ),
    rgba(255, 255, 255, 0.08)`
      : 'transparent'};
  /* box-shadow: ${props =>
    props.isActive ? 'inset 2px 0px 0px #00ffdd' : 'none'}; */
  border-radius: 4px;

  transition: all 0.2s ease;
  padding: 16px;

  &:hover {
    background: radial-gradient(
        13.51% 50% at 0% 50%,
        rgba(0, 255, 221, 0.08) 0%,
        rgba(0, 255, 221, 0) 100%
      ),
      rgba(255, 255, 255, 0.08);
    /* box-shadow: inset 2px 0px 0px #00ffdd; */
    cursor: pointer;
  }
`;

const ImageBadge = styled.img`
  /* margin-right: 30px;
  &:last-of-type {
    margin-right: 0;
  } */
`;

const ModalBackground = styled(FlexContainer)`
  background-color: rgba(37, 38, 54, 0.8);
  @supports ((-webkit-backdrop-filter: none) or (backdrop-filter: none)) {
    background-color: rgba(37, 38, 54, 0.6);
    backdrop-filter: blur(12px);
  }
`;

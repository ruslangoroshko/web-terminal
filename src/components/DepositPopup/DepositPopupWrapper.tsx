import React, { FC, useEffect } from 'react';
import { FlexContainer } from '../../styles/FlexContainer';
import { PrimaryTextSpan } from '../../styles/TextsElements';
import styled from '@emotion/styled';
import { Link, useLocation } from 'react-router-dom';
import Page from '../../constants/Pages';
import { useStores } from '../../hooks/useStores';
import { PersonalDataKYCEnum } from '../../enums/PersonalDataKYCEnum';
import IconClose from '../../assets/svg/icon-close.svg';

import SvgIcon from '../SvgIcon';
import { ButtonWithoutStyles } from '../../styles/ButtonWithoutStyles';
import { DepositTypeEnum } from '../../enums/DepositTypeEnum';
import Modal from '../Modal';

import { Observer } from 'mobx-react-lite';

import BadRequestPopup from '../BadRequestPopup';
import HashLocation from '../../constants/hashLocation';
import { useTranslation } from 'react-i18next';
import mixpanel from 'mixpanel-browser';
import mixpanelEvents from '../../constants/mixpanelEvents';

import BitcoinForm from './BitcoinForm';
import VisaMasterCardForm from './VisaMasterCardForm';

import CardIcon from '../../assets/svg/payments/icon-card.svg';
import BitcoinIcon from '../../assets/svg/payments/icon-bitcoin.svg';

import MastercardIdCheckImage from '../../assets/images/mastercard-id-check.png';
import SslCertifiedImage from '../../assets/images/ssl-certified.png';
import VisaSecureImage from '../../assets/images/visa-secure.png';
import NotificationPopup from '../NotificationPopup';

const depositList = [
  {
    id: DepositTypeEnum.VisaMaster,
    name: 'Visa / Mastercard',
    icon: CardIcon,
  },
  {
    id: DepositTypeEnum.Bitcoin,
    name: 'Bitcoin',
    icon: BitcoinIcon,
  },
];

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

const DepositPopupInner: FC = () => {
  const {
    mainAppStore,
    depositFundsStore,
    badRequestPopupStore,
    notificationStore,
  } = useStores();

  const setActiveDepositType = (depositType: DepositTypeEnum) => () => {
    depositFundsStore.setActiveDepositType(depositType);
  };
  const { t } = useTranslation();

  const renderDepositType = () => {
    switch (depositFundsStore.activeDepositType) {
      case DepositTypeEnum.VisaMaster:
        return <VisaMasterCardForm />;

      // case DepositTypeEnum.BankTransfer:
      //   return <BankTransferForm />;

      case DepositTypeEnum.Bitcoin:
        return <BitcoinForm />;

      default:
        return null;
    }
  };

  useEffect(() => {
    mixpanel.track(mixpanelEvents.DEPOSIT_LIST_VIEW);
  }, []);

  return (
    <Modal>
      <Observer>
        {() => <>{badRequestPopupStore.isActive && <BadRequestPopup />}</>}
      </Observer>
      <FlexContainer
        position="absolute"
        bottom="100px"
        left="14px"
        zIndex="1005"
      >
        <Observer>
          {() => (
            <NotificationPopup
              show={notificationStore.isActiveNotification}
            ></NotificationPopup>
          )}
        </Observer>
      </FlexContainer>
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
        <DepositModalWrap flexDirection="column" width="752px">
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
                      {t(
                        'Please be aware that you need to verify your account within 15 days after deposit.'
                      )}
                    </PrimaryTextSpan>
                    <CustomLink to={Page.PROOF_OF_IDENTITY}>
                      {t('Upload now')}
                    </CustomLink>
                  </FlexContainer>
                )}
              </>
            )}
          </Observer>

          <FlexContainer position="relative" flexDirection="column" flex="auto">
            <HeaderDepositPopup position="relative">
              <FlexContainer
                position="absolute"
                right="32px"
                top="22px"
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
              <FlexContainer padding="20px 48px" flexDirection="column">
                <PrimaryTextSpan
                  fontSize="16px"
                  fontWeight="bold"
                  color="#fffccc"
                >
                  {t('Deposit Funds')}
                </PrimaryTextSpan>
              </FlexContainer>
            </HeaderDepositPopup>

            <FlexContainer flex="auto">
              <FlexContainer
                padding="32px"
                flexDirection="column"
                width="322px"
                justifyContent="space-between"
                flex="auto"
              >
                <FlexContainer flexDirection="column">
                  <Observer>
                    {() => (
                      <>
                        {depositList.map((item) => (
                          <PaymentMethodItem
                            key={item.id}
                            isActive={
                              depositFundsStore.activeDepositType === item.id
                            }
                            onClick={setActiveDepositType(item.id)}
                          >
                            <FlexContainer marginRight="8px">
                              <SvgIcon
                                {...item.icon}
                                fillColor={
                                  depositFundsStore.activeDepositType ===
                                  item.id
                                    ? '#fffccc'
                                    : 'rgba(196, 196, 196, 0.5)'
                                }
                              ></SvgIcon>
                            </FlexContainer>
                            <FlexContainer flexDirection="column">
                              <PrimaryTextSpan
                                fontSize="12px"
                                color={
                                  depositFundsStore.activeDepositType ===
                                  item.id
                                    ? '#fffccc'
                                    : 'rgba(196, 196, 196, 0.5)'
                                }
                              >
                                {t(`${item.name}`)}
                              </PrimaryTextSpan>
                              <PrimaryTextSpan
                                fontSize="12px"
                                color="rgba(255,255,255,0.4)"
                              >
                                {t('Instantly')}
                              </PrimaryTextSpan>
                            </FlexContainer>
                          </PaymentMethodItem>
                        ))}
                      </>
                    )}
                  </Observer>
                </FlexContainer>

                <FlexContainer
                  alignItems="center"
                  justifyContent="space-around"
                  marginBottom="20px"
                >
                  <ImageBadge src={SslCertifiedImage} width={120}></ImageBadge>
                  <ImageBadge
                    src={MastercardIdCheckImage}
                    width={110}
                  ></ImageBadge>
                  <ImageBadge src={VisaSecureImage} width={28}></ImageBadge>
                </FlexContainer>
              </FlexContainer>
              <FlexContainer
                flexDirection="column"
                padding="0 40px 20px 0"
                width="calc(100% - 292px)"
                position="relative"
                //minHeight="688px"
              >
                <Observer>{() => <>{renderDepositType()}</>}</Observer>
              </FlexContainer>
            </FlexContainer>
          </FlexContainer>
        </DepositModalWrap>
      </ModalBackground>
    </Modal>
  );
};

export default DepositPopupWrapper;

const DepositModalWrap = styled(FlexContainer)`
  background: #1c1f26;
  border: 1px solid rgba(169, 171, 173, 0.1);
  box-shadow: 0px 34px 44px rgba(0, 0, 0, 0.25);
  border-radius: 5px;
  //min-height: 688px;
`;

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
  background: ${(props) => (props.isActive ? '#292C33' : 'transparent')};
  border-radius: 4px;
  transition: all 0.2s ease;
  padding: 16px;

  &:hover {
    background: #292c33;
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
    background-color: rgba(37, 38, 54, 0.8);
    backdrop-filter: blur(12px);
  }
`;

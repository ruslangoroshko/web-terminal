import React, { useState, useEffect } from 'react';
import { useStores } from '../hooks/useStores';
import { PrimaryTextSpan } from '../styles/TextsElements';
import { FlexContainer } from '../styles/FlexContainer';
import { AccountComplete } from '../constants/accountTypes';
import BackgroundCongratulation from '../assets/images/account-types/confetti.png';
import IconStar from '../assets/svg/account-types/icon-type-star.svg';
import { observer } from 'mobx-react-lite';
import styled from '@emotion/styled';
import { useTranslation } from 'react-i18next';
import AccountBenefitsItem from './NavBar/AccountBenefitsItem';
import { PrimaryButton } from '../styles/Buttons';
import { useHistory, useLocation } from 'react-router-dom';
import Page from '../constants/Pages';
import Modal from './Modal';
import SvgIcon from './SvgIcon';

const CongratulationPopup = observer(() => {
  const { accountTypeStore, bonusStore } = useStores();
  const { push } = useHistory();
  const { t } = useTranslation();
  const location = useLocation();

  const [activeStatusInfo, setActiveStatusInfo] = useState<any>(null);

  const [queryParams, setParams] = React.useState<string | null>(null);

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    setParams(params.get('status'));
  }, [location]);

  useEffect(() => {
    setActiveStatusInfo(AccountComplete[accountTypeStore.actualType?.type || 0]);
  }, [
    accountTypeStore.actualType,
    accountTypeStore.showCongratulationsPopup,
  ]);

  const handleOpenDashboard = () => {
    accountTypeStore.setKVActiveStatus(
      accountTypeStore.actualType?.id || ''
    );
    push(Page.DASHBOARD);
    accountTypeStore.setShowPopup(false);
  };

  if (
    accountTypeStore.actualType === null ||
    activeStatusInfo === null ||
    activeStatusInfo.benefits.length === 0 ||
    !accountTypeStore.showCongratulationsPopup ||
    queryParams
  ) {
    return null;
  }

  return (
    <Modal>
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
          width="318px"
          borderRadius="16px"
          border="1px solid rgba(255, 255, 255, 0.12)"
          background="#2F323C"
          flexDirection="column"
          overflow="hidden"
          boxShadow="0px 4px 8px rgba(0, 0, 0, 0.1)"
        >
          <NextAccountTypeHeader
            padding="16px 24px"
            height="139px"
            backgroundColor={activeStatusInfo.color}
            backgroundImage={BackgroundCongratulation}
            width="100%"
            flexDirection="column"
            position="relative"
          >
            <PrimaryTextSpan
              color="#1C1F26"
              fontSize="24px"
              lineHeight="36px"
              fontWeight={700}
              textAlign="center"
            >
              {t('Congratulations')}!
            </PrimaryTextSpan>
            <PrimaryTextSpan
              color="#1C1F26"
              fontSize="14px"
              lineHeight="21px"
              fontWeight={500}
              textAlign="center"
            >
              {t('You received')} {accountTypeStore.actualType.name} {t('Status')}<br />
              {t('and unlocked')} {activeStatusInfo.benefits?.length} {t('benefits')}.
            </PrimaryTextSpan>
            <StarStatus
              position="absolute"
              border={`4px solid ${activeStatusInfo.color}`}
              background={activeStatusInfo.gradient}
              width="80px"
              height="80px"
              justifyContent="center"
              alignItems="center"
              bottom="-48px"
              left="calc(50% - 40px)"
              borderRadius="50px"
              boxShadowColor={activeStatusInfo.boxShadow}
            >
              <SvgIcon {...IconStar} fillColor={activeStatusInfo.color} width={48} height={48} />
            </StarStatus>
          </NextAccountTypeHeader>
          <FlexContainer
            width="100%"
            padding="80px 16px 16px"
            flexDirection="column"
          >
            <FlexContainer
              flexDirection="column"
              marginBottom="22px"
            >
              {activeStatusInfo.benefits.map(
                (item: any, counter: number) => <AccountBenefitsItem
                  key={`${accountTypeStore.nextType}_${counter}`}
                  icon={item.icon}
                  text={item.text}
                  color={activeStatusInfo.color}
                  type="actual"
                  isNew={item.isNew}
                />
              )}
            </FlexContainer>
            <PrimaryButton
              width="100%"
              padding="19px"
              type="button"
              onClick={handleOpenDashboard}
            >
              <PrimaryTextSpan
                color="#252636"
                fontSize="16px"
                lineHeight="18px"
              >
                {t('Let’s Trade')}
              </PrimaryTextSpan>
            </PrimaryButton>
          </FlexContainer>
        </FlexContainer>
      </ModalBackground>
    </Modal>
  );
});

export default CongratulationPopup;

const StarStatus = styled(FlexContainer)<{ boxShadowColor: string }>`
  filter: ${(props) => `drop-shadow(0px 8px 32px ${props.boxShadowColor})`};
`;

const ModalBackground = styled(FlexContainer)`
  background-color: rgba(37, 38, 54, 0.8);
  @supports ((-webkit-backdrop-filter: none) or (backdrop-filter: none)) {
    background-color: rgba(37, 38, 54, 0.6);
    backdrop-filter: blur(12px);
  }
`;

const NextAccountTypeHeader = styled(FlexContainer)`
  background-position: top right;
  background-repeat: no-repeat;
`;
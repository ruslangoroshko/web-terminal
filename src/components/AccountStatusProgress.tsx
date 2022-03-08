import 'react-circular-progressbar/dist/styles.css';
import styled from '@emotion/styled-base';
import React from 'react';
import { FlexContainer } from '../styles/FlexContainer';

import { buildStyles, CircularProgressbar } from 'react-circular-progressbar';
import { useStores } from '../hooks/useStores';
import { PrimaryTextSpan } from '../styles/TextsElements';
import { observer } from 'mobx-react-lite';
import { useTranslation } from 'react-i18next';

import SvgIcon from './SvgIcon';
import IconProgressStar from '../assets/svg/account-types/icon-type-star.svg';
import { AccountComplete, AccountToBe } from '../constants/accountTypes';
import { AccountStatusEnum } from '../enums/AccountStatusEnum';
import { PrimaryButton } from '../styles/Buttons';
import Page from '../constants/Pages';
import { useHistory } from 'react-router-dom';

const AccountStatusProgress = observer(() => {
  const { accountTypeStore, bonusStore } = useStores();
  const { t } = useTranslation();
  const { push } = useHistory();

  const handleOpenDeposit = () => {
    if (bonusStore.showBonus() && bonusStore.bonusData !== null) {
      bonusStore.setShowBonusPopup(true);
    } else {
      push(Page.DEPOSIT_POPUP);
    }
  };
  return (
    <FlexContainer
      width="100%"
      justifyContent="center"
      alignItems="flex-start"
      marginBottom="80px"
    >
      <FlexContainer marginRight="40px">
        <ProgressWrapper
          width="128px"
          height="128px"
          backgroundColor="rgba(255, 255, 255, 0.24)"
          borderRadius="50%"
          position="relative"
        >
          <CircularProgressbar
            value={
              accountTypeStore.actualType?.type === AccountStatusEnum.Vip
                ? 100
                : accountTypeStore.currentAccountTypeProgressPercentage || 0.1
            }
            styles={buildStyles({
              pathColor: AccountComplete[accountTypeStore.actualType?.type || 0].color,
              trailColor: 'transparent',
            })}
            strokeWidth={16}
          />
          <ProgressBackground
            gradient={AccountComplete[accountTypeStore.actualType?.type || 0].gradient}
            justifyContent="center"
            alignItems="center"
            flexDirection="column"
          >
            <SvgIcon
              {...IconProgressStar}
              fillColor={AccountToBe[accountTypeStore.actualType?.type || 0].color}
              width={40}
              height={40}
            />
            <PrimaryTextSpan color="#ffffff" fontSize="16px" fontWeight="bold">
              {t(accountTypeStore.actualType?.name || '')}
            </PrimaryTextSpan>
          </ProgressBackground>
        </ProgressWrapper>
      </FlexContainer>
      <FlexContainer flexDirection="column">
        <PrimaryTextSpan
          color="#fff"
          fontSize="40px"
          lineHeight="60px"
          fontWeight="bold"
        >
          {t('My Status')}
        </PrimaryTextSpan>
        {accountTypeStore.actualType?.type !== AccountStatusEnum.Vip && (
          <FlexContainer>
            <PrimaryTextSpan
              color="#fff"
              fontSize="20px"
              lineHeight="30px"
              fontWeight={400}
            >
              {`${t('Deposit')} $${
                accountTypeStore.amountToNextAccountType
              } ${t('to unlock')}`}
            </PrimaryTextSpan>
            <PrimaryTextSpan
              color={AccountToBe[accountTypeStore.nextType?.type || 0].color}
              fontSize="20px"
              lineHeight="30px"
              fontWeight={700}
            >
              &nbsp;
              {`${t(accountTypeStore.nextType?.name || '')} ${t(
                'Status'
              )}`}
            </PrimaryTextSpan>
          </FlexContainer>
        )}
        <FlexContainer margin="24px 0 0">
          <PrimaryButton
            width="360px"
            padding="16px"
            type="button"
            onClick={handleOpenDeposit}
          >
            <PrimaryTextSpan
              color="#252636"
              fontSize="16px"
              lineHeight="18px"
            >
              {accountTypeStore.actualType?.type === AccountStatusEnum.Vip
                ? t('Deposit')
                : t('Deposit to Get Status')}
            </PrimaryTextSpan>
          </PrimaryButton>
        </FlexContainer>
      </FlexContainer>
    </FlexContainer>
  );
});

export default AccountStatusProgress;

const ProgressWrapper = styled(FlexContainer)`
  position: relative;
  margin: 8px;
  box-shadow: 0px 0px 16px rgba(202, 226, 246, 0.12);
`;

const ReverseStar = styled(FlexContainer)`
  transform: scaleX(-1);
`;

const ProgressBackground = styled(FlexContainer)<{ gradient: string }>`
  position: absolute;
  width: 112px;
  height: 112px;
  border-radius: 50%;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  background: ${(props) => props.gradient};
  z-index: -1;
`;

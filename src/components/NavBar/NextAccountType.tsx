import React, { useEffect, useState } from 'react';
import { useStores } from '../../hooks/useStores';
import { PrimaryTextSpan } from '../../styles/TextsElements';
import { FlexContainer } from '../../styles/FlexContainer';
import { AccountToBe } from '../../constants/accountTypes';
import IconStar from '../../assets/svg/account-types/icon-type-star.svg';
import { observer } from 'mobx-react-lite';
import styled from '@emotion/styled';
import { useTranslation } from 'react-i18next';
import AccountBenefitsItem from './AccountBenefitsItem';
import { PrimaryButton } from '../../styles/Buttons';
import { useHistory } from 'react-router-dom';
import Page from '../../constants/Pages';
import { AccountStatusEnum } from '../../enums/AccountStatusEnum';

const NextAccountType = observer(() => {
  const { accountTypeStore } = useStores();
  const { push } = useHistory();
  const { t } = useTranslation();

  const [activeStatusInfo, setActiveStatusInfo] = useState<any>(null);

  useEffect(() => {
    setActiveStatusInfo(AccountToBe[accountTypeStore.actualType?.type || 0]);
  }, [accountTypeStore.actualType]);

  const handleOpenInfoPage = () => {
    push(Page.ACCOUNT_TYPE_INFO);
  };

  if (
    accountTypeStore.actualType === null ||
    activeStatusInfo === null ||
    activeStatusInfo.benefits.length === 0
  ) {
    return null;
  }

  return (
    <FlexContainer
      position="absolute"
      top="40px"
      left="0"
      width="307px"
      borderRadius="10px"
      border="1px solid rgba(255, 255, 255, 0.12)"
      background="#2F323C"
      flexDirection="column"
      overflow="hidden"
    >
      <NextAccountTypeHeader
        padding="16px 57px 16px 16px"
        minHeight="80px"
        backgroundColor={activeStatusInfo.color}
        backgroundImage={activeStatusInfo.backgroundImage}
        width="100%"
        alignItems="center"
      >
        {
          accountTypeStore.actualType.type !== AccountStatusEnum.Vip
            ? <PrimaryTextSpan
                color="#1C1F26"
                fontSize="16px"
                lineHeight="24px"
                fontWeight={700}
              >
                {t('Deposit')} ${accountTypeStore.amountToNextAccountType} <br />
                {t('to unlock')} {accountTypeStore.nextType?.name} {t('Status')}!
              </PrimaryTextSpan>
            : <PrimaryTextSpan
              color="#1C1F26"
              fontSize="16px"
              lineHeight="24px"
              fontWeight={700}
            >
              {accountTypeStore.actualType?.name} {t('Status')}!
            </PrimaryTextSpan>
        }
      </NextAccountTypeHeader>
      <FlexContainer
        width="100%"
        padding="20px 16px 16px"
        flexDirection="column"
      >
        <FlexContainer
          flexDirection="column"
          marginBottom="12px"
        >
          {
            accountTypeStore.actualType.type !== AccountStatusEnum.Vip && <AccountBenefitsItem
              icon={IconStar}
              text={`${t(`New`)} ${accountTypeStore.nextType?.name} ${t(`Status`)}`}
              color={activeStatusInfo.color}
              type="next"
            />
          }
          {activeStatusInfo.benefits.map(
            (item: any, counter: number) => <AccountBenefitsItem
              key={`${accountTypeStore.nextType}_${counter}`}
              icon={item.icon}
              text={item.text}
              color={activeStatusInfo.color}
              type="next"
            />
          )}
        </FlexContainer>
        <PrimaryButton
          width="100%"
          padding="19px"
          type="button"
          onClick={handleOpenInfoPage}
        >
          <PrimaryTextSpan
            color="#252636"
            fontSize="16px"
            lineHeight="18px"
          >
            {t('About Statuses')}
          </PrimaryTextSpan>
        </PrimaryButton>
      </FlexContainer>
    </FlexContainer>
  );
});

export default NextAccountType;

const NextAccountTypeHeader = styled(FlexContainer)`
  background-position: top right;
  background-repeat: no-repeat;
`;
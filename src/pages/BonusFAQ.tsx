import React from 'react';
import { FlexContainer } from '../styles/FlexContainer';
import { PrimaryTextSpan } from '../styles/TextsElements';
import { useTranslation } from 'react-i18next';
import styled from '@emotion/styled';
import SvgIcon from '../components/SvgIcon';
import IconClose from '../assets/svg/icon-close.svg';
import { ButtonWithoutStyles } from '../styles/ButtonWithoutStyles';
import AccountSettingsContainer from '../containers/AccountSettingsContainer';
import { useHistory } from 'react-router-dom';
import Page from '../constants/Pages';

const BonusFAQ = () => {
  const { t } = useTranslation();

  const { push } = useHistory();

  const closePage = () => {
    push(Page.DASHBOARD);
  };

  return (
    <AccountSettingsContainer>
      <FlexContainer
        width="720px"
        margin="0 auto 0 80px"
        flexDirection="column"
      >
        <IconButton onClick={closePage}>
          <SvgIcon
            {...IconClose}
            fillColor="rgba(255, 255, 255, 0.6)"
            hoverFillColor="#00FFF2"
            width="16px"
            height="16px"
          />
        </IconButton>
        <PrimaryTextSpan
          fontStyle="normal"
          fontWeight="bold"
          fontSize="26px"
          lineHeight="150%"
          letterSpacing="0.3px"
          color="#FFFFFF"
          marginBottom="24px"
        >
          {t('Bonus FAQ')}
        </PrimaryTextSpan>
        <SubtitleText>
          {t('What does “bonus” mean?')}
        </SubtitleText>
        <CasualText>
          {t('A “bonus” is the money that a company provides to a client for the purposes of trading only under certain conditions. You can view all details on your bonus account. A “bonus” is given to one account per client only.')}
        </CasualText>
        <SubtitleText>
          {t('What is my “bonus” amount?')}
        </SubtitleText>
        <CasualText>
          {t('The amount of “bonus” depends on the amount of money you deposit. The maximum bonus amount is $500.')}
        </CasualText>
        <SubtitleText>
          {t('What are the rules on the use of bonuses?')}
        </SubtitleText>
        <CasualText>
          {t('All the profit a trader makes belongs to him/her. It can be withdrawn at any moment and without any further conditions. But note that you cannot withdraw bonus funds themselves: if you submit a withdrawal request, your bonuses are burned.')}
          <br />
          {t('Example: If a trader deposited $100 in real funds to the account, and gets a $30 bonus fund, the account balance will be: $100 (own money) + $30 (bonus) = $130. A trader can use $130 for trading by depositing only $100. All the profits a trader makes will belong to him/her.')}
          <br />
          {t('A “bonus” cannot be lost until there is a balance on the account.')}
        </CasualText>
        <SubtitleText>
          {t('Can I withdraw my bonus money?')}
        </SubtitleText>
        <CasualText>
          {t('Bonuses will be automatically deducted if you apply to make a withdrawal.')}
        </CasualText>
      </FlexContainer>
    </AccountSettingsContainer>
  );
}

export default BonusFAQ;

const SubtitleText = styled(PrimaryTextSpan)`
  font-weight: normal;
  font-size: 13px;
  line-height: 140%;
  text-transform: uppercase;
  color: #FFFFFF;
  margin: 0 0 8xp;
`;

const CasualText = styled(PrimaryTextSpan)`
  font-weight: normal;
  font-size: 13px;
  line-height: 19px;
  color: rgba(255, 255, 255, 0.64);
  margin: 0 0 32px;
`;

const IconButton = styled(ButtonWithoutStyles)`
  margin-right: 8px;
  position: absolute;
  top: 10px;
  right: 10px;
  z-index: 1;
  &:last-of-type {
    margin-right: 0;
  }
`;

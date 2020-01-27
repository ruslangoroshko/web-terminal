import React, { FC } from 'react';
import styled from '@emotion/styled';
import { FlexContainer } from '../../styles/FlexContainer';
import {
  PrimaryTextSpan,
  PrimaryTextParagraph,
  QuoteText,
} from '../../styles/TextsElements';
import { AccountModelWebSocketDTO } from '../../types/Accounts';
import { useStores } from '../../hooks/useStores';
import { observer } from 'mobx-react-lite';
import { PrimaryButton, SecondaryButton } from '../../styles/Buttons';
import { getNumberSign } from '../../helpers/getNumberSign';
import { ButtonWithoutStyles } from '../../styles/ButtonWithoutStyles';
import SvgIcon from '../SvgIcon';
import IconClose from '../../assets/svg/icon-close.svg';
import Topics from '../../constants/websocketTopics';
import Fields from '../../constants/fields';

interface Props {
  account: AccountModelWebSocketDTO;
  toggle: () => void;
}

const AccountInfo: FC<Props> = observer(props => {
  const {
    account: { balance, currency, digits, id, investAmount, isLive, symbol },
    toggle,
  } = props;

  const { quotesStore, mainAppStore } = useStores();

  const isActiveAccount = mainAppStore.activeAccount?.id === id;

  const handleSwitch = (accountId: string) => () => {
    mainAppStore.activeSession?.send(Topics.SET_ACTIVE_ACCOUNT, {
      [Fields.ACCOUNT_ID]: accountId,
    });
    toggle();
  };

  return (
    <AccountWrapper
      flexDirection="column"
      isActive={isActiveAccount}
      padding="16px 44px 16px 16px"
      width="390px"
      position="relative"
    >
      {isActiveAccount && (
        <FlexContainer position="absolute" right="16px" top="16px">
          <ButtonWithoutStyles onClick={toggle}>
            <SvgIcon {...IconClose} fillColor="rgba(255,255,255, 0.4)" />
          </ButtonWithoutStyles>
        </FlexContainer>
      )}
      <FlexContainer justifyContent="space-between">
        <FlexContainer>
          <FlexContainer width="32px" height="32px" margin="0 12px 0 0">
            Image
          </FlexContainer>
          <FlexContainer flexDirection="column">
            <FlexContainer margin="0 0 4px 0">
              <PrimaryTextSpan
                marginRight="8px"
                fontSize="12px"
                fontWeight="bold"
              >
                {id}, {currency}
              </PrimaryTextSpan>
              <FlexContainer
                borderRadius="3px"
                border={
                  isLive
                    ? '1px solid rgba(255, 255, 255, 0.4)'
                    : '1px solid #EEFF00'
                }
                padding="0 4px"
              >
                <PrimaryTextSpan
                  fontSize="12px"
                  color={isLive ? 'rgba(255, 255, 255, 0.4)' : '#EEFF00'}
                >
                  {isLive ? 'Real' : 'Demo'}
                </PrimaryTextSpan>
              </FlexContainer>
            </FlexContainer>
            <PrimaryTextSpan>
              {symbol}
              {quotesStore.available.toFixed(2)}
            </PrimaryTextSpan>
          </FlexContainer>
        </FlexContainer>
        {isActiveAccount ? (
          <DepositButton>
            <PrimaryTextSpan fontSize="12px" color="#003A38" fontWeight="bold">
              Deposit
            </PrimaryTextSpan>
          </DepositButton>
        ) : (
          <SwitchButton onClick={handleSwitch(id)}>
            <PrimaryTextSpan color="#fffccc" fontSize="14px">
              Switch
            </PrimaryTextSpan>
          </SwitchButton>
        )}
      </FlexContainer>
      {isActiveAccount && (
        <FlexContainer padding="0 0 0 44px">
          <FlexContainer
            width="60px"
            margin="0 24px 0 0"
            flexDirection="column"
          >
            <PrimaryTextParagraph
              fontSize="12px"
              marginBottom="4px"
              color="rgba(255, 255, 255, 0.5)"
            >
              Invest:
            </PrimaryTextParagraph>
            <PrimaryTextSpan fontSize="12px" color="#fffccc">
              {symbol}
              {quotesStore.invest.toFixed(2)}
            </PrimaryTextSpan>
          </FlexContainer>
          <FlexContainer
            width="60px"
            margin="0 24px 0 0"
            flexDirection="column"
          >
            <PrimaryTextParagraph
              fontSize="12px"
              marginBottom="4px"
              color="rgba(255, 255, 255, 0.5)"
            >
              Profit:
            </PrimaryTextParagraph>

            <QuoteText fontSize="12px" isGrowth={quotesStore.profit >= 0}>
              {getNumberSign(quotesStore.profit)}
              {symbol}
              {Math.abs(quotesStore.profit).toFixed(2)}
            </QuoteText>
          </FlexContainer>
          <FlexContainer width="60px" flexDirection="column">
            <PrimaryTextParagraph
              fontSize="12px"
              marginBottom="4px"
              color="rgba(255, 255, 255, 0.5)"
            >
              Total:
            </PrimaryTextParagraph>
            <PrimaryTextSpan fontSize="12px" color="#fffccc">
              {symbol}
              {quotesStore.total.toFixed(2)}
            </PrimaryTextSpan>
          </FlexContainer>
        </FlexContainer>
      )}
    </AccountWrapper>
  );
});

export default AccountInfo;

const AccountWrapper = styled(FlexContainer)<{ isActive?: boolean }>`
  background: ${props =>
    props.isActive
      ? `radial-gradient(92.11% 100% at 0% 0%, rgba(255, 252, 204, 0.08) 0%, rgba(255, 252, 204, 0) 100%), rgba(255, 255, 255, 0.04)`
      : '#1C2026'};

  border-bottom: ${props =>
    props.isActive ? 'none' : '1px solid rgba(255, 255, 255, 0.16)'};

  &:last-of-type {
    border-bottom: none;
  }
`;

const DepositButton = styled(PrimaryButton)`
  padding: 8px 16px;
`;

const SwitchButton = styled(SecondaryButton)`
  padding: 6px 16px;
`;

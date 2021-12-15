import React, { useEffect, useRef, useState } from 'react';
import { useStores } from '../../hooks/useStores';
import { PrimaryTextSpan } from '../../styles/TextsElements';
import { FlexContainer } from '../../styles/FlexContainer';
import { AccountToBe } from '../../constants/accountTypes';
import { observer } from 'mobx-react-lite';
import styled from '@emotion/styled';
import IconStar from '../../assets/svg/account-types/icon-type-star.svg';
import SvgIcon from '../SvgIcon';
import NextAccountType from './NextAccountType';
import { AccountStatusEnum } from '../../enums/AccountStatusEnum';

const AccountType = observer(() => {
  const { accountTypeStore } = useStores();
  const wrapperRef = useRef<HTMLDivElement>(null);
  const [on, toggle] = useState(false);

  const handleToggle = () => {
    if (accountTypeStore.actualType?.type === AccountStatusEnum.Vip) {
      accountTypeStore.setShowPopup(true);
    } else {
      toggle(!on);
    }
  };

  const handleClickOutside = (e: any) => {
    if (wrapperRef.current && !wrapperRef.current.contains(e.target)) {
      toggle(false);
    }
  };

  useEffect(() => {
    document.addEventListener('mousedown', handleClickOutside);

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  if (accountTypeStore.actualType === null) {
    return null;
  }

  return (
    <AccountTypeWrapper
      alignItems="center"
      position="relative"
      onClick={handleToggle}
      ref={wrapperRef}
    >
      <FlexContainer marginRight="8px">
        <PrimaryTextSpan
          fontSize="14px"
          lineHeight="19.6px"
          fontWeight={700}
          color={AccountToBe[accountTypeStore.actualType?.type || 0].color}
          textTransform="uppercase"
        >
          {accountTypeStore.actualType?.name}
        </PrimaryTextSpan>
      </FlexContainer>
      <FlexContainer
        position="relative"
      >
        <FlexContainer
          top="1px"
          left="1px"
          position="absolute"
          width={`${accountTypeStore.currentAccountTypeProgressPercentage || 0}px`}
          height="12px"
          borderRadius="100px 0 0 100px"
          background={AccountToBe[accountTypeStore.actualType?.type || 0].color}
        >
        </FlexContainer>
        <OuterBar
          width="100px"
          height="12px"
          borderRadius="100px"
          border="1px solid rgba(255, 255, 255, 0.24)"
          background={AccountToBe[accountTypeStore.actualType?.type || 0].gradient}
        >
        </OuterBar>
        <FlexContainer
          top="-5px"
          right="-12px"
          position="absolute"
        >
          <SvgIcon
            {...IconStar}
            fillColor="#1c2026"
            width="24px"
            height="24px"
          />
        </FlexContainer>
        <FlexContainer
          top="-3px"
          right="-10px"
          position="absolute"
        >
          <SvgIcon
            {...IconStar}
            fillColor={AccountToBe[accountTypeStore.actualType?.type || 0].color}
            width="20px"
            height="20px"
          />
        </FlexContainer>
      </FlexContainer>
      {on && <NextAccountType />}
    </AccountTypeWrapper>
  );
});

export default AccountType;

const OuterBar = styled(FlexContainer)`
  box-sizing: content-box;
`;

const AccountTypeWrapper = styled(FlexContainer)`
  cursor: pointer;
`;

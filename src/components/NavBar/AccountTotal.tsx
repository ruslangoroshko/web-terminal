import React, { useState, useEffect } from 'react';
import { useStores } from '../../hooks/useStores';
import { PrimaryTextSpan } from '../../styles/TextsElements';
import { moneyFormat, moneyFormatPart } from '../../helpers/moneyFormat';
import useAccount from '../../hooks/useAccount';

const AccountTotal = () => {
  const { mainAppStore } = useStores();
  const { total } = useAccount();
  return (
    <PrimaryTextSpan fontSize="11px" color="#fffccc">
      {mainAppStore.activeAccount?.symbol}
      {moneyFormatPart(total).full}
    </PrimaryTextSpan>
  );
};

export default AccountTotal;

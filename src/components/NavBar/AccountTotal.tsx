import React, { useState, useEffect } from 'react';
import { useStores } from '../../hooks/useStores';
import { PrimaryTextSpan } from '../../styles/TextsElements';
import { moneyFormat } from '../../helpers/moneyFormat';
import useAccount from "../../hooks/useAccount";

const AccountTotal = () => {
  const { mainAppStore } = useStores();
  const { total } = useAccount();
  return (
    <PrimaryTextSpan fontSize="11px" color="#fffccc">
      {mainAppStore.activeAccount?.symbol}
      {moneyFormat(total)}
    </PrimaryTextSpan>
  );
};

export default AccountTotal;



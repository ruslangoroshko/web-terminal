import React, { useState, useEffect } from 'react';
import { useStores } from '../../hooks/useStores';
import { PrimaryTextSpan } from '../../styles/TextsElements';
import { moneyFormat, moneyFormatPart } from '../../helpers/moneyFormat';
import useAccount from '../../hooks/useAccount';
import { getNumberSignNegative } from '../../helpers/getNumberSign';
import Colors from '../../constants/Colors';

const AccountTotal = () => {
  const { mainAppStore } = useStores();
  const { total } = useAccount();
  return (
    <PrimaryTextSpan fontSize="11px" color={Colors.ACCENT}>
      {getNumberSignNegative(total)}
      {mainAppStore.activeAccount?.symbol}
      {moneyFormatPart(Math.abs(total)).full}
    </PrimaryTextSpan>
  );
};

export default AccountTotal;

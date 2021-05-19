import React, { useState, useEffect } from 'react';
import { useStores } from '../../hooks/useStores';
import { PrimaryTextSpan } from '../../styles/TextsElements';
import { autorun } from 'mobx';
import { moneyFormat } from '../../helpers/moneyFormat';

const AccountTotal = () => {
  const { mainAppStore, quotesStore } = useStores();
  const [total, setTotal] = useState(quotesStore.total);

  useEffect(
    () =>
      autorun(
        () => {
          setTotal(quotesStore.total);
        },
        { delay: 1000 }
      ),
    []
  );
  return (
    <PrimaryTextSpan fontSize="11px" color="#fffccc">
      {mainAppStore.activeAccount?.symbol}
      {moneyFormat(total)}
    </PrimaryTextSpan>
  );
};

export default AccountTotal;

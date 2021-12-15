import styled from '@emotion/styled-base';
import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { AccountInfoTable } from '../constants/accountTypes';
import { FlexContainer } from '../styles/FlexContainer';
import { PrimaryTextSpan } from '../styles/TextsElements';
import { v4 as uuid } from 'uuid';

import { AccountStatusTableTooltip } from '../constants/AccountStatusTableTooltip';
import { useStores } from '../hooks/useStores';
import { IAccountType } from '../types/AccountsTypes';
import { observer } from 'mobx-react-lite';
import { AccountStatusEnum } from '../enums/AccountStatusEnum';
import InformationPopup from './InformationPopup';

const AboutStatusTable = observer(() => {
  const { t } = useTranslation();
  const { accountTypeStore } = useStores();
  const [allTypes, setAllTypes] = useState<IAccountType[] | null>(null);

  useEffect(() => {
    setAllTypes(accountTypeStore.allTypes);
  }, [accountTypeStore.allTypes]);

  return (
    <FlexContainer maxWidth="100%" margin="0 auto" position="relative" overflow="auto">
      <FlexContainer marginRight="2px" flexDirection="column" width="114px">
        <TitleCell
          height="54px"
          minHeight="54px"
          width="112px"
          alignItems="center"
          padding="16px 6px 16px 16px"
          justifyContent="space-between"
          background="transparent"
          className="noneBorder"
        >
          <PrimaryTextSpan
            fontSize="13px"
            textTransform="uppercase"
            color="rgba(255, 255, 255, 0.64)"
          >
            {t('Status')}
          </PrimaryTextSpan>
        </TitleCell>
        {allTypes && allTypes.slice().sort(
          (a, b) => a.order - b.order
        ).map((el, index) => (
          <TitleCell
            key={uuid()}
            height="54px"
            minHeight="54px"
            width="112px"
            padding="16px"
            background={AccountInfoTable[el.type].gradient}
            justifyContent="center"
            flexDirection="column"
            className={
              index === 0
                ? 'first'
                : index === (allTypes.length - 1)
                ? 'last'
                : ''
            }
          >
            <PrimaryTextSpan fontWeight={700} fontSize="16px" color={AccountInfoTable[el.type].color}>
              {el.name}
            </PrimaryTextSpan>
            {el.type === AccountStatusEnum.Gold && <FlexContainer
              padding="0 4px"
              height="15px"
              background="#FFFCCC"
              borderRadius="4px"
              alignItems="center"
              justifyContent="center"
            >
              <PrimaryTextSpan
                fontSize="10px"
                lineHeight="15px"
                color="#1C1F26"
                textTransform="uppercase"
              >
                {t('popular')}
              </PrimaryTextSpan>
            </FlexContainer>}
          </TitleCell>
        ))}
      </FlexContainer>

      <FlexContainer
        flex="1"
        width="100%"
      >
        <FlexContainer flexDirection="column">
          <CellRowContainer
            height="54px"
            alignItems="center"
            className={'noneBorder'}
          >
            {AccountStatusTableTooltip.map((item) => (
              <TableHeaderCellItem key={item.id} item={item} />
            ))}
          </CellRowContainer>
          {allTypes && allTypes.slice().sort(
            (a, b) => a.order - b.order
          ).map((el)  => (
            <CellRowContainer
              height="54px"
              alignItems="center"
              key={uuid()}
            >
              {Object.values(AccountInfoTable[el.type].description).map((desc, index) => (
                <FlexContainer
                  key={uuid()}
                  justifyContent="flex-start"
                  alignItems="center"
                  padding="4px 0 4px 12px"
                  width="144px"
                  height="54px"
                  className={
                    [5, 6].includes(index)
                      ? 'short'
                      : [2].includes(index)
                      ? 'long'
                      : ''
                  }
                >
                  <PrimaryTextSpan color="#fff" fontSize="14px">
                    {
                      index === 0
                        ? `${t('from')} ${desc}`
                        : index === 1
                        ? `${desc} ${t('instruments')}`
                        : t(desc)
                    }
                  </PrimaryTextSpan>
                </FlexContainer>
              ))}
            </CellRowContainer>
          ))}
        </FlexContainer>
      </FlexContainer>
    </FlexContainer>
  );
});

export default AboutStatusTable;

const TitleCell = styled(FlexContainer)<{ background: string }>`
  border-bottom: 2px solid #1C1F26;
  border-right: 2px solid #1C1F26;
  background: ${(props) => props.background};
  &.first {
    border-radius: 8px 0px 0px 0px;
  }
  &.last {
    border-radius: 0px 0px 0px 8px;
    border-bottom: none;
  }
  &.noneBorder {
    border-bottom: none;
    border-right: none;
  }
`;

const CellRowContainer = styled(FlexContainer)`
  border-bottom: 2px solid #1C1F26;
  &.noneBorder {
    border-bottom: none;
  }
  .short {
    width: 100px;
  }
  .long {
    width: 170px;
  }
`;

interface TableHeaderCellItemProps {
  item: {
    id: string;
    label: string;
    tooltipText: string;
    blockWidth: string;
  };
}

const TableHeaderCellItem = ({ item }: TableHeaderCellItemProps) => {
  const { t } = useTranslation();

  return (
    <FlexContainer
      justifyContent="flex-start"
      alignItems="center"
      padding="4px 0 4px 12px"
      width={item.blockWidth}
      minHeight="54px"
    >
      <PrimaryTextSpan
        marginRight="6px"
        fontSize="13px"
        textTransform="uppercase"
        color="rgba(255, 255, 255, 0.64)"
      >
        {t(`${item.label}`)}
      </PrimaryTextSpan>

      <InformationPopup bgColor="#000000" classNameTooltip="type_tooltip" direction="bottom" width="222px">
        <PrimaryTextSpan>{t(`${item.tooltipText}`)}</PrimaryTextSpan>
      </InformationPopup>
    </FlexContainer>
  );
};

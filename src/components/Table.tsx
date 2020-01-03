import React, { FC, Fragment } from 'react';
import styled from '@emotion/styled';
import { ButtonWithoutStyles } from '../styles/ButtonWithoutStyles';
import calculateFloatingProfitAndLoss from '../helpers/calculateFloatingProfitAndLoss';
import { AskBidEnum } from '../enums/AskBid';
import { FlexContainer } from '../styles/FlexContainer';
import { PositionModelWSDTO } from '../types/Positions';
import { useStores } from '../hooks/useStores';

interface Props {
  data: PositionModelWSDTO[];
  columns: any[];
  closePosition: (positionId: number) => () => void;
  instrumentId: string;
  multiplier: number;
}

const Table: FC<Props> = ({
  columns,
  data,
  closePosition,
  instrumentId,
  multiplier: leverage,
}) => {
  console.log('TCL: data', data);

  const { quotesStore } = useStores();

  const quote = quotesStore.quotes[instrumentId] || {
    ask: 0,
    bid: 0,
  };

  const calcPnL = (args: any) => {
    return calculateFloatingProfitAndLoss(args);
  };

  return (
    <FlexContainer>
      {columns.map(column => (
        <TdDiv key={column.Header}>{column.Header}</TdDiv>
      ))}
      <FlexContainer>
        {data.map(row => (
          <Fragment key={row.id}>
            {Object.values(row).map(item => (
              <TdDiv>{item}</TdDiv>
            ))}
            <TdDiv key={row.id}>
              {calcPnL({
                investment: row.investmentAmount,
                leverage,
                costs: row.swap + row.commission,
                side: row.operation === AskBidEnum.Buy ? 1 : -1,
                currentPrice:
                  row.operation === AskBidEnum.Buy ? quote.bid.c : quote.ask.c,
                openPrice: row.openPrice,
              })}
            </TdDiv>
            <TdDiv>
              <ButtonWithoutStyles onClick={closePosition(row.id)}>
                close Position
              </ButtonWithoutStyles>
            </TdDiv>
          </Fragment>
        ))}
      </FlexContainer>
    </FlexContainer>
  );
};
export default Table;

const TdDiv = styled.div`
  flex: 1;
  color: #fffccc;
  padding: 10px;
`;

import React, { FC, useContext, Fragment } from 'react';

import styled from '@emotion/styled';
import { ButtonWithoutStyles } from '../styles/ButtonWithoutStyles';
import { QuotesContext } from '../store/QuotesProvider';
import calculateFloatingProfitAndLoss from '../helpers/calculateFloatingProfitAndLoss';
import { AskBidEnum } from '../enums/AskBid';
import { FlexContainer } from '../styles/FlexContainer';
import { PositionModelWSDTO } from '../types/Positions';

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

  const { quotes } = useContext(QuotesContext);

  const quote = quotes[instrumentId] || {
    ask: 0,
    bid: 0,
  };

  const calcPnL = (args: any) => {
    return calculateFloatingProfitAndLoss(args);
  };

  return (
    <FlexContainer>
      {columns.map(column => (
        <TdDiv>{column.Header}</TdDiv>
      ))}
      <FlexContainer>
        {data.map((row, i) => (
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
  color: white;
  padding: 10px;
`;

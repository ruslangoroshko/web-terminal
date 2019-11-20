import React, { FC, useContext } from 'react';

import { useTable, Column } from 'react-table';
import styled from '@emotion/styled';
import { ButtonWithoutStyles } from '../styles/ButtonWithoutStyles';
import { QuotesContext } from '../store/QuotesProvider';
import calculateFloatingProfitAndLoss from '../helpers/calculateFloatingProfitAndLoss';
import { AskBidEnum } from '../enums/AskBid';

interface Props {
  data: any[];
  columns: Column<any>[];
  closePosition: (positionId: number) => () => void;
  instrumentId: string;
  balance: number;
  leverage: number;
}

const Table: FC<Props> = ({
  columns,
  data,
  closePosition,
  instrumentId,
  balance,
  leverage,
}) => {
  // Use the state and functions returned from useTable to build your UI
  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    rows,
    prepareRow,
  } = useTable({
    columns,
    data,
  });

  const { quotes } = useContext(QuotesContext);

  const quote = quotes[instrumentId] || {
    ask: 0,
    bid: 0,
  };

  const calcPnL = (args: any) => {
    return calculateFloatingProfitAndLoss(args);
  };
  return (
    <table {...getTableProps()}>
      <thead>
        {headerGroups.map(headerGroup => (
          <tr {...headerGroup.getHeaderGroupProps()}>
            {headerGroup.headers.map(column => (
              <Th {...column.getHeaderProps()}>{column.render('Header')}</Th>
            ))}
            <Th>Floating P&amp;L</Th>
          </tr>
        ))}
      </thead>
      <tbody {...getTableBodyProps()}>
        {rows.map((row, i) => {
          prepareRow(row);
          return (
            <tr {...row.getRowProps()}>
              {row.cells.map(cell => {
                return <Td {...cell.getCellProps()}>{cell.render('Cell')}</Td>;
              })}
              <Td>
                {calcPnL({
                  investment: balance,
                  leverage,
                  costs: row.values.swap + row.values.comission,
                  side: row.values.type === AskBidEnum.Buy ? 1 : -1,
                  currentPrice:
                    row.values.type === AskBidEnum.Buy ? quote.ask : quote.bid,
                  openPrice: row.values.openPrice,
                })}
              </Td>
              <Td>
                <ButtonWithoutStyles onClick={closePosition(row.values.id)}>
                  close Position
                </ButtonWithoutStyles>
              </Td>
            </tr>
          );
        })}
      </tbody>
    </table>
  );
};
export default Table;

const Th = styled.th`
  color: #fff;
  font-weight: bold;
  padding: 10px;
`;

const Td = styled.td`
  padding: 4px 10px;
  color: #fff;
`;

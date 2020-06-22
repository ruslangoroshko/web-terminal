import React from 'react';
import { FlexContainer } from '../../styles/FlexContainer';
import { TableGrid, DisplayContents, Td } from '../../styles/TableElements';
import { PrimaryTextSpan } from '../../styles/TextsElements';

const WithdrawHistoryTab = () => {
  return (
    <FlexContainer flexDirection="column" justifyContent="center">
      <TableGrid columnsCount={9} maxHeight="calc(100vh - 235px)">
        <DisplayContents>
          <Td>
            <FlexContainer alignItems="center">
              <PrimaryTextSpan
                fontSize="12px"
                color="#FFFCCC"
                whiteSpace="nowrap"
                fontWeight="bold"
              >
                Bank cards (** 7556)
              </PrimaryTextSpan>
            </FlexContainer>
          </Td>
          <Td>
            <FlexContainer alignItems="center">
              <PrimaryTextSpan
                fontSize="12px"
                color="rgba(255,255,255,0.4)"
                whiteSpace="nowrap"
              >
                06 Dec 2019, 13:10
              </PrimaryTextSpan>
            </FlexContainer>
          </Td>
          <Td>
            <FlexContainer alignItems="center">
              <PrimaryTextSpan
                fontSize="12px"
                color="#FFFCCC"
                whiteSpace="nowrap"
              >
                $5.00
              </PrimaryTextSpan>
            </FlexContainer>
          </Td>
          <Td>
            <FlexContainer alignItems="center">
              <PrimaryTextSpan
                fontSize="12px"
                color="#FFFCCC"
                whiteSpace="nowrap"
              >
                Pending
              </PrimaryTextSpan>
            </FlexContainer>
          </Td>
          <Td>
            <FlexContainer alignItems="center">
              <PrimaryTextSpan
                fontSize="12px"
                color="#FFFCCC"
                whiteSpace="nowrap"
              >
                Cancel
              </PrimaryTextSpan>
            </FlexContainer>
          </Td>
        </DisplayContents>
      </TableGrid>
    </FlexContainer>
  );
};

export default WithdrawHistoryTab;

import styled from '@emotion/styled';
import { observer } from 'mobx-react-lite';
import React from 'react';
import Colors from '../../constants/Colors';
import { AskBidEnum } from '../../enums/AskBid';
import { useStores } from '../../hooks/useStores';
import { FlexContainer } from '../../styles/FlexContainer';
import { PrimaryTextSpan } from '../../styles/TextsElements';

const OrdersBooks = observer(() => {
  const { orderBookStore, instrumentsStore } = useStores();

  const instrumentDigits =
    instrumentsStore.activeInstrument?.instrumentItem.digits;

  return (
    <FlexContainer padding="20px 0 12px" flexDirection="column" width="100%">
      <FlexContainer padding="4px 0">
        <PrimaryTextSpan
          color="rgba(255, 255, 255, 0.3)"
          fontSize="11px"
          lineHeight="12px"
          textTransform="uppercase"
          marginBottom="4px"
        >
          Order Book
        </PrimaryTextSpan>
      </FlexContainer>
      <Devider />

      <FlexContainer flexDirection="column" width="100%">
        {/*  */}
        <FlexContainer marginBottom="4px">
          <FlexContainer width="50%" padding="0 12px" justifyContent="flex-end">
            <PrimaryTextSpan color="rgba(255, 255, 255, 0.3)">
              Bid
            </PrimaryTextSpan>
          </FlexContainer>
          <FlexContainer width="50%" padding="0 12px">
            <PrimaryTextSpan color="rgba(255, 255, 255, 0.3)">
              Ask
            </PrimaryTextSpan>
          </FlexContainer>
        </FlexContainer>
        {/*  */}
        <FlexContainer>
          {/* left */}
          <FlexContainer width="50%" flexDirection="column">
            {orderBookStore.bids.map((bid) => (
              <OrderItem
                key={`order-item-bid-${bid[0]}`}
                operation={AskBidEnum.Buy}
                fillPercent={orderBookStore.getOrderPercent(
                  AskBidEnum.Buy,
                  bid[0]
                )}
              >
                <PrimaryTextSpan
                  color={Colors.WHITE}
                  fontSize="12px"
                  fontWeight={500}
                >
                  {bid[1].toFixed(2)}
                </PrimaryTextSpan>
                <PrimaryTextSpan fontSize="12px" color="#00ffdd">
                  {bid[0].toFixed(instrumentDigits)}
                </PrimaryTextSpan>
              </OrderItem>
            ))}
          </FlexContainer>
          {/* right  */}
          <FlexContainer width="50%" flexDirection="column">
            {orderBookStore.asks.map((ask) => (
              <OrderItem
                key={`order-item-ask-${ask[0]}`}
                operation={AskBidEnum.Sell}
                fillPercent={orderBookStore.getOrderPercent(
                  AskBidEnum.Sell,
                  ask[0]
                )}
              >
                <PrimaryTextSpan
                  fontSize="12px"
                  color={Colors.WHITE}
                  fontWeight={500}
                >
                  {ask[1].toFixed(2)}
                </PrimaryTextSpan>
                <PrimaryTextSpan fontSize="12px" color="#ed145b">
                  {ask[0].toFixed(instrumentDigits)}
                </PrimaryTextSpan>
              </OrderItem>
            ))}
          </FlexContainer>
        </FlexContainer>
      </FlexContainer>
    </FlexContainer>
  );
});

export default OrdersBooks;

const OrderItem = styled(FlexContainer)<{
  operation: AskBidEnum;
  fillPercent: number;
}>`
  align-items: center;
  justify-content: space-between;
  flex-direction: ${(props) =>
    props.operation === AskBidEnum.Sell ? 'row-reverse' : 'row'};

  padding: 4px 12px;

  position: relative;

  &:after {
    content: '';
    position: absolute;
    top: 0;
    bottom: 0;
    background-color: ${(props) =>
      props.operation === AskBidEnum.Sell
        ? 'rgb(255 0 83 / 30%)'
        : 'rgb(0 184 160 / 54%)'};
    width: ${(props) => `${props.fillPercent}%`};
    left: ${(props) => (props.operation === AskBidEnum.Sell ? '0px' : 'auto')};
    right: ${(props) => (props.operation === AskBidEnum.Sell ? 'auto' : '0px')};
    z-index: -1;
  }
`;

const Devider = styled.div`
  height: 1px;
  background-color: ${Colors.WHITE_TINE};
  margin-bottom: 4px;
`;

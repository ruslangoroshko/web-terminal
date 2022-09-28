import styled from '@emotion/styled';
import React from 'react';
import Colors from '../../constants/Colors';
import { AskBidEnum } from '../../enums/AskBid';
import { FlexContainer } from '../../styles/FlexContainer';
import { PrimaryTextSpan } from '../../styles/TextsElements';

const OrdersBooks = () => {
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
            <OrderItem operation={AskBidEnum.Buy} fillPercent={20}>
              <PrimaryTextSpan color={Colors.WHITE} fontWeight={500}>
                542
              </PrimaryTextSpan>
              <PrimaryTextSpan color="#00ffdd">19 278.49</PrimaryTextSpan>
            </OrderItem>
            <OrderItem operation={AskBidEnum.Buy} fillPercent={23}>
              <PrimaryTextSpan color={Colors.WHITE} fontWeight={500}>
                542
              </PrimaryTextSpan>
              <PrimaryTextSpan color="#00ffdd">19 278.49</PrimaryTextSpan>
            </OrderItem>
            <OrderItem operation={AskBidEnum.Buy} fillPercent={30}>
              <PrimaryTextSpan color={Colors.WHITE} fontWeight={500}>
                542
              </PrimaryTextSpan>
              <PrimaryTextSpan color="#00ffdd">19 278.49</PrimaryTextSpan>
            </OrderItem>
            <OrderItem operation={AskBidEnum.Buy} fillPercent={43}>
              <PrimaryTextSpan color={Colors.WHITE} fontWeight={500}>
                542
              </PrimaryTextSpan>
              <PrimaryTextSpan color="#00ffdd">19 278.49</PrimaryTextSpan>
            </OrderItem>
            <OrderItem operation={AskBidEnum.Buy} fillPercent={50}>
              <PrimaryTextSpan color={Colors.WHITE} fontWeight={500}>
                542
              </PrimaryTextSpan>
              <PrimaryTextSpan color="#00ffdd">19 278.49</PrimaryTextSpan>
            </OrderItem>
            <OrderItem operation={AskBidEnum.Buy} fillPercent={60}>
              <PrimaryTextSpan color={Colors.WHITE} fontWeight={500}>
                542
              </PrimaryTextSpan>
              <PrimaryTextSpan color="#00ffdd">19 278.49</PrimaryTextSpan>
            </OrderItem>
            <OrderItem operation={AskBidEnum.Buy} fillPercent={76}>
              <PrimaryTextSpan color={Colors.WHITE} fontWeight={500}>
                542
              </PrimaryTextSpan>
              <PrimaryTextSpan color="#00ffdd">19 278.49</PrimaryTextSpan>
            </OrderItem>
            <OrderItem operation={AskBidEnum.Buy} fillPercent={80}>
              <PrimaryTextSpan color={Colors.WHITE} fontWeight={500}>
                542
              </PrimaryTextSpan>
              <PrimaryTextSpan color="#00ffdd">19 278.49</PrimaryTextSpan>
            </OrderItem>
            <OrderItem operation={AskBidEnum.Buy} fillPercent={90}>
              <PrimaryTextSpan color={Colors.WHITE} fontWeight={500}>
                542
              </PrimaryTextSpan>
              <PrimaryTextSpan color="#00ffdd">19 278.49</PrimaryTextSpan>
            </OrderItem>
            <OrderItem operation={AskBidEnum.Buy} fillPercent={100}>
              <PrimaryTextSpan color={Colors.WHITE} fontWeight={500}>
                542
              </PrimaryTextSpan>
              <PrimaryTextSpan color="#00ffdd">19 278.49</PrimaryTextSpan>
            </OrderItem>
          </FlexContainer>
          {/* right  */}
          <FlexContainer width="50%" flexDirection="column">
            <OrderItem operation={AskBidEnum.Sell} fillPercent={20}>
              <PrimaryTextSpan color={Colors.WHITE} fontWeight={500}>
                542
              </PrimaryTextSpan>
              <PrimaryTextSpan color="#ed145b">19 278.49</PrimaryTextSpan>
            </OrderItem>
            <OrderItem operation={AskBidEnum.Sell} fillPercent={20}>
              <PrimaryTextSpan color={Colors.WHITE} fontWeight={500}>
                542
              </PrimaryTextSpan>
              <PrimaryTextSpan color="#ed145b">19 278.49</PrimaryTextSpan>
            </OrderItem>
            <OrderItem operation={AskBidEnum.Sell} fillPercent={30}>
              <PrimaryTextSpan color={Colors.WHITE} fontWeight={500}>
                542
              </PrimaryTextSpan>
              <PrimaryTextSpan color="#ed145b">19 278.49</PrimaryTextSpan>
            </OrderItem>
            <OrderItem operation={AskBidEnum.Sell} fillPercent={40}>
              <PrimaryTextSpan color={Colors.WHITE} fontWeight={500}>
                542
              </PrimaryTextSpan>
              <PrimaryTextSpan color="#ed145b">19 278.49</PrimaryTextSpan>
            </OrderItem>
            <OrderItem operation={AskBidEnum.Sell} fillPercent={50}>
              <PrimaryTextSpan color={Colors.WHITE} fontWeight={500}>
                542
              </PrimaryTextSpan>
              <PrimaryTextSpan color="#ed145b">19 278.49</PrimaryTextSpan>
            </OrderItem>
            <OrderItem operation={AskBidEnum.Sell} fillPercent={70}>
              <PrimaryTextSpan color={Colors.WHITE} fontWeight={500}>
                542
              </PrimaryTextSpan>
              <PrimaryTextSpan color="#ed145b">19 278.49</PrimaryTextSpan>
            </OrderItem>
            <OrderItem operation={AskBidEnum.Sell} fillPercent={76}>
              <PrimaryTextSpan color={Colors.WHITE} fontWeight={500}>
                542
              </PrimaryTextSpan>
              <PrimaryTextSpan color="#ed145b">19 278.49</PrimaryTextSpan>
            </OrderItem>
            <OrderItem operation={AskBidEnum.Sell} fillPercent={80}>
              <PrimaryTextSpan color={Colors.WHITE} fontWeight={500}>
                542
              </PrimaryTextSpan>
              <PrimaryTextSpan color="#ed145b">19 278.49</PrimaryTextSpan>
            </OrderItem>
            <OrderItem operation={AskBidEnum.Sell} fillPercent={80}>
              <PrimaryTextSpan color={Colors.WHITE} fontWeight={500}>
                542
              </PrimaryTextSpan>
              <PrimaryTextSpan color="#ed145b">19 278.49</PrimaryTextSpan>
            </OrderItem>
            <OrderItem operation={AskBidEnum.Sell} fillPercent={100}>
              <PrimaryTextSpan color={Colors.WHITE} fontWeight={500}>
                542
              </PrimaryTextSpan>
              <PrimaryTextSpan color="#ed145b">19 278.49</PrimaryTextSpan>
            </OrderItem>
          </FlexContainer>
        </FlexContainer>
      </FlexContainer>
    </FlexContainer>
  );
};

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

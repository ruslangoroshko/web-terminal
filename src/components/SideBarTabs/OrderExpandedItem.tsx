import React from 'react';
import { FlexContainer } from '../../styles/FlexContainer';
import { PrimaryTextSpan } from '../../styles/TextsElements';
import SvgIcon from '../SvgIcon';
import IconShevronDown from '../../assets/svg/icon-shevron-logo-down.svg';
import IconShevronUp from '../../assets/svg/icon-shevron-logo-up.svg';
import { AskBidEnum } from '../../enums/AskBid';
import moment from 'moment';
import { useStores } from '../../hooks/useStores';
import styled from '@emotion/styled';
import InformationPopup from '../InformationPopup';
import API from '../../helpers/API';
import { getProcessId } from '../../helpers/getProcessId';
import { SecondaryButton } from '../../styles/Buttons';
import { DisplayContents, Td } from '../../styles/TableElements';
import { PendingOrdersWSDTO } from '../../types/PendingOrdersTypes';
import ImageContainer from '../ImageContainer';

interface Props {
  position: PendingOrdersWSDTO;
  currencySymbol: string;
}

function OrderExpandedItem(props: Props) {
  const {
    position: {
      id,
      instrument,
      investmentAmount,
      multiplier,
      openPrice,
      operation,
      created,
    },
    currencySymbol,
  } = props;
  const { mainAppStore } = useStores();

  const isBuy = operation === AskBidEnum.Buy;
  const Icon = isBuy ? IconShevronUp : IconShevronDown;

  const closePosition = () => {
    API.removePendingOrder({
      accountId: mainAppStore.activeAccount!.id,
      orderId: id,
      processId: getProcessId(),
    });
  };
  return (
    <DisplayContents>
      <Td>
        <FlexContainer width="32px" height="32px">
          <ImageContainer instrumentId={instrument} />
        </FlexContainer>
        <FlexContainer flexDirection="column" margin="0 8px 0 0" width="170px">
          <PrimaryTextSpan fontSize="14px" color="#fffccc" marginBottom="4px">
            {instrument}
          </PrimaryTextSpan>
          <PrimaryTextSpan fontSize="10px" color="rgba(255, 255, 255, 0.4)">
            {instrument}
          </PrimaryTextSpan>
        </FlexContainer>
      </Td>
      <Td>
        <FlexContainer>
          <FlexContainer margin="0 6px 0 0">
            <SvgIcon {...Icon} fillColor={isBuy ? '#00FFDD' : '#ED145B'} />
          </FlexContainer>
          <FlexContainer flexDirection="column">
            <PrimaryTextSpan
              fontSize="14px"
              lineHeight="20px"
              color={isBuy ? '#00FFDD' : '#ED145B'}
              textTransform="uppercase"
              marginBottom="2px"
            >
              {isBuy ? 'Buy' : 'Sell'}
            </PrimaryTextSpan>
            <PrimaryTextSpan
              fontSize="11px"
              color="rgba(255, 255, 255, 0.4)"
              whiteSpace="nowrap"
            >
              at {openPrice}
            </PrimaryTextSpan>
          </FlexContainer>
        </FlexContainer>
      </Td>
      <Td>
        <FlexContainer flexDirection="column">
          <PrimaryTextSpan
            color="#fffccc"
            fontSize="14px"
            lineHeight="20px"
            marginBottom="2px"
          >
            {moment(created).format('DD MMM')}
          </PrimaryTextSpan>
          <PrimaryTextSpan color="rgba(255, 255, 255, 0.5)" fontSize="11px">
            {moment(created).format('HH:mm:ss')}
          </PrimaryTextSpan>
        </FlexContainer>
      </Td>
      <Td alignItems="center" flexDirection="column">
        <PrimaryTextSpan
          color="#fffccc"
          fontSize="14px"
          lineHeight="20px"
          marginBottom="2px"
        >
          {currencySymbol}
          {investmentAmount}
        </PrimaryTextSpan>
        <PrimaryTextSpan color="rgba(255, 255, 255, 0.5)" fontSize="11px">
          &times;{multiplier}
        </PrimaryTextSpan>
      </Td>
      <Td justifyContent="center" alignItems="center">
        <PrimaryTextSpan color="rgba(255, 255, 255, 0.5)" fontSize="11px">
          &mdash;
        </PrimaryTextSpan>
      </Td>
      <Td justifyContent="center" alignItems="center">
        <PrimaryTextSpan color="rgba(255, 255, 255, 0.5)" fontSize="11px">
          &mdash;
        </PrimaryTextSpan>
      </Td>
      <Td alignItems="center" justifyContent="center">
        <FlexContainer
          flexDirection="column"
          alignItems="center"
          margin="0 18px 0 0"
        >
          <ButtonClose onClick={closePosition}>
            <PrimaryTextSpan fontSize="12px" color="#fff">
              Cancel order
            </PrimaryTextSpan>
          </ButtonClose>
        </FlexContainer>
        <FlexContainer flexDirection="column" alignItems="center">
          <InformationPopup
            classNameTooltip={`position_expaned_${id}`}
            bgColor="#000"
            width="200px"
            direction="left"
          >
            <FlexContainer flexDirection="column" width="100%">
              <FlexContainer justifyContent="space-between" margin="0 0 8px 0">
                <PrimaryTextSpan
                  color="rgba(255, 255, 255, 0.4)"
                  fontSize="12px"
                >
                  Price opened
                </PrimaryTextSpan>
                <PrimaryTextSpan color="#fffccc" fontSize="12px">
                  at {openPrice}
                </PrimaryTextSpan>
              </FlexContainer>
              <FlexContainer justifyContent="space-between" margin="0 0 8px 0">
                <PrimaryTextSpan
                  color="rgba(255, 255, 255, 0.4)"
                  fontSize="12px"
                >
                  Created
                </PrimaryTextSpan>
                <PrimaryTextSpan color="#fffccc" fontSize="12px">
                  {moment(created).format('DD MMM, HH:mm')}
                </PrimaryTextSpan>
              </FlexContainer>
              <FlexContainer justifyContent="space-between">
                <PrimaryTextSpan
                  color="rgba(255, 255, 255, 0.4)"
                  fontSize="12px"
                >
                  Position ID
                </PrimaryTextSpan>
                <PrimaryTextSpan color="#fffccc" fontSize="12px">
                  {id}
                </PrimaryTextSpan>
              </FlexContainer>
            </FlexContainer>
          </InformationPopup>
        </FlexContainer>
      </Td>
    </DisplayContents>
  );
}

export default OrderExpandedItem;

const ButtonClose = styled(SecondaryButton)``;

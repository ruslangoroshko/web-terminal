import React, { useRef, useCallback } from 'react';
import { FlexContainer } from '../../styles/FlexContainer';
import { PositionModelWSDTO } from '../../types/Positions';
import { PrimaryTextSpan, QuoteText } from '../../styles/TextsElements';
import SvgIcon from '../SvgIcon';
import IconShevronDown from '../../assets/svg/icon-shevron-logo-down.svg';
import IconShevronUp from '../../assets/svg/icon-shevron-logo-up.svg';
import { AskBidEnum } from '../../enums/AskBid';
import moment from 'moment';
import { getNumberSign } from '../../helpers/getNumberSign';
import { useStores } from '../../hooks/useStores';
import calculateFloatingProfitAndLoss from '../../helpers/calculateFloatingProfitAndLoss';
import InformationPopup from '../InformationPopup';
import API from '../../helpers/API';
import { getProcessId } from '../../helpers/getProcessId';
import { DisplayContents, Td } from '../../styles/TableElements';
import ImageContainer from '../ImageContainer';
import { TpSlTypeEnum } from '../../enums/TpSlTypeEnum';
import ClosePositionPopup from './ClosePositionPopup';
import { useTranslation } from 'react-i18next';
import useInstrument from '../../hooks/useInstrument';
import apiResponseCodeMessages from '../../constants/apiResponseCodeMessages';
import { OperationApiResponseCodes } from '../../enums/OperationApiResponseCodes';
import ActivePositionPnL from './ActivePositionPnL';
import ActivePositionPnLPercent from './ActivePositionPnLPercent';
import ActivePositionEquity from './ActivePositionEquity';
import EquityPnL from './EquityPnL';

interface Props {
  position: PositionModelWSDTO;
  currencySymbol: string;
}

function ActivePositionExpanded(props: Props) {
  const { position, currencySymbol } = props;

  const { mainAppStore, notificationStore } = useStores();
  const { t } = useTranslation();

  const { precision } = useInstrument(position.instrument);

  const instrumentRef = useRef<HTMLDivElement>(null);

  const isBuy = position.operation === AskBidEnum.Buy;
  const Icon = isBuy ? IconShevronUp : IconShevronDown;

  const closePosition = async () => {
    try {
      const response = await API.closePosition({
        accountId: mainAppStore.activeAccount!.id,
        positionId: position.id,
        processId: getProcessId(),
      });

      notificationStore.notificationMessage = t(
        apiResponseCodeMessages[response.result]
      );
      notificationStore.isSuccessfull =
        response.result === OperationApiResponseCodes.Ok;
      notificationStore.openNotification();
    } catch (error) {}
  };
  return (
    <DisplayContents>
      <Td>
        <FlexContainer width="32px" height="32px" marginRight="8px">
          <ImageContainer instrumentId={position.instrument} />
        </FlexContainer>
        <FlexContainer flexDirection="column" margin="0 8px 0 0" width="170px">
          <PrimaryTextSpan fontSize="14px" color="#fffccc" marginBottom="4px">
            {position.instrument}
          </PrimaryTextSpan>
          <PrimaryTextSpan fontSize="10px" color="rgba(255, 255, 255, 0.4)">
            {position.instrument}
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
              {isBuy ? t('Buy') : t('Sell')}
            </PrimaryTextSpan>
            <PrimaryTextSpan
              fontSize="11px"
              color="rgba(255, 255, 255, 0.4)"
              whiteSpace="nowrap"
            >
              {t('at')} {position.openPrice.toFixed(+precision)}
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
            {moment(position.openDate).format('DD MMM')}
          </PrimaryTextSpan>
          <PrimaryTextSpan color="rgba(255, 255, 255, 0.5)" fontSize="11px">
            {moment(position.openDate).format('HH:mm:ss')}
          </PrimaryTextSpan>
        </FlexContainer>
      </Td>
      <Td justifyContent="flex-end">
        <FlexContainer flexDirection="column" alignItems="flex-end">
          <PrimaryTextSpan
            color="#fffccc"
            fontSize="14px"
            lineHeight="20px"
            marginBottom="2px"
          >
            {currencySymbol}
            {position.investmentAmount.toFixed(2)}
          </PrimaryTextSpan>
          <PrimaryTextSpan color="rgba(255, 255, 255, 0.5)" fontSize="11px">
            &times;{position.multiplier}
          </PrimaryTextSpan>
        </FlexContainer>
      </Td>
      <Td justifyContent="flex-end">
        <FlexContainer flexDirection="column" alignItems="flex-end">
          <ActivePositionPnL position={position}></ActivePositionPnL>
          <ActivePositionPnLPercent
            position={position}
          ></ActivePositionPnLPercent>
        </FlexContainer>
      </Td>
      <Td justifyContent="flex-end" alignItems="center">
        <FlexContainer flexDirection="column" alignItems="flex-end">
          <ActivePositionEquity position={position}></ActivePositionEquity>
        </FlexContainer>
      </Td>
      <Td justifyContent="center" alignItems="center">
        <FlexContainer flexDirection="column" alignItems="center">
          <PrimaryTextSpan fontSize="12px" color="#fff">
            {position.tp !== null ? (
              <>
                {position.tpType !== TpSlTypeEnum.Price &&
                  position.tp < 0 &&
                  '-'}
                {position.tpType !== TpSlTypeEnum.Price && currencySymbol}
                {position.tpType === TpSlTypeEnum.Price
                  ? Math.abs(position.tp)
                  : Math.abs(position.tp).toFixed(2)}
              </>
            ) : (
              '-'
            )}
          </PrimaryTextSpan>
        </FlexContainer>
      </Td>
      <Td justifyContent="center" alignItems="center">
        <FlexContainer flexDirection="column" alignItems="center">
          <PrimaryTextSpan fontSize="12px" color="#fff">
            {position.sl !== null ? (
              <>
                {position.slType !== TpSlTypeEnum.Price &&
                  position.sl < 0 &&
                  '-'}
                {position.slType !== TpSlTypeEnum.Price && currencySymbol}
                {position.slType === TpSlTypeEnum.Price
                  ? Math.abs(position.sl)
                  : Math.abs(position.sl).toFixed(2)}
              </>
            ) : (
              '-'
            )}
          </PrimaryTextSpan>
        </FlexContainer>
      </Td>
      <Td alignItems="center">
        <FlexContainer
          flexDirection="column"
          alignItems="center"
          margin="0 16px 0 0"
          position="relative"
        >
          <ClosePositionPopup
            applyHandler={closePosition}
            ref={instrumentRef}
            buttonLabel={`${t('Close')}`}
            confirmText={`${t('Close position')}?`}
            isButton
            alignPopup="right"
          />
        </FlexContainer>
        <FlexContainer flexDirection="column" alignItems="center">
          <InformationPopup
            classNameTooltip={`position_expaned_${position.id}`}
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
                  {t('Price opened')}
                </PrimaryTextSpan>
                <PrimaryTextSpan color="#fffccc" fontSize="12px">
                  {t('at')} {position.openPrice.toFixed(+precision)}
                </PrimaryTextSpan>
              </FlexContainer>
              <FlexContainer justifyContent="space-between" margin="0 0 8px 0">
                <PrimaryTextSpan
                  color="rgba(255, 255, 255, 0.4)"
                  fontSize="12px"
                >
                  {t('Opened')}
                </PrimaryTextSpan>
                <PrimaryTextSpan color="#fffccc" fontSize="12px">
                  {moment(position.openDate).format('DD MMM, HH:mm')}
                </PrimaryTextSpan>
              </FlexContainer>
              <FlexContainer justifyContent="space-between" margin="0 0 8px 0">
                <PrimaryTextSpan
                  color="rgba(255, 255, 255, 0.4)"
                  fontSize="12px"
                >
                  {t('Equity')}
                </PrimaryTextSpan>
                <EquityPnL position={position} />
              </FlexContainer>
              <FlexContainer justifyContent="space-between" margin="0 0 8px 0">
                <PrimaryTextSpan
                  color="rgba(255, 255, 255, 0.4)"
                  fontSize="12px"
                >
                  {t('Overnight fee')}
                </PrimaryTextSpan>
                <PrimaryTextSpan color="#fffccc" fontSize="12px">
                  {getNumberSign(position.swap)}
                  {mainAppStore.activeAccount?.symbol}
                  {Math.abs(position.swap).toFixed(2)}
                </PrimaryTextSpan>
              </FlexContainer>
              <FlexContainer justifyContent="space-between">
                <PrimaryTextSpan
                  color="rgba(255, 255, 255, 0.4)"
                  fontSize="12px"
                >
                  {t('Position ID')}
                </PrimaryTextSpan>
                <PrimaryTextSpan color="#fffccc" fontSize="12px">
                  {position.id}
                </PrimaryTextSpan>
              </FlexContainer>
            </FlexContainer>
          </InformationPopup>
        </FlexContainer>
      </Td>
    </DisplayContents>
  );
}

export default ActivePositionExpanded;

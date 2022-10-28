import styled from '@emotion/styled';
import { observer } from 'mobx-react-lite';
import React, { useEffect, useState } from 'react';
import Colors from '../../../constants/Colors';
import { useStores } from '../../../hooks/useStores';
import { FlexContainer } from '../../../styles/FlexContainer';
import SvgIcon from '../../SvgIcon';
import ActivePositionsPortfolioTab from '../ActivePositions';
import IconPortfolioNoDataExpanded from '../../../assets/svg/icon-portfolio-no-data-expanded.svg';
import { PrimaryTextParagraph } from '../../../styles/TextsElements';
import { useTranslation } from 'react-i18next';

import {
  DragDropContext,
  Droppable,
  Draggable,
  DropResult,
} from 'react-beautiful-dnd';
import { autorun } from 'mobx';

// a little function to help us with reordering the result
const reorder = (list: any, startIndex: number, endIndex: number) => {
  const result = Array.from(list);
  const [removed] = result.splice(startIndex, 1);
  result.splice(endIndex, 0, removed);

  return result;
};

const getItemStyle = (isDragging: any, draggableStyle: any) => ({
  // some basic styles to make the items look a bit nicer
  userSelect: 'none',
  // styles we need to apply on draggables
  ...draggableStyle,
});

const getListStyle = (isDraggingOver: boolean) => ({
  // background: isDraggingOver ? 'transparent' : '#222232',
});

const PortfolioInstrumentList = () => {
  const { quotesStore, tradingViewStore } = useStores();
  const { t } = useTranslation();

  const [list, setList] = useState<any[]>([]);
  const onDragEnd = (result: DropResult) => {
    // dropped outside the list
    if (!result.destination) {
      return;
    }
    const items: any[] = reorder(
      list,
      result.source.index,
      result.destination.index
    );
    setList(items);
  };

  useEffect(() => {
    autorun(() => {
      if (quotesStore.sortedActivePositions) {
        setList(quotesStore.sortedActivePositions);
      }
    });
  }, []);

  return (
    <ActivePositionsWrapper flexDirection="column">
      <DragDropContext onDragEnd={onDragEnd}>
        <Droppable droppableId="droppablePortfolio">
          {(provided, snapshot) => (
            <div
              {...provided.droppableProps}
              ref={provided.innerRef}
              style={getListStyle(snapshot.isDraggingOver)}
            >
              {list.map((item, index) => (
                <Draggable
                  key={`drag-item-${item.id}`}
                  draggableId={`drag-item-${item.id}`}
                  index={index}
                >
                  {(provided, snapshot) => (
                    <div
                      ref={provided.innerRef}
                      {...provided.draggableProps}
                      {...provided.dragHandleProps}
                      style={getItemStyle(
                        snapshot.isDragging,
                        provided.draggableProps.style
                      )}
                    >
                      <ActivePositionsPortfolioTab
                        needScroll={index >= list.length - 2}
                        ready={tradingViewStore.tradingWidgetReady}
                        // key={item.id}
                        position={item}
                      />
                    </div>
                  )}
                </Draggable>
              ))}
              {provided.placeholder}
            </div>
          )}
        </Droppable>
      </DragDropContext>
      {!list.length && (
        <FlexContainer
          flexDirection="column"
          alignItems="center"
          padding="30px 0 0 0"
        >
          <FlexContainer margin="0 0 18px 0">
            <SvgIcon
              {...IconPortfolioNoDataExpanded}
              fillColor={Colors.WHITE_LIGHT}
              width={40}
              height={32}
            />
          </FlexContainer>
          <PrimaryTextParagraph fontSize="14px" color={Colors.WHITE_LIGHT}>
            {t("You haven't opened any positions yet")}
          </PrimaryTextParagraph>
        </FlexContainer>
      )}
    </ActivePositionsWrapper>
  );
};

export default PortfolioInstrumentList;

const ActivePositionsWrapper = styled(FlexContainer)`
  overflow-y: auto;
  height: 100%;
  max-height: calc(100% - 205px);
  scroll-behavior: smooth;

  ::-webkit-scrollbar {
    width: 4px;
    border-radius: 2px;
  }

  ::-webkit-scrollbar-track-piece {
    background-color: transparent;
  }
  ::-webkit-scrollbar-thumb:vertical {
    background-color: rgba(0, 0, 0, 0.6);
  }
`;

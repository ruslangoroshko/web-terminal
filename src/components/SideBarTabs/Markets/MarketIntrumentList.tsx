import styled from '@emotion/styled';
import { Observer, observer } from 'mobx-react-lite';
import React, { useEffect, useState } from 'react';
import { useStores } from '../../../hooks/useStores';
import { FlexContainer } from '../../../styles/FlexContainer';
import InstrumentMarkets from '../InstrumentMarkets';

import {
  DragDropContext,
  Droppable,
  Draggable,
  DropResult,
} from 'react-beautiful-dnd';
import { autorun } from 'mobx';
import API from '../../../helpers/API';
import KeysInApi from '../../../constants/keysInApi';
import { InstrumentModelWSDTO } from '../../../types/InstrumentsTypes';
import { SortByMarketsEnum } from '../../../enums/SortByMarketsEnum';

// a little function to help us with reordering the result
const reorder = (
  list: InstrumentModelWSDTO[],
  startIndex: number,
  endIndex: number
) => {
  const result = Array.from(list);
  const [removed] = result.splice(startIndex, 1);
  result.splice(endIndex, 0, removed);
  return result;
};
const getItemStyle = (isDragging: any, draggableStyle: any) => ({
  userSelect: 'none',
  ...draggableStyle,
});

const MarketIntrumentList = () => {
  const { instrumentsStore, sortingStore } = useStores();

  const onDragEnd = (result: DropResult) => {
    if (!result.destination) {
      return;
    }
    const items: InstrumentModelWSDTO[] = reorder(
      instrumentsStore.sortedInstruments,
      result.source.index,
      result.destination.index
    );

    const savedSort = {
      ...instrumentsStore.activeInstrumentsSortRule,
      [items[0].groupId]: items.map((item, i) => ({ id: item.id, weight: i })),
    };
    try {
      API.setKeyValue({
        key: KeysInApi.MARKET_SORT_LIST,
        value: JSON.stringify(savedSort),
      });
    } catch (error) {}
    sortingStore.setMarketsSortBy(SortByMarketsEnum.Custom);
    instrumentsStore.setActiveInstrumentsSortRule(savedSort);
  };

  useEffect(() => {
    instrumentsStore.getCustomMarketSortList();
  }, []);

  return (
    <MarketsWrapper flexDirection="column">
      <DragDropContext onDragEnd={onDragEnd}>
        <Droppable droppableId="droppable">
          {(provided, snapshot) => (
            <div {...provided.droppableProps} ref={provided.innerRef}>
              <Observer>
                {() => (
                  <>
                    {instrumentsStore.sortedInstruments.map((item, index) => (
                      <Draggable
                        key={item.id}
                        draggableId={item.id}
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
                            <InstrumentMarkets
                              instrument={item}
                              key={item.id}
                            />
                          </div>
                        )}
                      </Draggable>
                    ))}
                  </>
                )}
              </Observer>
              {provided.placeholder}
            </div>
          )}
        </Droppable>
      </DragDropContext>
    </MarketsWrapper>
  );
};

export default MarketIntrumentList;

const MarketsWrapper = styled(FlexContainer)`
  overflow-y: auto;
  max-height: calc(100% - 160px);
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

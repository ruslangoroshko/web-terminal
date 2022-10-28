import styled from '@emotion/styled';
import { observer } from 'mobx-react-lite';
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
  // background: isDraggingOver ? 'lightblue' : 'lightgrey',
});

const MarketIntrumentList = observer(() => {
  const { instrumentsStore } = useStores();

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
      if (instrumentsStore.sortedInstruments) {
        setList(instrumentsStore.sortedInstruments);
      }
    });
  }, []);

  return (
    <MarketsWrapper flexDirection="column">
      <DragDropContext onDragEnd={onDragEnd}>
        <Droppable droppableId="droppable">
          {(provided, snapshot) => (
            <div
              {...provided.droppableProps}
              ref={provided.innerRef}
              style={getListStyle(snapshot.isDraggingOver)}
            >
              {list.map((item, index) => (
                <Draggable key={item.id} draggableId={item.id} index={index}>
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
                      <InstrumentMarkets instrument={item} key={item.id} />
                    </div>
                  )}
                </Draggable>
              ))}
              {provided.placeholder}
            </div>
          )}
        </Droppable>
      </DragDropContext>
    </MarketsWrapper>
  );
});

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

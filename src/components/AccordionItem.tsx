import React, { useState, useRef, FC, useEffect } from 'react';
import styled from '@emotion/styled';
import { ButtonWithoutStyles } from '../styles/ButtonWithoutStyles';
import { FlexContainer } from '../styles/FlexContainer';

interface Props {
  title: string;
  isActiveInit?: boolean;
}

const AccordionItem: FC<Props> = props => {
  const { title, children, isActiveInit } = props;
  const [isActive, setActiveState] = useState(!!isActiveInit);
  const [maxHeight, setHeightState] = useState('0px');

  const content = useRef<HTMLDivElement>(null);
  function toggleAccordion() {
    setActiveState(!isActive);
    if (content.current) {
      setHeightState(isActive ? '0px' : `${content.current.scrollHeight}px`);
    }
  }

  useEffect(() => {
    if (content.current) {
      setHeightState(!isActive ? '0px' : `${content.current.scrollHeight}px`);
    }
  }, []);
  return (
    <FlexContainer flexDirection="column" width="100%">
      <AccordionButton isActive={isActive} onClick={toggleAccordion}>
        <Title>{title}</Title>
      </AccordionButton>
      <Content ref={content} maxHeight={maxHeight}>
        {children}
      </Content>
    </FlexContainer>
  );
};

export default AccordionItem;

const AccordionButton = styled(ButtonWithoutStyles)<{
  isActive: boolean;
}>`
  background-color: ${props => (props.isActive ? '#b4b9c5' : '#484f62')};
  color: #fff;
  cursor: pointer;
  padding: 18px;
  display: flex;
  align-items: center;
  transition: background-color 0.6s ease;
  will-change: background-color;

  &:hover {
    background-color: #b4b9c5;
  }
`;

const Title = styled.p`
  font-weight: bold;
  margin-bottom: 0;
`;

const Content = styled.div<{ maxHeight?: string }>`
  max-height: ${props => props.maxHeight};
  overflow: hidden;
  transition: max-height 0.6s ease;
  will-change: max-height;
`;

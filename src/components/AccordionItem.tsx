import React, { useState, useRef, FC } from 'react';
import styled from '@emotion/styled';
import { ButtonWithoutStyles } from '../styles/ButtonWithoutStyles';
import { FlexContainer } from '../styles/FlexContainer';

interface Props {
  title: string;
}

const AccordionItem: FC<Props> = props => {
  const { title, children } = props;

  const [isActive, setActiveState] = useState(false);
  const [maxHeight, setHeightState] = useState('0px');
  //   const [setRotate, setRotateState] = useState('accordion__icon');

  const content = useRef<HTMLDivElement>(null);
  function toggleAccordion() {
    setActiveState(!isActive);
    if (content.current) {
      setHeightState(isActive ? '0px' : `${content.current!.scrollHeight}px`);
    }
    // setRotateState(isActive ? 'accordion__icon' : 'accordion__icon rotate');
  }

  return (
    <FlexContainer flexDirection="column" width="100%">
      <AccordionButton isActive={isActive} onClick={toggleAccordion}>
        <Title>{title}</Title>
        {/* <Chevron className={`${setRotate}`} width={10} fill={'#777'} /> */}
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
`;

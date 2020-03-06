import React from 'react';
import { FlexContainer } from '../styles/FlexContainer';
import RealDemoImage from '../assets/images/demo-real.png';
import { PrimaryTextParagraph, PrimaryTextSpan } from '../styles/TextsElements';
import styled from '@emotion/styled';
import { ButtonWithoutStyles } from '../styles/ButtonWithoutStyles';

interface Props {}

function DemoRealPopup(props: Props) {
  const {} = props;

  return (
    <FlexContainer
      boxShadow="0px 12px 24px rgba(0, 0, 0, 0.25), 0px 6px 12px rgba(0, 0, 0, 0.25)"
      borderRadius="4px"
      backgroundColor="rgba(0,0,0,0.4)"
      position="relative"
      width="534px"
      flexDirection="column"
      padding="65px 52px 40px"
    >
      <FlexContainer margin="0 0 42px 0">
        <img width={174} src={RealDemoImage}></img>
      </FlexContainer>
      <PrimaryTextParagraph
        fontSize="20px"
        fontWeight="bold"
        marginBottom="10px"
        color="#fffccc"
      >
        Congratulations!
      </PrimaryTextParagraph>
      <PrimaryTextParagraph fontSize="11px" color="#fffccc" marginBottom="42px">
        You Have Successfully Registered
      </PrimaryTextParagraph>
      <FlexContainer justifyContent="space-between">
        <DemoButton>
          <PrimaryTextSpan fontSize="14px" fontWeight="bold" color="#fff">
            Practice on Demo
          </PrimaryTextSpan>
        </DemoButton>
        <RealButton>
          <PrimaryTextSpan fontSize="14px" fontWeight="bold" color="#000">
            Invest Real funds
          </PrimaryTextSpan>
        </RealButton>
      </FlexContainer>
    </FlexContainer>
  );
}

export default DemoRealPopup;

const DemoButton = styled(ButtonWithoutStyles)`
  border-radius: 4px;
  background-color: #ff0764;
  width: 200px;
  height: 40px;
  margin-right: 30px;
`;

const RealButton = styled(ButtonWithoutStyles)`
  border-radius: 4px;
  background-color: #00fff2;
  width: 200px;
  height: 40px;
  margin-right: 30px;
`;

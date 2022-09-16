import styled from '@emotion/styled-base';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { ButtonWithoutStyles } from '../../styles/ButtonWithoutStyles';
import { FlexContainer } from '../../styles/FlexContainer';
import { PrimaryTextSpan } from '../../styles/TextsElements';
import IconClose from '../../assets/images/icon-close.png';
import { IHint, IPosition } from '../../types/HintsTypes';
import css from '@emotion/css';

interface Props {
  item: IHint;
  onClose: () => void;
  onNext: () => void;
  total: number;
  currentStepNum: number;
}
const HintBlock = ({ item, currentStepNum, total, onClose, onNext }: Props) => {
  const { t } = useTranslation();

  const handleNext = () => onNext();
  const handleClose = () => onClose();
  return (
    <Hint
      flexWrap="wrap"
      width="344px"
      backgroundColor="#00ffdd"
      borderRadius="5px"
      padding="24px 32px 16px 16px"
      position="absolute"
      margin="0 auto"
      trangleDirection={item.positionTriangleDirection}
      trianglePos={item.positionTriangle}
      top={item.position.top}
      left={item.position.left}
      bottom={item.position.bottom}
      right={item.position.right}
    >
      <FlexContainer position="absolute" right="8px" top="8px">
        <CloseHintBtn onClick={handleClose} />
      </FlexContainer>
      <PrimaryTextSpan
        color="#1C1F26"
        fontSize="16px"
        lineHeight="150%"
        marginBottom="12px"
      >
        {t(`${item.text}`)}
      </PrimaryTextSpan>
      <FlexContainer
        width="100%"
        justifyContent="space-between"
        alignItems="center"
      >
        <NextButton
          onClick={currentStepNum === total ? handleClose : handleNext}
        >
          <PrimaryTextSpan color="#fff" fontSize="14px" fontWeight="bold">
            {currentStepNum === total ? t('Finish') : t('Next')}
          </PrimaryTextSpan>
        </NextButton>

        <PrimaryTextSpan color="#1C1F26" fontSize="14px">
          {`${currentStepNum} ${t('of')} ${total}`}
        </PrimaryTextSpan>
      </FlexContainer>
    </Hint>
  );
};

export default HintBlock;

const Hint = styled(FlexContainer)<{ trangleDirection: 'top' | 'bottom' | "left" | "right"; trianglePos: IPosition}>`
  &::before {
    content: "";
    width: 0;
    height: 0;
    position: absolute;
    top: ${props => props.trianglePos.top};
    right: ${props => props.trianglePos.right};
    bottom: ${props => props.trianglePos.bottom};
    left: ${props => props.trianglePos.left};
    margin: 0 auto;

    ${props => props.trangleDirection === 'top' && css(`
      border-left: 10px solid transparent;
      border-right: 10px solid transparent;
      border-bottom: 10px solid #00ffdd;
    `)};

    ${props => props.trangleDirection === 'bottom' && css(`
      border-left: 10px solid transparent;
      border-right: 10px solid transparent;
      border-top: 10px solid #00ffdd;
    `)}

    ${props => props.trangleDirection === 'left' && css(`
      border-top: 10px solid transparent;
      border-bottom: 10px solid transparent; 
      border-right: 10px solid #00ffdd; 
    `)}

    ${props => props.trangleDirection === 'right' && css(`
      border-top: 10px solid transparent;
      border-bottom: 10px solid transparent;
      border-left: 10px solid #00ffdd;
    `)}
  }
`;

const NextButton = styled(ButtonWithoutStyles)`
  background: #1c1f26;
  border-radius: 4px;
  height: 40px;
  width: 128px;
`;

const CloseHintBtn = styled(ButtonWithoutStyles)`
  width: 20px;
  height: 20px;
  background-image: ${`url(${IconClose})`};
  background-position: center center;
  background-repeat: no-repeat;
  background-size: cover;
`;

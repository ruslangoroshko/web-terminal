import React, { useRef } from 'react';
import { FlexContainer } from '../styles/FlexContainer';

import { PrimaryTextParagraph } from '../styles/TextsElements';
import styled from '@emotion/styled';
import { ButtonWithoutStyles } from '../styles/ButtonWithoutStyles';
import Modal from './Modal';
import { useStores } from '../hooks/useStores';

import IconCopy from '../assets/svg_no_compress/icon-copy.svg';
import SvgIcon from './SvgIcon';
import { useTranslation } from 'react-i18next';
import Colors from '../constants/Colors';

function BadRequestPopup() {
  const copyText = useRef<HTMLInputElement>(null);
  const [copied, setCopied] = React.useState(false);
  const { badRequestPopupStore } = useStores();
  const { t } = useTranslation();

  const handleCopyText = () => {
    if (copyText && copyText.current) {
      copyText.current.select();
      document.execCommand('copy');
      setCopied(true);
    }
  };

  return (
    <Modal>
      <BackgroundWrapperLayout
        position="fixed"
        top="0"
        left="0"
        right="0"
        bottom="0"
        justifyContent="center"
        alignItems="center"
        zIndex="1004"
      >
        <FlexContainer
          boxShadow="0px 12px 24px rgba(0, 0, 0, 0.25), 0px 6px 12px rgba(0, 0, 0, 0.25)"
          borderRadius="4px"
          backgroundColor="rgba(0,0,0,0.4)"
          position="relative"
          width="534px"
          flexDirection="column"
          padding="65px 52px 40px"
          alignItems="center"
        >
          <PrimaryTextParagraph
            fontSize="20px"
            fontWeight="bold"
            marginBottom="10px"
            color={Colors.ACCENT}
          >
            {t('Something went wrong')}
          </PrimaryTextParagraph>
          <PrimaryTextParagraph
            fontSize="11px"
            color={Colors.ACCENT}
            marginBottom="42px"
          >
            {t('Please try again later or reload the page')}
          </PrimaryTextParagraph>

          <CustomButton
            onClick={() => {
              badRequestPopupStore.closeModal();
              badRequestPopupStore.setMessage('');
              window.location.reload();
            }}
          >
            {t('Reload')}
          </CustomButton>

          <FlexContainer position="relative">
            <TextBlockForDev
              ref={copyText}
              value={badRequestPopupStore.requestMessage || 'message is empty'}
              readOnly
              className={`${copied && 'active'}`}
            />
            <CustomIcon onClick={handleCopyText}>
              <SvgIcon {...IconCopy} />
            </CustomIcon>
          </FlexContainer>
        </FlexContainer>
      </BackgroundWrapperLayout>
    </Modal>
  );
}

export default BadRequestPopup;

const CustomIcon = styled.span`
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  right: 10px;
  cursor: pointer;
`;

const TextBlockForDev = styled.input`
  color: ${Colors.ACCENT};
  background: rgba(255, 255, 255, 0.06);
  border: 1px solid rgba(255, 255, 255, 0.19);
  box-sizing: border-box;
  border-radius: 4px;
  width: 250px;
  padding: 8px;
  text-align: center;
  margin: 15px 0;
  position: relative;
  padding-right: 50px;
  outline: none;
  &.active {
    border-color: green;
  }
  &::selection {
    background-color: transparent;
    color: ${Colors.ACCENT};
  }
`;

const CustomButton = styled(ButtonWithoutStyles)`
  border-radius: 4px;
  background-color: ${Colors.PRIMARY};
  width: 200px;
  height: 40px;
  transition: all 0.2s ease;
  will-change: background-color;

  &:hover {
    background-color: ${Colors.PRIMARY_LIGHT};
  }
`;

const BackgroundWrapperLayout = styled(FlexContainer)`
  background-color: rgba(0, 0, 0, 0.7);
  @supports ((-webkit-backdrop-filter: none) or (backdrop-filter: none)) {
    background-color: rgba(0, 0, 0, 0.34);
    backdrop-filter: blur(12px);
  }
`;

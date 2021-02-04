import React, { useState, useRef, useEffect, forwardRef, FC } from 'react';
import { FlexContainer } from '../../styles/FlexContainer';
import SetAutoclose from '../BuySellPanel/SetAutoclose';
import { ButtonWithoutStyles } from '../../styles/ButtonWithoutStyles';
import styled from '@emotion/styled';
import { useTranslation } from 'react-i18next';
import { ConnectForm } from '../BuySellPanel/ConnectForm';

interface Props {
  children: React.ReactNode;
  isDisabled?: boolean;
  handleSumbitMethod: any;
}

const AutoClosePopupSideBar = forwardRef<HTMLDivElement, Props>(
  ({ children, isDisabled, handleSumbitMethod }, ref) => {
    const { t } = useTranslation();

    const [on, toggle] = useState(false);
    const [isTop, setIsTop] = useState(true);

    const [popupPosition, setPopupPosition] = useState({
      top: 0,
      left: 0,
      width: 0,
      bottom: 0,
      height: 0,
    });

    const wrapperRef = useRef<HTMLDivElement>(null);

    const handleToggle = () => {
      toggle(!on);
      const {
        top,
        left,
        width,
        bottom,
        height,

        // @ts-ignore
      } = ref.current.getBoundingClientRect();
      setPopupPosition({ top, left, width, bottom, height });
      const rect = wrapperRef.current?.getBoundingClientRect();
      if (rect && window.innerHeight - rect.top - 252 <= 0) {
        setIsTop(false);
      }
    };

    const handleClickOutside = (e: any) => {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target)) {
        toggle(false);
      }
    };

    useEffect(() => {
      document.addEventListener('mousedown', handleClickOutside);
      return () => {
        document.removeEventListener('mousedown', handleClickOutside);
      };
    }, []);

    return (
      <ConnectForm>
        {({ errors, watch, handleSubmit }) => {
          return (
            <FlexContainer ref={wrapperRef}>
              <ButtonWithoutStyles type="button" onClick={handleToggle}>
                {children}
              </ButtonWithoutStyles>
              <FlexContainer
                position="absolute"
                // FIXME: think about this stupid sheet
                top={
                  isTop
                    ? `${
                        popupPosition.top + Math.round(popupPosition.height / 5)
                      }px`
                    : 'auto'
                }
                left={`${Math.round(popupPosition.width * 0.75)}px`}
                bottom={isTop ? 'auto' : '20px'}
                zIndex="101"
                visibilityProp={on ? 'visible' : 'hidden'}
              >
                <SetAutoclose isDisabled={isDisabled} toggle={toggle}>
                  <ButtonApply
                    type="button"
                    disabled={isDisabled}
                    onClick={handleSubmit(handleSumbitMethod)}
                  >
                    {t('Apply')}
                  </ButtonApply>
                </SetAutoclose>
              </FlexContainer>
            </FlexContainer>
          );
        }}
      </ConnectForm>
    );
  }
);

export default AutoClosePopupSideBar;

const ButtonApply = styled(ButtonWithoutStyles)`
  background: linear-gradient(0deg, #00fff2, #00fff2);
  border-radius: 4px;
  font-weight: bold;
  font-size: 14px;
  line-height: 16px;
  color: #003a38;
  height: 32px;
`;

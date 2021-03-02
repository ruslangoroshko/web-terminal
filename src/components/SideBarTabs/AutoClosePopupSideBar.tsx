import React, { useState, useRef, useEffect, forwardRef, useCallback } from 'react';
import { FlexContainer } from '../../styles/FlexContainer';
import SetAutoclose from '../BuySellPanel/SetAutoclose';
import { ButtonWithoutStyles } from '../../styles/ButtonWithoutStyles';
import styled from '@emotion/styled';
import { useTranslation } from 'react-i18next';
import { useStores } from '../../hooks/useStores';
import { TpSlTypeEnum } from '../../enums/TpSlTypeEnum';
import { useFormContext } from 'react-hook-form';
import { FormValues } from '../../types/Positions';
import { autorun } from 'mobx';

interface Props {
  children: React.ReactNode;
  isDisabled?: boolean;
  handleSumbitMethod: (values: any) => Promise<any>;
  tpType: TpSlTypeEnum | null;
  slType: TpSlTypeEnum | null;
  instrumentId: string;
  positionId: number;
}

const AutoClosePopupSideBar = forwardRef<HTMLDivElement, Props>(
  (
    {
      children,
      isDisabled,
      handleSumbitMethod,
      tpType,
      slType,
      instrumentId,
      positionId,
    },
    ref
  ) => {
    const { t } = useTranslation();

    const { SLTPstore, tradingViewStore, quotesStore } = useStores();

    const [on, toggle] = useState(false);
    const [isTop, setIsTop] = useState(true);

    const { handleSubmit, trigger, reset, watch } = useFormContext<
      FormValues
    >();

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
      SLTPstore.toggleCloseOpenPrice(false);
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
      if (rect && window.innerHeight - rect.top - 325 <= 0) {
        setIsTop(false);
      }
    };
    const values = watch();

    const handleClickOutside = useCallback(
      (e: any) => {
        SLTPstore.toggleCloseOpenPrice(false);
        if (wrapperRef.current && !wrapperRef.current.contains(e.target)) {
          reset({
            ...values,
          });
          toggle(false);
        }
      },
      [on],
    );

    useEffect(() => {
      if (on) {
        SLTPstore.setTpType(tpType ?? TpSlTypeEnum.Currency);
        SLTPstore.setSlType(slType ?? TpSlTypeEnum.Currency);
        SLTPstore.setInstrumentId(instrumentId);
      }
    }, [on, tpType, slType]);

    useEffect(() => {
      SLTPstore.toggleCloseOpenPrice(true);
    }, []);

    useEffect(() => {
      if (on) {
        document.addEventListener('mousedown', handleClickOutside);
      } else {
        document.removeEventListener('mousedown', handleClickOutside);
      }
      return () => {
        document.removeEventListener('mousedown', handleClickOutside);
      };
    }, [on]);
    
    const submitForm = async () => {
      SLTPstore.toggleCloseOpenPrice(false);
      try {
        const isValid = await trigger();
        if (isValid) {
          await handleSubmit(handleSumbitMethod)();
          toggle(false);
        }
      } catch (error) {}
    };

    useEffect(() => {
      const disposer = autorun(() => {
        if (
          tradingViewStore.activePopup &&
          quotesStore.selectedPositionId === positionId
        ) {
          toggle(true);
        }
      });
      return disposer;
    }, []);

    return (
      <FlexContainer ref={wrapperRef}>
        <ButtonWithoutStyles type="button" onClick={handleToggle}>
          {children}
        </ButtonWithoutStyles>
        {on && (
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
          >
            <SetAutoclose isDisabled={isDisabled} toggle={toggle} isActive={on}>
              <ButtonApply
                type="button"
                disabled={isDisabled}
                onClick={submitForm}
              >
                {t('Apply')}
              </ButtonApply>
            </SetAutoclose>
          </FlexContainer>
        )}
      </FlexContainer>
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

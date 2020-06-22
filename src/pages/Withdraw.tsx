import React, { useEffect, useState, useCallback } from 'react';
import { FlexContainer } from '../styles/FlexContainer';
import AccountSettingsContainer from '../containers/AccountSettingsContainer';
import { PrimaryTextSpan, PrimaryTextParagraph } from '../styles/TextsElements';
import * as yup from 'yup';
import API from '../helpers/API';
import { useStores } from '../hooks/useStores';
import styled from '@emotion/styled';
import SvgIcon from '../components/SvgIcon';
import BadRequestPopup from '../components/BadRequestPopup';
import { Observer } from 'mobx-react-lite';
import { ButtonWithoutStyles } from '../styles/ButtonWithoutStyles';
import IconClose from '../assets/svg/icon-popup-close.svg';
import { useHistory } from 'react-router-dom';
import LoaderForComponents from '../components/LoaderForComponents';
import { useFormik } from 'formik';
import Fields from '../constants/fields';
import validationInputTexts from '../constants/validationInputTexts';
import { PrimaryButton, SecondaryButton } from '../styles/Buttons';
import ErropPopup from '../components/ErropPopup';
import { OperationApiResponseCodes } from '../enums/OperationApiResponseCodes';
import NotificationPopup from '../components/NotificationPopup';
import Page from '../constants/Pages';




import { TableGrid, DisplayContents, Td } from '../styles/TableElements';
import WithdrawRequestTab from '../components/Withdraw/WithdrawRequestTab';


function AccountSecurity() {
  const {
    mainAppStore,
    depositFundsStore,
    badRequestPopupStore,
    notificationStore,
  } = useStores();
  const { push } = useHistory();
  const [isLoading, setIsLoading] = useState(false);
  const [activeTab, setActiveTab] = useState(0);

  

  useEffect(() => {
    document.title = 'Account withdraw';
  }, []);

  return (
    <AccountSettingsContainer>
      <FlexContainer
        position="absolute"
        bottom="100px"
        left="14px"
        zIndex="100"
      >
        <Observer>
          {() => (
            <NotificationPopup
              show={notificationStore.isActiveNotification}
            ></NotificationPopup>
          )}
        </Observer>
      </FlexContainer>

      <IconButton onClick={() => push(Page.DASHBOARD)}>
        <SvgIcon
          {...IconClose}
          fillColor="rgba(255, 255, 255, 0.6)"
          hoverFillColor="#00FFDD"
        ></SvgIcon>
      </IconButton>
      <Observer>
        {() => <>{badRequestPopupStore.isActive && <BadRequestPopup />}</>}
      </Observer>

      <Observer>
        {() => (
          <LoaderForComponents
            isLoading={isLoading}
            backgroundColor="#252637"
          />
        )}
      </Observer>
      <FlexContainer flexDirection="column" width="708px" margin="0 0 0 80px">
        <PrimaryTextSpan
          color="#FFFCCC"
          fontSize="24px"
          fontWeight="bold"
          marginBottom="40px"
        >
          Withdraw
        </PrimaryTextSpan>

        <FlexContainer marginBottom="46px">
          <TabControllsWraper alignItems="flex-start" justifyContent="center">
            <TabControllItem
              onClick={() => {
                setActiveTab(0);
              }}
              active={activeTab === 0}
            >
              Request
            </TabControllItem>
            <TabControllItem
              onClick={() => {
                setActiveTab(1);
              }}
              active={activeTab === 1}
            >
              History
            </TabControllItem>
          </TabControllsWraper>
        </FlexContainer>

        {activeTab === 0 && <WithdrawRequestTab />}

        {activeTab === 1 && (
          <FlexContainer flexDirection="column" justifyContent="center">
            <TableGrid columnsCount={9} maxHeight="calc(100vh - 235px)">
              <DisplayContents>
                <Td>
                  <FlexContainer alignItems="center">
                    <PrimaryTextSpan
                      fontSize="12px"
                      color="#FFFCCC"
                      whiteSpace="nowrap"
                      fontWeight="bold"
                    >
                      Bank cards (** 7556)
                    </PrimaryTextSpan>
                  </FlexContainer>
                </Td>
                <Td>
                  <FlexContainer alignItems="center">
                    <PrimaryTextSpan
                      fontSize="12px"
                      color="rgba(255,255,255,0.4)"
                      whiteSpace="nowrap"
                    >
                      06 Dec 2019, 13:10
                    </PrimaryTextSpan>
                  </FlexContainer>
                </Td>
                <Td>
                  <FlexContainer alignItems="center">
                    <PrimaryTextSpan
                      fontSize="12px"
                      color="#FFFCCC"
                      whiteSpace="nowrap"
                    >
                      $5.00
                    </PrimaryTextSpan>
                  </FlexContainer>
                </Td>
                <Td>
                  <FlexContainer alignItems="center">
                    <PrimaryTextSpan
                      fontSize="12px"
                      color="#FFFCCC"
                      whiteSpace="nowrap"
                    >
                      Pending
                    </PrimaryTextSpan>
                  </FlexContainer>
                </Td>
                <Td>
                  <FlexContainer alignItems="center">
                    <PrimaryTextSpan
                      fontSize="12px"
                      color="#FFFCCC"
                      whiteSpace="nowrap"
                    >
                      Cancel
                    </PrimaryTextSpan>
                  </FlexContainer>
                </Td>
              </DisplayContents>
            </TableGrid>
          </FlexContainer>
        )}
      </FlexContainer>
    </AccountSettingsContainer>
  );
}
export default AccountSecurity;


const IconButton = styled(ButtonWithoutStyles)`
  margin-right: 8px;
  position: absolute;
  top: 10px;
  right: 10px;
  z-index: 1;
  &:last-of-type {
    margin-right: 0;
  }
`;

const TabControllsWraper = styled(FlexContainer)`
  width: 100%;
`;

const TabControllItem = styled(ButtonWithoutStyles)<{ active: boolean }>`
  width: 50%;
  color: ${props => (props.active ? '#fffccc' : '#979797')};
  font-weight: 500;
  font-size: 12px;
  line-height: 16px;
  display: flex;
  align-items: center;
  justify-content: center;
  letter-spacing: 0.03em;
  text-transform: uppercase;
  padding: 16px;
  position: relative;

  &:after {
    content: '';
    display: block;
    width: 100%;
    height: ${props => (props.active ? '2px' : '1px')};
    background: ${props => (props.active ? '#FFFCCC' : '#46484d')};
    position: absolute;
    bottom: 0;
    left: 0;
    right: 0;
    z-index: 1;
    transition: all 0.2s ease;
  }

  &:hover {
    &:after {
      background: rgba(255, 252, 204, 0.48);
    }
  }
`;

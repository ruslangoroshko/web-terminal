import React from 'react';
import { render, fireEvent, waitFor, cleanup } from '@testing-library/react';
import testIds from '../constants/testIds';
import BitcoinForm from '../components/DepositPopup/BitcoinForm';
import NotificationPopup from '../components/NotificationPopup';
import axios from 'axios';
import { DepositApiResponseCodes } from '../enums/DepositApiResponseCodes';
import { act } from 'react-dom/test-utils';
import { decorate, observable } from 'mobx';

jest.mock('react-router-dom', () => ({
  useHistory: () => ({
    push: jest.fn(),
  }),
}));

jest.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: jest.fn(),
  }),
}));

jest.mock('mixpanel-browser', () => ({
  init: jest.fn(),
  track: jest.fn(),
}));

jest.mock('axios');

describe('fetchData', () => {
  it('fetches successfully data from an API', async () => {
    // @ts-ignore
    axios.get.mockImplementationOnce(() =>
      Promise.resolve({
        status: DepositApiResponseCodes.Success,
        walletAddress: 'testwalletstring',
      })
    );
  });
});

jest.mock('axios');

class NotificationStore {
  notificationMessage = '';

  resetNotification = () => {

  }

  
}

const DecoratedNotificationStore = decorate(new NotificationStore(), {
  notificationMessage: observable,
});

jest.mock('../hooks/useStores', () => ({
  useStores: () => ({
    notificationStore: jest.fn(() => DecoratedNotificationStore),
  }),
}));

test('Check that user received the notification after coping BTC adress', async () => {
  await act(async () => {
    const bitcoinFormRenderer = render(<BitcoinForm />);
    const notificationPopupRenderer = render(<NotificationPopup show={true} />);

    await waitFor(async () => {
      fireEvent.click(
        bitcoinFormRenderer.getByTestId(testIds.BITCOIN_COPY_BUTTON)
      );

      expect(
        notificationPopupRenderer.getByTestId(
          testIds.NOTIFICATION_POPUP_MESSAGE
        ).textContent
      ).toEqual('Copied to clipboard');
    });
  });
});

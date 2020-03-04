import React, { useState, useEffect, FC } from 'react';
import { HubConnection } from '@aspnet/signalr';
import Axios from 'axios';
import initConnection from '../services/websocketService';
import Topics from '../constants/websocketTopics';
import { FlexContainer } from '../styles/FlexContainer';
import MobileChartContainer from '../containers/MobileChartContainer';

const MobileTradingView: FC = () => {
  const [activeSession, setActiveSession] = useState<HubConnection>();

  const authenticate = async () => {
    const response = await Axios.post(
      `${API_AUTH_STRING}/api/v1/Trader/Authenticate`,
      {
        email: 'shadi.ganem@simplbit.com',
        password: '123123123',
      }
    );
    return response.data;
  };

  const initWebsocketConnection = async (token: string) => {
    const connection = initConnection(WS_HOST);
    await connection.start();
    setActiveSession(connection);
    try {
      await connection.send(Topics.INIT, token);
    } catch (error) {}
  };

  useEffect(() => {
    authenticate().then(({ data }) => {
      Axios.defaults.headers['Authorization'] = data.token;
      initWebsocketConnection(data.token);
    });
  }, []);

  return (
    <FlexContainer height="100vh" width="100vw">
      <FlexContainer width="100%">
        {activeSession && (
          <MobileChartContainer
            activeSession={activeSession}
            instrumentId="EURUSD"
          ></MobileChartContainer>
        )}
      </FlexContainer>
    </FlexContainer>
  );
};

export default MobileTradingView;

import * as signalR from '@aspnet/signalr';

const initConnection = (connectionString: string, token: string) => {
  const connection = new signalR.HubConnectionBuilder()
    .withUrl(connectionString, {
      accessTokenFactory: () => token,
    })
    .build();
  return connection;
};

export default initConnection;

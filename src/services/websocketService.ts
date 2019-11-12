import * as signalR from '@aspnet/signalr';

const initConnection = (connectionString: string) => {
  const connection = new signalR.HubConnectionBuilder()
    .withUrl(connectionString)
    .build();
  connection.start().catch(err => console.log(err));
  return connection;
};

export default initConnection;

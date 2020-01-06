import * as signalR from '@aspnet/signalr';
import { MessagePackHubProtocol } from '@aspnet/signalr-protocol-msgpack';

const initConnection = (connectionString: string) => {
  const connection = new signalR.HubConnectionBuilder()
    .withUrl(connectionString)
    .withHubProtocol(
      IS_LIVE ? new MessagePackHubProtocol() : new signalR.JsonHubProtocol()
    )
    .build();
  return connection;
};

export default initConnection;

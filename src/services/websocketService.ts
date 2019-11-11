// import autobahn from 'autobahn';
import * as signalR from '@aspnet/signalr';

// const initConnection = (connectionString: string, realm: string) =>
//   new Promise<autobahn.Session>(resolve => {
//     const connection = new autobahn.Connection({
//       url: connectionString,
//       realm,
//     });
//     connection.onopen = (session: autobahn.Session) => {
//       resolve(session);
//     };
//     connection.open();
//   });

// export const initConnection = (connectionString: string, realm: string) => {
//   const session = new wampy(connectionString, {
//     realm,
//   });
//   session.subscribe('EUR/USD', args => {
//     console.log(args);
//   });
//   return session;
// };

const initConnection = (connectionString: string) => {
  const connection = new signalR.HubConnectionBuilder()
    .withUrl(connectionString)
    .build();
  return connection;
};

export default initConnection;

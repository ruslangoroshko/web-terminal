import autobahn from 'autobahn';

const initConnection = (connectionString: string, realm: string) =>
  new Promise<autobahn.Session>(resolve => {
    const connection = new autobahn.Connection({
      url: connectionString,
      realm,
    });
    connection.onopen = (session: autobahn.Session) => {
      resolve(session);
    };
    connection.open();
  });

export default initConnection;

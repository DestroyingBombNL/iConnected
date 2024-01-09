import { IEnvironment } from './environment.interface';

export const backendEnvironment: IEnvironment = {
  production: true,
  neo4j: {
    username: 'neo4j',
    password: 'MANkOd3pIEo8J3q6LchHkWRhFFbTTKYix4hx8JzBQ7E',
    scheme: 'neo4j+s',
    host: '07b40077.databases.neo4j.io',
    database: 'neo4j',
    port: 7687
  }
};

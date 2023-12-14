import { IEnvironment } from './environment.interface';

export const environment: IEnvironment = {
  production: true,
  backendUrl: 'https://iconnected.azurewebsites.net',
  neo4j: {
    username: 'neo4j',
    password: '',
    scheme: 'neo4j',
    host: '07b40077.databases.neo4j.io',
    database: 'iHomer',
    port: 7687
  }
};


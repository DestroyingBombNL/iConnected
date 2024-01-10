import { IEnvironment } from './environment.interface';

export const backendEnvironment: IEnvironment = {
  production: true,
  neo4j: {
    username: 'neo4j',
    password: process.env.GRAPH_PASSWORD,
    scheme: 'neo4j+s',
    host: '07b40077.databases.neo4j.io',
    database: 'neo4j',
    port: 7687
  }
};

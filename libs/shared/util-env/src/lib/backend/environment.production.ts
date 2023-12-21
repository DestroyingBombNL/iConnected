import { IEnvironment } from './environment.interface';
// import * as dotenv from 'dotenv';

// dotenv.config();

export const backendEnvironment: IEnvironment = {
  production: true,
  neo4j: {
    username: 'neo4j',
    password: process.env["GRAPH_PASSWORD"] ?? "",
    scheme: 'neo4j',
    host: '07b40077.databases.neo4j.io',
    database: 'iHomer',
    port: 7687
  }
};

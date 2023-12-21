import { IEnvironment } from './environment.interface';
// import * as dotenv from 'dotenv';

// dotenv.config();

export const backendEnvironment: IEnvironment = {
  production: false,
  neo4j: {
    username: 'neo4j',
    password: process.env["GRAPH_PASSWORD"] ?? "",
    scheme: 'neo4j',
    host: 'localhost',
    database: 'iHomer',
    port: 7687,
  },
};

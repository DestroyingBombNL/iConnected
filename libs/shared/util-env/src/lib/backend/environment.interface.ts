export interface IEnvironment {
  production: boolean;
  neo4j: {
    username: string;
    password: string;
    scheme: string;
    host: string;
    port: number;
    database: string;
  };
}

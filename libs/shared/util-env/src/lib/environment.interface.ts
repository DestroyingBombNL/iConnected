export interface IEnvironment {
  production: boolean;
  backendUrl: string;
  neo4j: {
    username: string;
    password: string;
    scheme: string;
    host: string;
    port: number;
    database: string;
  };
}

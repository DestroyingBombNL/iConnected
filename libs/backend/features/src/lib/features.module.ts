import { Module } from '@nestjs/common';
import { UserModule } from './user/user.module';
import { environment } from '@ihomer/shared/util-env';
import { Neo4jModule, Neo4jScheme } from "nest-neo4j/dist";

@Module({
  imports: [
    UserModule, 
    Neo4jModule.forRoot({
        scheme: environment.neo4j.scheme as Neo4jScheme,
        host: environment.neo4j.host,
        password: environment.neo4j.password,
        username: environment.neo4j.username,
        database: environment.neo4j.database,
        port: environment.neo4j.port
    })
  ],
  controllers: [],
  providers: [],
  exports: [],
})
export class FeaturesModule {}

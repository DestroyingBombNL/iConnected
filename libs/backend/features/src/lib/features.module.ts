import { Module } from '@nestjs/common';
import { UserModule } from './user/user.module';
import { backendEnvironment } from '@ihomer/shared/util-env';
import { Neo4jModule, Neo4jScheme } from "nest-neo4j/dist";
import { ConfigModule } from "@nestjs/config";
import { BlobModule } from './blob/blob.module';
import { BendeModule } from './bende/bende.module';
import { ProjectModule } from './project/project.module';
import { AuthModule } from './auth/auth.module';

@Module({
  imports: [
    AuthModule,
    UserModule,
    BlobModule,
    BendeModule,
    ProjectModule,
    Neo4jModule.forRoot({
        scheme: backendEnvironment.neo4j.scheme as Neo4jScheme,
        host: backendEnvironment.neo4j.host,
        password: backendEnvironment.neo4j.password,
        username: backendEnvironment.neo4j.username,
        database: backendEnvironment.neo4j.database,
        port: backendEnvironment.neo4j.port
    }),
    ConfigModule
  ],
  controllers: [],
  providers: [],
  exports: [],
})
export class FeaturesModule {}

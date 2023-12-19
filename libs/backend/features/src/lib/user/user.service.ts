import { Injectable } from "@nestjs/common";
import { Neo4jService } from "nest-neo4j/dist";

@Injectable()
export class UserService {
    TAG = 'UserService';
    
    constructor(private readonly neo4jService: Neo4jService) {}

    create(): void {
        // this.neo4jService.write('')
    }
}
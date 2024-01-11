import { Injectable, Logger } from "@nestjs/common";
import { QueryResult, RecordShape } from "neo4j-driver";
import { Neo4jService } from "nest-neo4j/dist";

@Injectable()
export class FilterService {
    private readonly logger: Logger = new Logger(FilterService.name)
    
    constructor(private readonly neo4jService: Neo4jService) {}

    async filter(param: string | undefined): Promise<string[] | undefined> {
        this.logger.log('filter');
    
        const readQuery = `
        MATCH (user:User)-[r]->(entity)
        WHERE 
        (
            toLower(toString(user.bio)) CONTAINS $param OR
            toLower(toString(user.birthday)) CONTAINS $param OR
            toLower(toString(user.city)) CONTAINS $param OR
            toLower(toString(user.color)) = $param OR
            toLower(toString(user.email)) CONTAINS $param OR
            toLower(toString(user.firstName)) CONTAINS $param OR
            toLower(toString(user.infix)) CONTAINS $param OR
            toLower(toString(user.lastName)) CONTAINS $param OR
            ANY(tag IN user.tags WHERE toLower(toString(tag)) = $param) OR
            toLower(type(r)) CONTAINS $param
        )
        OR
        (
            toLower(toString(entity.creationDate)) CONTAINS $param OR
            toLower(toString(entity.mandate)) = $param OR
            toLower(toString(entity.name)) CONTAINS $param OR
            toLower(toString(entity.slack)) CONTAINS $param OR
            toLower(toString(entity.type)) = $param
        )
        RETURN DISTINCT user.uuid`;
        if (!param) {
            param = '_';
        }
        param = param.toLowerCase();
        const result = await this.neo4jService.read(readQuery, { param });
        const ids = this.convertFromDB(result);
        if (!ids) return undefined;
        return ids;    
    }
    
    private convertFromDB(result: QueryResult<RecordShape>): string[] | undefined {
        const filteredEntities: string[] = result.records.map((record: any) => {
            return record._fields[0];
        }).flat();
        return filteredEntities;
    }    
}
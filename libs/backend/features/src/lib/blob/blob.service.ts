import { IBlob, IUser } from "@ihomer/api";
import { Injectable } from "@nestjs/common";
import { Neo4jService } from "nest-neo4j/dist";

@Injectable()
export class BlobService {
    TAG = 'BlobService';
    
    constructor(private readonly neo4jService: Neo4jService) {}

    createBlob(blob: IBlob, user: IUser) {
        /*
        let write = `MERGE(blob:Blob {name: $name, 
            creationDate: $creationDate, 
            slackChannel: $slackChannel, 
            mandate: $mandate, 
            image: $image, 
            type: $type})`;
        
        const params = {
            name: blob.name,
            creationDate: blob.creationDate,
            slackChannel: blob.slackChannel,
            mandate: blob.mandate,
            image: blob.image,
            type: blob.type
        };
        
        for (let i = 0; i < blob.userIds.length; i++) {
            write += ` MATCH (user${i}:User) WHERE ID(user${i}) = $userId${i} 
            MERGE (user${i})-[:BELONGS_TO]->(blob)`;
        
            params[`userId${i}`] = blob.userIds[i];
        }
        
        write += ` RETURN(blob)`;
        
        this.neo4jService.write(write, params);*/
        
    }
}
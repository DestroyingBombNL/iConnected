import { IBlob, IUser } from "@ihomer/api";
import { Injectable, Logger } from "@nestjs/common";
import { QueryResult, RecordShape } from "neo4j-driver";
import { Neo4jService } from "nest-neo4j/dist";

@Injectable()
export class BlobService {
    private readonly logger: Logger = new Logger(BlobService.name)
    
    constructor(private readonly neo4jService: Neo4jService) {}

    async getAll(): Promise<IBlob[] | undefined> {
        this.logger.log('getAll');
        const readQuery = `
        MATCH (blob:Blob)-[]-(user:User)
        WITH blob, COLLECT(user) as users, COLLECT(user.firstName) AS firstNames
        RETURN blob, users ORDER BY firstNames ASC`;
        const result = await this.neo4jService.read(readQuery);
        const blobs = this.convertFromDB(result);
        if (!blobs) return undefined;
        return blobs;    
    }    

    async get(id: string): Promise<IBlob | undefined> {
        this.logger.log('get');
    
        const readQuery = `
            MATCH (blob:Blob)-[]-(user:User)
            WITH blob, COLLECT(user) as users, COLLECT(user.firstName) AS firstNames
            WHERE blob.uuid = $id
            RETURN blob, users ORDER BY firstNames ASC`;
        const result = await this.neo4jService.read(readQuery, { id });

        const blobs = this.convertFromDB(result);
        if (!blobs) return undefined;
        return blobs[0];    
    }
    
    async createBlob(blob: IBlob): Promise<IBlob | undefined> {
        this.logger.log('createBlob');
        const currentDate = this.formatDate(new Date());
        
        const writeQuery = `CREATE(blob:Blob {uuid: randomUUID(), name: $name,  creationDate: $creationDate, slack: $slack, mandate: $mandate, type: $type, image: $image})`;
        
        const params = {
            name: blob.name,
            creationDate: currentDate,
            slack: blob.slack,
            mandate: blob.mandate,
            image: blob.image,
            type: blob.type,
        };

        this.logger.log(params)
        const userWrites: string[] = [];

        for (let i = 0; i < blob.users.length; i++) {
            const userKey = `userId${i}`;
            userWrites.push(
                `WITH blob
                MATCH (user${i}:User {uuid: $${userKey}})
                CREATE (user${i})-[:BELONGS_TO]->(blob)` 
            );
            params[userKey] = blob.users[i].id;
        }
        const write = `${writeQuery} ${userWrites.join(' ')} WITH blob RETURN blob`;
        await this.neo4jService.write(write, params);
    
        const readQuery = `
            MATCH (blob:Blob)
            WHERE blob.name = $name
            RETURN blob`;
        const readResult = await this.neo4jService.read(readQuery, params);
        const uuid = await readResult.records[0].get('blob').properties.uuid;
        return this.get(uuid);
    }
    
    async updateBlob(blob: IBlob, id: string): Promise<IBlob | undefined> {
        this.logger.log('updateBlob');
        
        const params: { [key: string]: any } = { id };
        let setClause = 'SET ';
    
        // Construct the SET clause dynamically based on the properties in the 'blob' object
        Object.keys(blob).forEach((key, index) => {
            if (key !== 'id' && key !== 'users') { // Exclude 'id' and 'users' properties
                setClause += `blob.${key} = $${key}`;
    
                // Add the property to the parameters
                params[key] = blob[key];
    
                if (index < Object.keys(blob).length - 1) {
                    setClause += ', ';
                }
            }
        });
    
        const updateQuery = `
            MATCH (blob:Blob)
            WHERE blob.uuid = $id
            ${setClause} 
            RETURN blob`;
    
        const updateResult = await this.neo4jService.write(updateQuery, params);
    
        if (updateResult.records.length > 0) {
            const updatedBlobId = updateResult.records[0].get('blob').properties.uuid;
    
            const updatedBlob = await this.get(updatedBlobId);
    
            if (updatedBlob) {
                return updatedBlob;
            }
        }
        return undefined;
    }    
    
    async deleteBlob(id: string): Promise<boolean> {
        this.logger.log('deleteBlob');
    
        const params = { id };
    
        const checkQuery = `
            MATCH (blob:Blob {uuid: $id})-[:BELONGS_TO]-(user:User)
            RETURN count(user) AS userCount`;
    
        const checkResult = await this.neo4jService.read(checkQuery, params);
        const userCount = checkResult.records[0].get('userCount').toNumber();
    
        if (userCount > 0) {
            const deleteQuery = `
                MATCH (blob:Blob {uuid: $id})
                DETACH DELETE blob`;
    
            await this.neo4jService.write(deleteQuery, params);
    
            return true;
        } else {
            return false;
        }
    }
    
    private convertFromDB(result: QueryResult<RecordShape>): IBlob[] | undefined {
        const createdBlobs = result.records.map((record: any) => {
            const blobData = record.get('blob');
            const users = record.get('users');
            const blob: IBlob = {
                id: blobData.properties.uuid,
                name: blobData.properties.name,
                creationDate: new Date(blobData.properties.creationDate),
                slack: blobData.properties.slack,
                mandate: blobData.properties.mandate,
                image: blobData.properties.image,
                type: blobData.properties.type,
                users: [],
                gradient: ["#b9adad", "#b9adad"]
            };
    
            for (let i = 0; i < users.length; i++) {
                const user: IUser = {
                    firstName: users[i].properties.firstName,
                    profilePicture: users[i].properties.profilePicture,
                    id: users[i].properties.uuid,
                    email: users[i].properties.email,
                    infix: users[i].properties.infix,
                    lastName: users[i].properties.lastName,
                    bio: users[i].properties.bio,
                    birthday: users[i].properties.birthDay,
                    street: users[i].properties.street,
                    houseNumber: users[i].properties.houseNumber,
                    postalCode: users[i].properties.postalCode,
                    city: users[i].properties.city,
                    tags: users[i].properties.tags,
                    password: users[i].properties.password,
                    opacity: 1,
                    border: "0px"
                };
                blob.users.push(user);
            }
            return blob;
        });
        return createdBlobs;
    }

    async getDistinctTypesForAllBlobs(): Promise<string[]> {
        this.logger.log('getDistinctTypesForAllBlobs');
    
        const readQuery = `
            MATCH (blob:Blob)
            RETURN DISTINCT blob.type AS type`;
        const result = await this.neo4jService.read(readQuery);
    
        const types = result.records.map((record: any) => {
            return record.get('type');
        });
        return types;
    }

    formatDate(date: Date): string {
        const year = date.getFullYear();
        const month = ('0' + (date.getMonth() + 1)).slice(-2); // Adding 1 because months are zero-indexed
        const day = ('0' + date.getDate()).slice(-2);
    
        return `${year}-${month}-${day}`;
    }
}
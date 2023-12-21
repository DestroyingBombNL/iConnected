import { IBlob, IUser } from "@ihomer/api";
import { Injectable, Logger } from "@nestjs/common";
import { Neo4jService } from "nest-neo4j/dist";

@Injectable()
export class BlobService {
    private readonly logger: Logger = new Logger(BlobService.name)
    
    constructor(private readonly neo4jService: Neo4jService) {}

    async getAll(): Promise<IBlob[]> {
        this.logger.log('getAll');
    
        const readQuery = `
            MATCH (blob:Blob)-[]-(user:User)
            WITH blob, COLLECT(user) as users, COLLECT(user.firstName) AS firstNames
            RETURN blob, users ORDER BY firstNames ASC`;
    
        const result = await this.neo4jService.read(readQuery);
    
        // Map the QueryResult to IBlob[]
        const blobs: IBlob[] = result.records.map((record) => {
            const blobData: any = record.get('blob');
            const users: any = record.get('users');

            const blob: IBlob = {
                id: blobData.properties.uuid,
                name: blobData.properties.name,
                creationDate: blobData.properties.creationDate,
                slack: blobData.properties.slack,
                mandate: blobData.properties.mandate,
                image: blobData.properties.image,
                type: blobData.properties.type,
                users: []
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
                    birthDay: users[i].properties.birthDay,
                    street: users[i].properties.street,
                    houseNumber: users[i].properties.houseNumber,
                    postalCode: users[i].properties.postalCode,
                    city: users[i].properties.city,
                    tags: users[i].properties.tags,
                    password: users[i].properties.password
                };
                blob.users.push(user);
            }
            return blob;
        });
        return blobs;
    }    

    async get(id: string): Promise<IBlob> {
        this.logger.log('get');
    
        const readQuery = `
            MATCH (blob:Blob)-[]-(user:User)
            WITH blob, COLLECT(user) as users, COLLECT(user.firstName) AS firstNames
            WHERE blob.uuid = $id
            RETURN blob, users ORDER BY firstNames ASC`;
    
        const result = await this.neo4jService.read(readQuery, { id });
    
        if (result.records.length > 0) {
            const record = result.records[0];
    
            const blobData: any = record.get('blob');
            const users: any = record.get('users');

            const blob: IBlob = {
                id: blobData.properties.uuid,
                name: blobData.properties.name,
                creationDate: blobData.properties.creationDate,
                slack: blobData.properties.slack,
                mandate: blobData.properties.mandate,
                image: blobData.properties.image,
                type: blobData.properties.type,
                users: []
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
                    birthDay: users[i].properties.birthDay,
                    street: users[i].properties.street,
                    houseNumber: users[i].properties.houseNumber,
                    postalCode: users[i].properties.postalCode,
                    city: users[i].properties.city,
                    tags: users[i].properties.tags,
                    password: users[i].properties.password
                };
                blob.users.push(user);
            }
            return blob;
        } else {
            throw new Error('Blob not found');
        }
    }
    
    async createBlob(blob: IBlob): Promise<IBlob> {
        this.logger.log('createBlob');
        
        const writeQuery = `
            CREATE(blob:Blob {
                uuid: randomUUID(),
                name: $name, 
                creationDate: $creationDate, 
                slack: $slack, 
                mandate: $mandate, 
                image: $image, 
                type: $type
            })`;
    
        const params = {
            name: blob.name,
            creationDate: blob.creationDate,
            slack: blob.slack,
            mandate: blob.mandate,
            image: blob.image,
            type: blob.type
        };
    
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
    
        const result = await this.neo4jService.write(write, params);
    
        if (result.records.length > 0) {
            const record = result.records[0];
            const blobId = record.get('blob')?.properties?.uuid;
    
            if (blobId) {
                return this.get(blobId);
            }
        }
    
        throw new Error("Blob creation failed or ID not retrieved");
    }
    
    async updateBlob(blob: IBlob, id: string): Promise<IBlob> {
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
    
        // Perform the update operation based on the dynamically built SET clause
        const updateResult = await this.neo4jService.write(updateQuery, params);
    
        if (updateResult.records.length > 0) {
            const updatedBlobId = updateResult.records[0].get('blob').properties.uuid;
    
            // Fetch the updated blob using its ID
            const updatedBlob = await this.get(updatedBlobId);
    
            if (updatedBlob) {
                return updatedBlob;
            }
        }
    
        throw new Error("Blob couldn't be updated or retrieved");
    }    
    
    async deleteBlob(id: string): Promise<boolean> {
        this.logger.log('deleteBlob');
    
        const params = { id };
    
        // Query to check if the blob exists and has connected users
        const checkQuery = `
            MATCH (blob:Blob {uuid: $id})-[:BELONGS_TO]-(user:User)
            RETURN count(user) AS userCount`;
    
        const checkResult = await this.neo4jService.read(checkQuery, params);
        const userCount = checkResult.records[0].get('userCount').toNumber();
    
        if (userCount > 0) {
            // If the blob has connected users, execute a separate write transaction to delete it
            const deleteQuery = `
                MATCH (blob:Blob {uuid: $id})
                DETACH DELETE blob`;
    
            await this.neo4jService.write(deleteQuery, params);
    
            return true; // Blob had matches and was deleted
        } else {
            return false; // No matches or no connected users
        }
    }     
     
}
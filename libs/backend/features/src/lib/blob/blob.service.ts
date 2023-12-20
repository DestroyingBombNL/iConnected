import { IBlob } from "@ihomer/api";
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
            WITH blob, COLLECT(user.image) AS profilePicture, COLLECT(user.name) AS name, COLLECT(user.uuid) AS id
            RETURN blob, profilePicture, name, id ORDER BY name ASC`;
    
        const result = await this.neo4jService.read(readQuery);
    
        // Map the QueryResult to IBlob[]
        const blobs: IBlob[] = result.records.map((record) => {
            const blobData: any = record.get('blob');
            const name: string[] = record.get('profilePicture');
            const profilePicture: string[] = record.get('name');
            const id: string[] = record.get('id');
            
            // Construct IBlob object using relevant fields from blobData and names
            const blob: IBlob = {
                id: blobData.id, // Assuming 'id' is the property name in 'blobData'
                name: blobData.name,
                creationDate: blobData.creationDate,
                slackChannel: blobData.slackChannel,
                mandate: blobData.mandate,
                image: blobData.image,
                type: blobData.type,
                users: []
                // ... Add other properties as needed
            };
            for (let i = 0; i < name.length; i++) {
                blob.users[i].firstName = name[i];
                blob.users[i].profilePicture = profilePicture[i];
                blob.users[i].id = id[i];
            }
            return blob;
        });
        return blobs;
    }    

    async get(id: string): Promise<IBlob> {
        this.logger.log('get');
    
        const readQuery = `
            MATCH (blob:Blob)-[]-(user:User)
            WITH blob, COLLECT(user.image) AS profilePicture, COLLECT(user.name) AS name, COLLECT(user.uuid) AS id
            WHERE blob.uuid = $id
            RETURN blob, profilePicture, name, id ORDER BY name ASC`;
    
        const result = await this.neo4jService.read(readQuery, { id });
        this.logger.log(readQuery);
        if (result.records.length > 0) {
            const returnBlob: IBlob = result.records.map((record) => { 
                const blobData: any = record.get('blob');
                const name: string[] = record.get('profilePicture');
                const profilePicture: string[] = record.get('name');
                const id: string[] = record.get('id');

                            // Construct IBlob object using relevant fields from blobData and names
                const blob: IBlob = {
                    id: blobData.id, // Assuming 'id' is the property name in 'blobData'
                    name: blobData.name,
                    creationDate: blobData.creationDate,
                    slackChannel: blobData.slackChannel,
                    mandate: blobData.mandate,
                    image: blobData.image,
                    type: blobData.type,
                    users: []
                };

                for (let i = 0; i < name.length; i++) {
                    blob.users[i].firstName = name[i];
                    blob.users[i].profilePicture = profilePicture[i];
                    blob.users[i].id = id[i];
                }
                return blob;
            })
            return returnBlob;
        } else {
            // If no blob found with the provided ID, handle this case accordingly
            throw new Error('Blob not found');
        }
    }    
    
    async createBlob(blob: IBlob): Promise<IBlob> {
        this.logger.log('createBlob');
        
        let write = `
            CREATE(blob:Blob {uuid: randomUUID(),
                name: $name, 
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
            const userKey = `userId${i}`;
            write += ` WITH blob 
                MATCH (user${i}:User {uuid: $${userKey}})
                CREATE (user${i})-[:BELONGS_TO]->(blob)`;
            params[userKey] = blob.userIds[i];
        }
    
        write += ` RETURN blob`;
    
        // Execute the write operation to create the blob
        await this.neo4jService.write(write, params);
    
        // Get more details about the created blob using its attributes
        const readQuery = `
            MATCH (blob:Blob)
            WHERE blob.name = $name
            RETURN blob`;
    
        const readParams = {
            name: blob.name
        };
    
        const result = await this.neo4jService.read(readQuery, readParams);
    
        if (result.records.length > 0) {
            const record = result.records[0];
            const blobProperties = record.get('blob')?.properties;
    
            if (blobProperties) {
                // Extract the relevant data and construct IBlob object
                const createdBlob: IBlob = {
                    id: blobProperties.uuid,
                    name: blobProperties.name,
                    creationDate: blobProperties.creationDate,
                    slackChannel: blobProperties.slackChannel,
                    mandate: blobProperties.mandate,
                    image: blobProperties.image,
                    type: blobProperties.type,
                    userIds: blob.userIds // Assuming userIds are already present in the input blob
                    // ... Add other properties as needed
                };
    
                // Log the properties of the blob
                this.logger.log(blobProperties);
    
                // Perform operations with 'createdBlob' as needed here
                // For instance, you can push 'createdBlob' to an array or process it further
    
                return createdBlob;
            }
        }
    
        throw new Error("Blob couldn't be created")
    }

    async updateBlob(blob: IBlob, id: string): Promise<IBlob> {
        this.logger.log('updateBlob');
        
        // Build SET clause dynamically based on the properties in the 'blob' object
        let setClause = 'SET ';
        const params = { id };
    
        Object.keys(blob).forEach((key, index) => {
            setClause += `blob.${key} = $${key}`;
            params[key] = blob[key];
    
            if (index < Object.keys(blob).length - 1) {
                setClause += ', ';
            }
        });
    
        // Perform the update operation based on the dynamically built SET clause
        this.logger.log(setClause);
        const updateQuery = `
            MATCH (blob:Blob)
            WHERE blob.uuid = $id
            ${setClause} 
            RETURN blob`;
    
        const updateResult = await this.neo4jService.write(updateQuery, params);
    
        // Get the updated blob details
        const readQuery = `
            MATCH (blob:Blob)
            WHERE blob.uuid = $id
            RETURN blob`;
    
        const readResult = await this.neo4jService.read(readQuery, { id });
    
        if (readResult.records.length > 0) {
            const record = readResult.records[0];
            const blobProperties = record.get('blob')?.properties;
    
            if (blobProperties) {
                // Extract the relevant data and construct IBlob object
                const updatedBlob: IBlob = {
                    id: blobProperties.uuid,
                    name: blobProperties.name,
                    creationDate: blobProperties.creationDate,
                    slackChannel: blobProperties.slackChannel,
                    mandate: blobProperties.mandate,
                    image: blobProperties.image,
                    type: blobProperties.type,
                    userIds: blob.userIds // Assuming userIds are already present in the input blob
                    // ... Add other properties as needed
                };
    
                return updatedBlob;
            }
        }
    
        throw new Error("Blob couldn't be updated")
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
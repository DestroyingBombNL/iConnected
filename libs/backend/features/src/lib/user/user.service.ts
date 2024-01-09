import { IBende, IBlob, ICreateUser, IProject, IUpdateUser, IUser } from "@ihomer/api";
import { Injectable, Logger } from "@nestjs/common";
import { QueryResult, RecordShape } from "neo4j-driver-core";
import { Neo4jService } from "nest-neo4j/dist";
import { sign } from "jsonwebtoken";

@Injectable()
export class UserService {
    private readonly logger: Logger = new Logger(UserService.name);
    
    constructor(private readonly neo4jService: Neo4jService) {}

    async create(user: ICreateUser): Promise<IUser | undefined> {
        this.logger.log('Create');

        const result = await this.neo4jService.write(
            'MERGE(user:User{uuid: randomUUID(), email: $email, profilePicture: $profilePicture, firstName: $firstName, infix: $infix, lastName: $lastName, bio: $bio, birthday: $birthday, street: $street, houseNumber: $houseNumber, postalCode: $postalCode, city: $city, tags: $tags, password: $password}) RETURN user',
            user
        );

        const users = this.convertFromDb(result);
        if (!users) return undefined;
        return users[0];
    }

    async read(id: string): Promise<IUser | undefined> {
        this.logger.log('Read');

        const result = await this.neo4jService.read(
            'MATCH(user:User{uuid: $id}) RETURN(user)',
            {id}
        );

        const users = this.convertFromDb(result);
        if (!users) return undefined;
        return users[0];
    }

    async getAll(): Promise<IUser[]> {
        this.logger.log('getAll');

        const result = await this.neo4jService.read(
            'MATCH(user:User) return user'
        );

        const users = this.convertFromDb(result);
        return users ?? [];
    }

    async delete(id: string): Promise<boolean> {
        this.logger.log('Delete');
        if (!id) return false;

        const result = await this.neo4jService.write(
            'MATCH(user:User{uuid:$id}) DETACH DELETE user RETURN COUNT(user) as deleted',
            { id }
        );

        const amountDeleted = result.records.map((record: any) => {
            const deletedCount = record._fields[0];
            return deletedCount;
        })[0];
        this.logger.log(`Deleted ${amountDeleted} user(s).`)
        return amountDeleted > 0;
    }

    async update(id: string, user: IUpdateUser): Promise<IUser | undefined> {
        this.logger.log('Update');

        const params = {
            id,
            email: user.email,
            profilePicture: user.profilePicture,
            firstName: user.firstName,
            infix: user.infix,
            lastName: user.lastName,
            bio: user.bio,
            birthday: user.birthday,
            street: user.street,
            houseNumber: user.houseNumber,
            postalCode: user.postalCode,
            city: user.city,
            tags: user.tags,
            password: user.password
        }

        const result = await this.neo4jService.write(
            'MATCH(user:User{uuid:$id}) SET user += {email: $email, profilePicture: $profilePicture, firstName: $firstName, infix: $infix, lastName: $lastName, bio: $bio, birthday: $birthday, street: $street, houseNumber: $houseNumber, postalCode: $postalCode, city: $city, tags: $tags, password: $password} RETURN user',
            params
        );
        const users = this.convertFromDb(result);
        if (!users) return undefined;
        return users[0];
    }

    async getPassword(email: string): Promise<string | undefined> {
        Logger.log('getPassword');

        const result = await this.neo4jService.read(
            'MATCH(user:User{email:$email}) RETURN user.password AS password, user.email as email',
            {email}
        );
        const password = result.records.map((record: any) => {
            const password = record._fields[0];
            return password;
        })[0];
        return password;
    }

    async login(email: string, password: string): Promise<IUser | undefined> {
        this.logger.log('Login');

        const result = await this.neo4jService.read(
            'MATCH(user:User{email: $email, password: $password}) RETURN(user)',
            {email, password}
        );

        const users = this.convertFromDb(result);
        if (!users) return undefined;
        const authenticationHex = process.env["AUTHENTICATION_HEX"];

        if (authenticationHex) {
            const secretKey = authenticationHex;
            const userId = users[0].id.toString();
            const token = sign({ userId }, secretKey, {
                expiresIn: '1h',
            });
            users[0].token = token;
        } else {
            console.error("AUTHENTICATION_HEX is not defined or empty in the environment variables.");
        }
        return users[0];
      }

      async profile(id: string): Promise<{ user: IUser | undefined, blobs: Array<IBlob>, bendes: Array<IBende>, projects: Array<IProject> }> {
        this.logger.log('Profile');
        
        const result = await this.neo4jService.read(
            'MATCH (user:User{uuid: $id})-[]-(connectedNode) RETURN user, connectedNode',
            { id }
        );
    
        let blobs: Array<IBlob> = [];
        let bendes: Array<IBende> = [];
        let projects: Array<IProject> = [];
        let users = this.convertFromDb(result);

        if (!users || users.length === 0) {
            return { user: undefined, blobs, bendes, projects };
        }

        result.records.forEach((record: any) => {
            let connectedNode = record.get('connectedNode');
            switch (connectedNode.labels[0]) {
                case 'Blob':
                    blobs.push(connectedNode.properties);
                    break;
                case 'Bende':
                    bendes.push(connectedNode.properties);
                    break;
                case 'Project':
                    projects.push(connectedNode.properties);
                    break;
            }
        });
        return { user: users[0], blobs, bendes, projects };
    }
    

      private convertFromDb(result: QueryResult<RecordShape>, includePassword?: boolean): IUser[] | undefined {
        const createdUsers = result.records.map((record: any) => {
            const userData = record._fields[0];
            const user: IUser = {
                id: userData.properties.uuid,
                email: userData.properties.email,
                profilePicture: userData.properties.profilePicture,
                firstName: userData.properties.firstName,
                infix: userData.properties.infix,
                lastName: userData.properties.lastName,
                bio: userData.properties.bio,
                birthday: userData.properties.birthday,
                street: userData.properties.street,
                houseNumber: userData.properties.houseNumber,
                postalCode: userData.properties.postalCode,
                city: userData.properties.city,
                tags: userData.properties.tags,
                password: userData.properties.password
            }
            if (!includePassword) user.password = '';
            return user;
        });
        return createdUsers as IUser[];
    }

    private parseDateString(dateString: string): Date {
        if (dateString) {
            const parts = dateString.split('-');
            if (parts.length === 3) {
                const year = parseInt(parts[2], 10);
                const month = parseInt(parts[1], 10) - 1;
                const day = parseInt(parts[0], 10);
                this.logger.log(new Date(year, month, day));
                return new Date(year, month, day);
            }
        }
        return new Date();
    }

    async getDistinctTagsForAllUsers(): Promise<string[]> {
        this.logger.log('Tags');

        const result = await this.neo4jService.read(
          'MATCH (user:User) UNWIND user.tags AS tag RETURN DISTINCT tag'
        );
        
        const distinctTags = result.records.map((record: any) => record.get('tag'));
        return distinctTags;
    }
}
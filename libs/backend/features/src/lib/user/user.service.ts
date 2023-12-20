import { ICreateUser, IUpdateUser, IUser } from "@ihomer/api";
import { Injectable, Logger } from "@nestjs/common";
import { Neo4jService } from "nest-neo4j/dist";

@Injectable()
export class UserService {
    private readonly logger: Logger = new Logger(UserService.name);
    
    constructor(private readonly neo4jService: Neo4jService) {}

    async create(user: ICreateUser): Promise<IUser | undefined> {
        this.logger.log('Create');

        const result = await this.neo4jService.write(
            'MERGE(user:User{uuid: randomUUID(), email: $email, profilePicture: $profilePicture, firstName: $firstName, infix: $infix, lastName: $lastName, bio: $bio, birthDate: $birthDay, street: $street, houseNumber: $houseNumber, postalCode: $postalCode, city: $city, tags: $tags, password: $password}) RETURN user',
            user
        );
        
        // ONLY FOR TESTING.
        this.getPassword(user.email!);

        return this.convertFromDb(result);
    }

    async read(id: string): Promise<IUser | undefined> {
        this.logger.log('Read');

        const result = await this.neo4jService.read(
            'MATCH(user:User{uuid: $id}) RETURN(user)',
            {id}
        );

        return this.convertFromDb(result);
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
            birthDay: user.birthDay,
            street: user.street,
            houseNumber: user.houseNumber,
            postalCode: user.postalCode,
            city: user.city,
            tags: user.tags,
            password: user.password
        }

        const result = await this.neo4jService.write(
            'MATCH(user:User{uuid:$id}) SET user += {email: $email, profilePicture: $profilePicture, firstName: $firstName, infix: $infix, lastName: $lastName, bio: $bio, birthDate: $birthDay, street: $street, houseNumber: $houseNumber, postalCode: $postalCode, city: $city, tags: $tags, password: $password} RETURN user',
            params
        );
        return this.convertFromDb(result);
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

    private convertFromDb(result: any): IUser | undefined {
        const createdUsers = result.records.map((record: any) => {
            const fields = record._fields[0];
            const dbUser = fields.properties;
            const {uuid, ...user} = dbUser;
            user.id = uuid;
            return user;
        });
        return createdUsers[0] as IUser;
    }
}
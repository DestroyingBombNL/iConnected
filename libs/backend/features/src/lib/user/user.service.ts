import { IUser } from "@ihomer/api";
import { Injectable, Logger } from "@nestjs/common";
import { Neo4jService } from "nest-neo4j/dist";

@Injectable()
export class UserService {
    private readonly logger: Logger = new Logger(UserService.name);
    
    constructor(private readonly neo4jService: Neo4jService) {}

    async create(user: IUser): Promise<IUser | undefined> {
        this.logger.log('Create');
        const result = await this.neo4jService.write(
            'MERGE(user:User{email: $email, profilePicture: $profilePicture, firstName: $firstName, infix: $infix, lastName: $lastName, bio: $bio, birthDate: $birthDay, street: $street, houseNumber: $houseNumber, postalCode: $postalCode, city: $city, tags: $tags, password: $password}) RETURN user, ID(user) AS userId',
            user
        );
        
        const createdUsers = result.records.map((record: any) => {
            const fields = record._fields[0];
            const user = fields.properties as IUser;
            let elementId: string = fields.elementId;
            elementId = elementId.substring(elementId.lastIndexOf(':') + 1);
            user.id = elementId;
            return user;
        });
        return createdUsers[0];
    }

    async read(id: string): Promise<IUser | undefined> {
        this.logger.log('Read');

        const result = await this.neo4jService.read(
            'MATCH(user:User{id: $id}) RETURN(user)',
            {id}
        );
        console.log("%j", result.records);
        const createdUser = result.records.map((record: any) => record._fields[0].properties);
        return createdUser[0] as IUser;
    }
}
import {
  IBende,
  IBlob,
  ICreateUser,
  IProject,
  IUpdateUser,
  IUser,
} from '@ihomer/api';
import { Injectable, Logger } from '@nestjs/common';
import { QueryResult, RecordShape } from 'neo4j-driver-core';
import { Neo4jService } from 'nest-neo4j/dist';

@Injectable()
export class UserService {
  private readonly logger: Logger = new Logger(UserService.name);

  constructor(private readonly neo4jService: Neo4jService) {}

  async create(user: ICreateUser): Promise<IUser | undefined> {
    this.logger.log('Create');

    if (!user.password) {
      const result = await this.neo4jService.write(
        'MERGE(user:User{uuid: randomUUID(), email: $email, profilePicture: $profilePicture, firstName: $firstName, infix: $infix, lastName: $lastName, bio: $bio, birthday: $birthday, street: $street, houseNumber: $houseNumber, postalCode: $postalCode, city: $city, tags: $tags}) RETURN user',
        user
      );
      const users = this.convertFromDb(result);
      if (!users) return undefined;
      return users[0];
    }
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
      { id }
    );

    const users = this.convertFromDb(result);
    if (!users) return undefined;
    return users[0];
  }

  async getAll(): Promise<IUser[]> {
    this.logger.log('getAll');

    const result = await this.neo4jService.read('MATCH(user:User) return user');

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
    this.logger.log(`Deleted ${amountDeleted} user(s).`);
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
      password: user.password,
    };

    const result = await this.neo4jService.write(
      'MATCH(user:User{uuid:$id}) SET user += {email: $email, profilePicture: $profilePicture, firstName: $firstName, infix: $infix, lastName: $lastName, bio: $bio, birthday: $birthday, street: $street, houseNumber: $houseNumber, postalCode: $postalCode, city: $city, tags: $tags, password: $password} RETURN user',
      params
    );
    const users = this.convertFromDb(result);
    if (!users) return undefined;
    return users[0];
  }

  async find(emailAddress: string): Promise<IUser | undefined> {
    const result = await this.neo4jService.read(
      'MATCH(user:User) WHERE TOLOWER(user.email) = TOLOWER($emailAddress) RETURN user',
      { emailAddress }
    );
    const users = this.convertFromDb(result, true);
    console.log(users[0]);
    if (!users || !users[0]) return undefined;
    return users[0];
  }

  async isAdmin(user: IUser): Promise<boolean> {
    const result = await this.neo4jService.read(
      'MATCH(user:User{uuid: $id})-[]->(blob:Blob{type: "Bestuur"}) return user,blob',
      { id: user.id }
    );
    const blob = result.records.map((record: any) => {
      const blobData = record.get('blob');
      const blob: IBlob = {
        id: blobData.properties.uuid,
        name: blobData.properties.name,
        creationDate: new Date(blobData.properties.creationDate),
        slack: blobData.properties.slack,
        mandate: blobData.properties.mandate,
        image: blobData.properties.image,
        type: blobData.properties.type,
        users: [],
        gradient: ["lightgrey", "lightgrey"]
      };
      return blob;
    })[0];
    if (blob) return true;
    return false;
  }

  async profile(id: string): Promise<{
    user: IUser | undefined;
    blobs: Array<IBlob>;
    bendes: Array<IBende>;
    projects: Array<IProject>;
  }> {
    this.logger.log('Profile');

    const result = await this.neo4jService.read(
      'MATCH (user:User {uuid: $id}) OPTIONAL MATCH (user)-[]-(connectedNode) RETURN user, connectedNode',
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
      if (connectedNode) {
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
        password: userData.properties.password,
        opacity: 1,
      };
      if (!includePassword) user.password = '';
      return user;
    });
    return createdUsers as IUser[];
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

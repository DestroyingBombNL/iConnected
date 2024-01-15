import { IBende, IUser } from '@ihomer/api';
import { Injectable, Logger } from '@nestjs/common';
import { QueryResult, RecordShape } from 'neo4j-driver';
import { Neo4jService } from 'nest-neo4j/dist';

@Injectable()
export class BendeService {
  private readonly logger: Logger = new Logger(BendeService.name);

  constructor(private readonly neo4jService: Neo4jService) {}

  async getAll(): Promise<IBende[]> {
    this.logger.log('getAll');

    const readQuery = `
            MATCH (bende:Bende)-[]-(user:User)
            WITH bende, COLLECT(user) as users, COLLECT(user.firstName) AS firstNames
            RETURN bende, users ORDER BY firstNames ASC`;
    const result = await this.neo4jService.read(readQuery);

    const bendes = this.convertFromDB(result);

    return bendes ?? [];
  }

  async get(id: string): Promise<IBende | undefined> {
    this.logger.log('get');

    const readQuery = `
            MATCH (bende:Bende)-[]-(user:User)
            WITH bende, COLLECT(user) as users, COLLECT(user.firstName) AS firstNames
            WHERE bende.uuid = $id
            RETURN bende, users ORDER BY firstNames ASC`;
    const result = await this.neo4jService.read(readQuery, { id });

    const bendes = this.convertFromDB(result);
    if (!bendes) return undefined;
    return bendes[0];
  }

  async createBende(bende: IBende): Promise<IBende | undefined> {
    this.logger.log('createBende');
    const currentDate = this.formatDate(new Date());

    const writeQuery = `CREATE(bende:Bende {uuid: randomUUID(), name: $name,  creationDate: $creationDate, slack: $slack, image: $image})`;

    const params = {
      name: bende.name,
      creationDate: currentDate,
      slack: bende.slack,
      image: bende.image,
    };

    const userWrites: string[] = [];

    for (let i = 0; i < bende.users.length; i++) {
      const userKey = `userId${i}`;
      userWrites.push(
        `WITH bende
                MATCH (user${i}:User {uuid: $${userKey}})
                CREATE (user${i})-[:MEMBER_OF]->(bende)`
      );
      params[userKey] = bende.users[i].id;
    }
    const write = `${writeQuery} ${userWrites.join(
      ' '
    )} WITH bende RETURN bende`;
    await this.neo4jService.write(write, params);

    const readQuery = `
            MATCH (bende:Bende)
            WHERE bende.name = $name
            RETURN bende`;
    const readResult = await this.neo4jService.read(readQuery, params);
    const uuid = await readResult.records[0].get('bende').properties.uuid;
    return this.get(uuid);
  }

  async updateBende(bende: IBende, id: string): Promise<IBende | undefined> {
    this.logger.log('updateBende');

    const params: { [key: string]: any } = { id };
    if (bende.users) {
      // Delete all existing relationships for the Bende
      const deleteAllRelationshipsQuery = `
                MATCH (user:User)-[r:MEMBER_OF]->(bende:Bende)
                WHERE bende.uuid = $id
                DETACH DELETE r
            `;

      // Run the query to delete all existing relationships
      await this.neo4jService.write(deleteAllRelationshipsQuery, params);
    }
    // Add selected user ids to params
    params.selectedUserIds = bende.users;
    console.log('params', bende);

    let setClause = 'SET ';

    // Construct the SET clause dynamically based on the properties in the 'bende' object
    Object.keys(bende).forEach((key, index) => {
      if (key !== 'id' && key !== 'users') {
        // Exclude 'id' and 'users' properties
        setClause += `bende.${key} = $${key}`;

        // Add the property to the parameters
        params[key] = bende[key];

        if (index < Object.keys(bende).length - 2) {
          setClause += ', ';
        }
      }
    });

    const updateQuery = `
    MATCH (bende:Bende)
    WHERE bende.uuid = $id
    ${setClause} 
    RETURN bende
    `;

const createRelationshipsQuery = `
    MATCH (bende:Bende), (user:User)
    WHERE bende.uuid = $id AND user.uuid IN $selectedUserIds
    MERGE (user)-[:MEMBER_OF]->(bende)
`;
await this.neo4jService.write(createRelationshipsQuery, params);
     const updateResult = await this.neo4jService.write(updateQuery, params);

    if (updateResult.records.length > 0) {
      const updatedBendeId =
        updateResult.records[0].get('bende').properties.uuid;

      const updatedBende = await this.get(updatedBendeId);

      if (updatedBende) {
        return updatedBende;
      }
    }
    return undefined;
  }

  async deleteBende(id: string): Promise<boolean> {
    this.logger.log('deleteBende');

    const params = { id };

    const checkQuery = `
            MATCH (bende:Bende {uuid: $id})-[:MEMBER_OF]-(user:User)
            RETURN count(user) AS userCount`;

    const checkResult = await this.neo4jService.read(checkQuery, params);
    const userCount = checkResult.records[0].get('userCount').toNumber();

    if (userCount > 0) {
      const deleteQuery = `
                MATCH (bende:Bende {uuid: $id})
                DETACH DELETE bende`;

      await this.neo4jService.write(deleteQuery, params);
      return true;
    } else {
      return false;
    }
  }

  private convertFromDB(
    result: QueryResult<RecordShape>
  ): IBende[] | undefined {
    const createdBendes = result.records.map((record: any) => {
      const bendeData = record.get('bende');
      const users = record.get('users');
      const bende: IBende = {
        id: bendeData.properties.uuid,
        name: bendeData.properties.name,
        creationDate: new Date(bendeData.properties.creationDate),
        slack: bendeData.properties.slack,
        image: bendeData.properties.image,
        users: [],
        gradient: ['#b9adad', '#b9adad'],
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
          country: users[i].properties.country,
          tags: users[i].properties.tags,
          password: users[i].properties.password,
          opacity: 1,
          border: '0px',
        };
        bende.users.push(user);
      }
      return bende;
    });
    return createdBendes;
  }
  formatDate(date: Date): string {
    const year = date.getFullYear();
    const month = ('0' + (date.getMonth() + 1)).slice(-2); // Adding 1 because months are zero-indexed
    const day = ('0' + date.getDate()).slice(-2);

    return `${year}-${month}-${day}`;
  }
}

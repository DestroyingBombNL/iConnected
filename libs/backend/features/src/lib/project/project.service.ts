import { IProject, IUser } from '@ihomer/api';
import { Injectable, Logger } from '@nestjs/common';
import { QueryResult, RecordShape } from 'neo4j-driver';
import { Neo4jService } from 'nest-neo4j/dist';

@Injectable()
export class ProjectService {
  private readonly logger: Logger = new Logger(ProjectService.name);

  constructor(private readonly neo4jService: Neo4jService) {}

  async getAll(): Promise<IProject[] | undefined> {
    this.logger.log('getAll');

    const readQuery = `
            MATCH (project:Project)-[]-(user:User)
            WITH project, COLLECT(user) as users, COLLECT(user.firstName) AS firstNames
            RETURN project, users ORDER BY firstNames ASC`;
    const result = await this.neo4jService.read(readQuery);

    const projects = this.convertFromDB(result);
    if (!projects) return undefined;
    return projects;
  }

  async get(id: string): Promise<IProject | undefined> {
    this.logger.log('get');

    const readQuery = `
            MATCH (project:Project)-[]-(user:User)
            WITH project, COLLECT(user) as users, COLLECT(user.firstName) AS firstNames
            WHERE project.uuid = $id
            RETURN project, users ORDER BY firstNames ASC`;
    const result = await this.neo4jService.read(readQuery, { id });

    const projects = this.convertFromDB(result);
    if (!projects) return undefined;
    return projects[0];
  }

  async createProject(project: IProject): Promise<IProject | undefined> {
    this.logger.log('createProject');
    const currentDate = this.formatDate(new Date());

    const writeQuery = `CREATE(project:Project {uuid: randomUUID(), name: $name, slack: $slack, creationDate: $creationDate, image: $image})`;

    const params = {
      name: project.name,
      creationDate: currentDate,
      slack: project.slack,
      image: project.image,
    };

    const userWrites: string[] = [];

    for (let i = 0; i < project.users.length; i++) {
      const userKey = `userId${i}`;
      userWrites.push(
        `WITH project
                MATCH (user${i}:User {uuid: $${userKey}})
                CREATE (user${i})-[:WORKS_ON]->(project)`
      );
      params[userKey] = project.users[i].id;
    }
    const write = `${writeQuery} ${userWrites.join(
      ' '
    )} WITH project RETURN project`;
    await this.neo4jService.write(write, params);

    const readQuery = `
            MATCH (project:Project)
            WHERE project.name = $name
            RETURN project`;
    const readResult = await this.neo4jService.read(readQuery, params);
    const uuid = await readResult.records[0].get('project').properties.uuid;
    return this.get(uuid);
  }

  async updateProject(project: IProject, id: string): Promise<IProject | undefined> {
    this.logger.log('updateProject');

    const params: { [key: string]: any } = { id };
    if (project.users) {
      // Delete all existing relationships for the project
      const deleteAllRelationshipsQuery = `
            MATCH (user:User)-[r:WORKS_ON]->(project:Project)
            WHERE project.uuid = $id
            DETACH DELETE r
        `;

      // Run the query to delete all existing relationships
      await this.neo4jService.write(deleteAllRelationshipsQuery, params);
    }
    // Add selected user ids to params
    params.selectedUserIds = project.users;
    console.log('params', project);

    // Construct the SET clause dynamically based on the properties in the 'project' object
    let setClause = 'SET ';
    Object.keys(project).forEach((key, index) => {
      if (key !== 'id' && key !== 'users') {
        // Exclude 'id' and 'users' properties
        setClause += `project.${key} = $${key}`;

        // Add the property to the parameters
        params[key] = project[key];

        if (index < Object.keys(project).length - 2) {
          setClause += ', ';
        }
      }
    });

    // Update project properties
    const updateQuery = `
            MATCH (project:Project)
            WHERE project.uuid = $id
            ${setClause} 
            RETURN project
        `;

    const createRelationshipsQuery = `
            MATCH (project:Project), (user:User)
            WHERE project.uuid = $id AND user.uuid IN $selectedUserIds
            MERGE (user)-[:WORKS_ON]->(project)
        `;
    await this.neo4jService.write(createRelationshipsQuery, params);

    // Run create relationship query
    console.log('params', params);
    // Run update query
    const updateResult = await this.neo4jService.write(updateQuery, params);

    if (updateResult.records.length > 0) {
      const updatedProjectId =
        updateResult.records[0].get('project').properties.uuid;

      const updatedProject = await this.get(updatedProjectId);

      if (updatedProject) {
        return updatedProject;
      }
    }
    return undefined;
  }

  async deleteProject(id: string): Promise<boolean> {
    this.logger.log('deleteProject');

    const params = { id };

    /*         const checkQuery = `
            MATCH (project:Project {uuid: $id})-[:WORKS_ON]-(user:User)
            RETURN count(user) AS userCount`;
    
        const checkResult = await this.neo4jService.read(checkQuery, params);
        const userCount = checkResult.records[0].get('userCount').toNumber();
     */
    // if (userCount > 0) {
    const deleteQuery = `
                MATCH (project:Project {uuid: $id})
                DETACH DELETE project`;

    await this.neo4jService.write(deleteQuery, params);
    return true;
  }

  private convertFromDB(
    result: QueryResult<RecordShape>
  ): IProject[] | undefined {
    const createdProjects = result.records.map((record: any) => {
      const projectData = record.get('project');
      const users = record.get('users');
      const project: IProject = {
        id: projectData.properties.uuid,
        name: projectData.properties.name,
        slack: projectData.properties.slack,
        creationDate: new Date(projectData.properties.creationDate),
        image: projectData.properties.image,
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
        project.users.push(user);
      }
      return project;
    });
    return createdProjects;
  }

  formatDate(date: Date): string {
    const year = date.getFullYear();
    const month = ('0' + (date.getMonth() + 1)).slice(-2); // Adding 1 because months are zero-indexed
    const day = ('0' + date.getDate()).slice(-2);

    return `${year}-${month}-${day}`;
  }
}

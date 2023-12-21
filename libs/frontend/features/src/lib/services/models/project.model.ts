import { IProject, IUser } from "@ihomer/api";
import { Entity } from "./entity.model";

export class Project extends Entity implements IProject {
    constructor(
        id: string,
        public name: string,
        public slack: string,
        public creationDate: Date,
        public image: string,
        public users: IUser[],
    ) { 
        super(id)
    }
}
import { IUser } from "./user.interface";

export interface IProject {
    id: string;
    name: string;
    slack: string;
    creationDate: Date;
    image: string;
    users: IUser[];
}
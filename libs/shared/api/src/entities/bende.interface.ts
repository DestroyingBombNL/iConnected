import { IUser } from "./user.interface";

export interface IBende {
    id: string;
    name: string;
    creationDate: Date;
    slack: string;
    image: string;
    users: IUser[];
}
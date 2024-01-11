import { type } from "./type.interface";
import { IUser } from "./user.interface"

export interface IBlob {
    id: string;
    name: string;
    creationDate: Date;
    slack: string;
    mandate: string;
    type: type;
    image: string;
    users: IUser[];
    gradient: string[];
}
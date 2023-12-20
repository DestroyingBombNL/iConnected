import { type } from "./type.interface";
import { IUser } from "./user.interface"

export interface IBlob {
    id: string;
    name: string;
    creationDate: Date;
    slackChannel: string;
    mandate: string;
    image: string;
    type: type;
    users: IUser[];
}

export interface IBlobResponse {
    users: IUser[]
}
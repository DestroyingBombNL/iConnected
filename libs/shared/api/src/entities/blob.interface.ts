import { IUser } from "./user.interface"

export interface IBlob {
    _id: string,
    name: string,
    creationDate: Date,
    slack: string,
    mandate: string,
    userIds: string[],
}

export interface IBlobResponse {
    users: IUser[]
}

export interface IPopulatedBlobResponse {
    _id: string,
    name: string,
    creationDate: Date,
    slack: string,
    mandate: string,
    userIds: IUser[],
}
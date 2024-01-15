import { IUser } from "./user.interface"

export interface IBlob {
    id: string;
    name: string;
    creationDate: Date;
    slack: string;
    mandate: string;
    type: Type
    image: string;
    users: IUser[];
    gradient: string[];
}

export enum Type {
    Bestuur,
    Vaste,
    Tijdelijke
}
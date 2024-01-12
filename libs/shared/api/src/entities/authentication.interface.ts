import { IUser } from "./user.interface";

export interface ILogin {
    emailAddress: string;
    password: string;
}

export interface ILoginResponse {
    user: IUser,
    token: string,
    isAdmin: boolean
}
export interface IUser {
    token?: string;
    id: string;
    email: string;
    profilePicture: string;
    firstName: string;
    infix: string;
    lastName: string;
    bio: string;
    birthday: Date;
    street: string;
    houseNumber: string;
    postalCode: string;
    city: string;
    country: string;
    tags: string[];
    password: string;
    opacity: number;
    border: string;
}

export enum UserRole {
    admin = 'admin',
    deelnemer = 'deelnemer'
}

export type ICreateUser = Partial<Omit<IUser, 'id'>>;
export type IUpdateUser = ICreateUser;
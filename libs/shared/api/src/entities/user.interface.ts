export interface IUser {
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
    tags: string[];
    password: string;
}

export type ICreateUser = Partial<Omit<IUser, 'id'>>;
export type IUpdateUser = ICreateUser;
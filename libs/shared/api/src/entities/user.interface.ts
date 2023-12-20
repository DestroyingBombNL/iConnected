export interface IUser {
    id: string;
    email: string;
    profilePicture: string;
    firstName: string;
    infix: string;
    lastName: string;
    bio: string;
    birthDay: Date;
    street: string;
    houseNumber: string;
    postalCode: string;
    city: string;
    tags: string[];
    password: string;
}
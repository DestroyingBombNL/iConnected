import { ICreateUser, IUpdateUser } from "@ihomer/api";import {
    IsNotEmpty,
    IsString,
    IsOptional,
    IsDate,
    IsEmail,
    IsArray,
    IsPostalCode
} from 'class-validator';

export class CreateUserDTO implements ICreateUser {
    @IsString()
    @IsNotEmpty()
    bio?: string | undefined;

    @IsDate()
    @IsNotEmpty()
    birthday?: Date | undefined;

    @IsString()
    @IsNotEmpty()
    city?: string | undefined;

    @IsString()
    @IsEmail()
    @IsNotEmpty()
    email?: string | undefined;

    @IsString()
    @IsNotEmpty()
    firstName?: string | undefined;

    @IsString()
    @IsNotEmpty()
    houseNumber?: string | undefined;

    @IsString()
    @IsOptional()
    infix?: string | undefined;

    @IsString()
    @IsNotEmpty()
    lastName?: string | undefined;

    @IsString()
    @IsNotEmpty()
    password?: string | undefined;

    @IsString()
    @IsPostalCode("NL")
    @IsNotEmpty()
    postalCode?: string | undefined;

    @IsString()
    @IsNotEmpty()
    profilePicture?: string | undefined;

    @IsString()
    @IsNotEmpty()
    street?: string | undefined;

    @IsArray()
    @IsNotEmpty()
    tags?: string[] | undefined;
}
export type UpdateUserDTO = CreateUserDTO;
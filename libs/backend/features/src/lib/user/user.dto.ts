import { ICreateUser } from "@ihomer/api";import {
    IsNotEmpty,
    IsString,
    IsOptional,
    IsEmail,
    IsArray,
    IsDateString,
    Matches
} from 'class-validator';

export class CreateUserDTO implements ICreateUser {
    @IsString()
    @IsNotEmpty()
    bio?: string | undefined;

    @IsDateString()
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
    @Matches(/^(?:(?:[1-9]\d{3})\s?[a-zA-Z]{2}|(\d{4}\s?.+))$/, {
        message: 'PostalCode must be a valid NL or BE postal code.'
    })
    @IsNotEmpty()
    postalCode?: string | undefined;

    @IsString()
    @IsNotEmpty()
    profilePicture?: string | undefined;

    @IsString()
    @IsNotEmpty()
    street?: string | undefined;

    @IsArray()
    @IsOptional()
    tags?: string[] | undefined;
}
export type UpdateUserDTO = CreateUserDTO;
import { Injectable } from "@nestjs/common";
import { UserService } from "../user/user.service";
import { ILogin, IUser } from "@ihomer/api";
import { backendEnvironment } from "@ihomer/shared/util-env";
import { sign } from "jsonwebtoken";

@Injectable()
export class AuthService {
    constructor(private readonly userService: UserService) {}

    async login(login: ILogin): Promise<IUser | undefined> {
        const user = await this.userService.find(login.emailAddress);
        if (!user) return undefined;

        if (user.password !== login.password) return undefined;
        
        const authenticationHex = backendEnvironment.jwtKey;

        if (authenticationHex) {
            const secretKey = authenticationHex;
            const userId = user.id.toString();
            const token = sign({ userId }, secretKey, {
                expiresIn: '6h',
            });
            user.token = token;
            return user;
        } else {
            console.error("AUTHENTICATION_HEX is not defined or empty in the environment variables.");
        }
        return undefined;
    }
}
import { Injectable, Logger } from "@nestjs/common";
import { UserService } from "../user/user.service";
import { ILogin, ILoginResponse } from "@ihomer/api";
import { backendEnvironment } from "@ihomer/shared/util-env";
import { sign } from "jsonwebtoken";

@Injectable()
export class AuthService {
    private readonly logger = new Logger(AuthService.name);
    constructor(private readonly userService: UserService) {}

    async login(login: ILogin): Promise<ILoginResponse | undefined> {
        this.logger.log(`Login for user: ${login.emailAddress}`)
        const user = await this.userService.find(login.emailAddress);
        console.log('user');
        if (!user) return undefined;
        console.log('user 1');
        console.log(user.password);
        console.log(login.password);
        if (user.password !== login.password) return undefined;
        console.log('user 2');
        const authenticationHex = backendEnvironment.jwtKey;
        if (authenticationHex) {
            const secretKey = authenticationHex;
            const userId = user.id.toString();
            const isAdmin = await this.userService.isAdmin(user);
            const token = sign({ userId, isAdmin }, secretKey, {
                expiresIn: '6h',
            });
            user.token = token;
            return { user, token, isAdmin };
        } else {
            console.error("AUTHENTICATION_HEX is not defined or empty in the environment variables.");
        }
        return undefined;
    }
}
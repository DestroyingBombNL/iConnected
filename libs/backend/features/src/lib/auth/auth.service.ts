import { Injectable, Logger } from "@nestjs/common";
import { UserService } from "../user/user.service";
import { ILogin, IUser } from "@ihomer/api";
import { backendEnvironment } from "@ihomer/shared/util-env";
import { sign, verify } from "jsonwebtoken";

@Injectable()
export class AuthService {
    private readonly logger = new Logger(AuthService.name);
    constructor(private readonly userService: UserService) {}

    async login(login: ILogin): Promise<IUser | undefined> {
        const user = await this.userService.find(login.emailAddress);
        if (!user) return undefined;
        if (user.password !== login.password) return undefined;
        
        const authenticationHex = backendEnvironment.jwtKey;

        if (authenticationHex) {
            const secretKey = authenticationHex;
            const userId = user.id.toString();
            const isAdmin = await this.userService.isAdmin(user);
            const token = sign({ userId, isAdmin }, secretKey, {
                expiresIn: '6h',
            });
            user.token = token;
            // user.admin = isAdmin;
            return user;
        } else {
            console.error("AUTHENTICATION_HEX is not defined or empty in the environment variables.");
        }
        return undefined;
    }

    async isAdminToken(token: string): Promise<boolean> {
        try {
            const decodedToken = verify(token, backendEnvironment.jwtKey);
            console.log('Decoded token: ', decodedToken);
            return true;
        } catch(err) {
            this.logger.error('Failed to verify token');
            return false;
        }
    }
}
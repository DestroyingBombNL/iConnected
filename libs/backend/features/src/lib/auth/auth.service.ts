import { Injectable, Logger } from "@nestjs/common";
import { UserService } from "../user/user.service";
import { ILogin, ILoginResponse, ITokenValidationResponse } from "@ihomer/api";
import { backendEnvironment } from "@ihomer/shared/util-env";
import { sign, verify } from "jsonwebtoken";
import * as bcrypt from "bcrypt";

@Injectable()
export class AuthService {
    private readonly logger = new Logger(AuthService.name);
    constructor(private readonly userService: UserService) {}

    async login(login: ILogin): Promise<ILoginResponse | undefined> {
        this.logger.log(`Login for user: ${login.emailAddress}`)
        const user = await this.userService.find(login.emailAddress);
        if (!user) return undefined;

        // Compare passwords
        if (!bcrypt.compareSync(login.password, user.password)) {
            return undefined;
        }

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

    async validateToken(token: string): Promise<ITokenValidationResponse | undefined> {
        if (!token) return undefined;

        try {
            const payload: any = verify(token, backendEnvironment.jwtKey);
            return { isAdmin: payload.isAdmin }
        } catch(err) {
            return undefined;
        }
    }
}
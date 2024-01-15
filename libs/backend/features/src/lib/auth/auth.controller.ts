import { Controller, Get, Request, UseGuards } from "@nestjs/common";
import { AuthService } from "./auth.service";
import { AuthGuard } from "./auth.guards";
import { ITokenValidationResponse } from "@ihomer/api";

@Controller('auth')
export class AuthController {
    constructor(private readonly authService: AuthService) {}

    @Get('validatetoken')
    @UseGuards(AuthGuard)
    async validateToken(@Request() req: any): Promise<ITokenValidationResponse | undefined> {
        if (!req.headers.authorization) return undefined;
        const token = req.headers.authorization.split(' ')[1];
        return await this.authService.validateToken(token);
    }
}

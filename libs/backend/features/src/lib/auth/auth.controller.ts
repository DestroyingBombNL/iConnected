import { Controller, Get, UseGuards } from "@nestjs/common";
import { AuthService } from "./auth.service";
import { AuthGuard } from "./auth.guards";

@Controller('auth')
export class AuthController {
    constructor(private readonly authService: AuthService) {}

    @Get('validatetoken')
    @UseGuards(AuthGuard)
    validateToken() {
        // Can be left empty, guard will validate a token.
    }
}

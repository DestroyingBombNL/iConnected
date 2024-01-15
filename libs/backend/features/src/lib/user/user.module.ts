import { Module } from "@nestjs/common";
import { UserController } from "./user.controller";
import { UserService } from "./user.service";
import { AuthModule } from "../auth/auth.module";
import { JwtService } from "@nestjs/jwt";

@Module({
    imports: [AuthModule],
    controllers: [UserController],
    providers: [UserService, JwtService],
    exports: []
})
export class UserModule {}
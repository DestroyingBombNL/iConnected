import { Module } from "@nestjs/common";
import { UserController } from "./blob.controller";
import { UserService } from "./blob.service";

@Module({
    controllers: [UserController],
    providers: [UserService],
    exports: []
})
export class UserModule {}
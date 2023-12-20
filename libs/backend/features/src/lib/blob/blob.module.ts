import { Module } from "@nestjs/common";
import { UserController } from "./blob.controller";
import { BlobService } from "./blob.service";

@Module({
    controllers: [UserController],
    providers: [BlobService],
    exports: []
})
export class BlobModule {}
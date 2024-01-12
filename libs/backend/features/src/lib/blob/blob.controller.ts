import { IBlob } from '@ihomer/api';
import { Body, Controller, Delete, Get, Param, Post, Put, UseGuards } from '@nestjs/common';
import { BlobService } from './blob.service';
import { AdminGuard, AuthGuard } from '../auth/auth.guards';

@Controller('blobs')
export class BlobController {
    constructor(private readonly blobService: BlobService) {}

    @Get()
    @UseGuards(AuthGuard)
    getAll(): Promise<IBlob[] | undefined> {
        return this.blobService.getAll();
    }

    @Get('/types')
    @UseGuards(AuthGuard)
    async getTags(): Promise<string[]> {
        return this.blobService.getDistinctTypesForAllBlobs();
    }

    @Get(':id')
    @UseGuards(AuthGuard)
    get(@Param('id') id: string): Promise<IBlob | undefined> {
        return this.blobService.get(id);
    }

    @Post()
    @UseGuards(AdminGuard)
    create(@Body() blob: IBlob): Promise<IBlob | undefined>{
        return this.blobService.createBlob(blob);
    }

    @Put(':id')
    @UseGuards(AdminGuard)
    update(@Body() blob: IBlob, @Param('id') id: string): Promise<IBlob | undefined> {
        return this.blobService.updateBlob(blob, id);
    }

    @Delete(':id')
    @UseGuards(AdminGuard)
    delete(@Param('id') id: string): Promise<boolean> {
        return this.blobService.deleteBlob(id);
    }
}

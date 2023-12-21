import { IBlob } from '@ihomer/api';
import { Body, Controller, Delete, Get, Param, Post, Put } from '@nestjs/common';
import { BlobService } from './blob.service';

@Controller('blobs')
export class BlobController {
    constructor(private readonly blobService: BlobService) {}

    @Get()
    getAll(): Promise<IBlob[] | undefined> {
        return this.blobService.getAll();
    }

    @Get(':id')
    get(@Param('id') id: string): Promise<IBlob | undefined> {
        return this.blobService.get(id);
    }

    @Post()
    create(@Body() blob: IBlob): Promise<IBlob | undefined>{
        return this.blobService.createBlob(blob);
    }

    @Put(':id')
    update(@Body() blob: IBlob, @Param('id') id: string): Promise<IBlob | undefined> {
        return this.blobService.updateBlob(blob, id);
    }

    @Delete(':id')
    delete(@Param('id') id: string): Promise<boolean> {
        return this.blobService.deleteBlob(id);
    }
}

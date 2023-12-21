import { IBende } from '@ihomer/api';
import { Body, Controller, Delete, Get, Param, Post, Put } from '@nestjs/common';
import { BendeService } from './bende.service';

@Controller('bendes')
export class BendeController {
    constructor(private readonly bendeService: BendeService) {}

    @Get()
    getAll(): Promise<IBende[] | undefined> {
        return this.bendeService.getAll();
    }

    @Get(':id')
    get(@Param('id') id: string): Promise<IBende | undefined> {
        return this.bendeService.get(id);
    }

    @Post()
    create(@Body() bende: IBende): Promise<IBende | undefined>{
        return this.bendeService.createBende(bende);
    }

    @Put(':id')
    update(@Body() bende: IBende, @Param('id') id: string): Promise<IBende | undefined> {
        return this.bendeService.updateBende(bende, id);
    }

    @Delete(':id')
    delete(@Param('id') id: string): Promise<boolean> {
        return this.bendeService.deleteBende(id);
    }
}

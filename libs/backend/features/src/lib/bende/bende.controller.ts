import { IBende } from '@ihomer/api';
import { Body, Controller, Delete, Get, Param, Post, Put, UseGuards } from '@nestjs/common';
import { BendeService } from './bende.service';
import { AdminGuard, AuthGuard } from '../auth/auth.guards';

@Controller('bendes')
export class BendeController {
    constructor(private readonly bendeService: BendeService) {}

    @Get()
    @UseGuards(AuthGuard)
    getAll(): Promise<IBende[]> {
        return this.bendeService.getAll();
    }

    @Get(':id')
    @UseGuards(AuthGuard)
    get(@Param('id') id: string): Promise<IBende | undefined> {
        return this.bendeService.get(id);
    }

    @Post()
    @UseGuards(AdminGuard)
    create(@Body() bende: IBende): Promise<IBende | undefined>{
        return this.bendeService.createBende(bende);
    }

    @Put(':id')
    @UseGuards(AdminGuard)
    update(@Body() bende: IBende, @Param('id') id: string): Promise<IBende | undefined> {
        return this.bendeService.updateBende(bende, id);
    }

    @Delete(':id')
    @UseGuards(AdminGuard)
    delete(@Param('id') id: string): Promise<boolean> {
        return this.bendeService.deleteBende(id);
    }
}

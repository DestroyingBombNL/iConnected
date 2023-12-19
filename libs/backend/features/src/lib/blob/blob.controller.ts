import { IUser } from '@ihomer/api';
import { Body, Controller, Delete, Get, Param, Post, Put } from '@nestjs/common';
import { UserService } from './blob.service';

@Controller('users')
export class UserController {
    constructor(private readonly userService: UserService) {}

    @Get()
    getAll(): IUser[] {
        return [];
    }

    @Get(':id')
    get(@Param('id') id: string): IUser | undefined {
        return undefined;
    }

    @Post()
    create(@Body() user: IUser): IUser | undefined {
        return undefined;
    }

    @Put(':id')
    update(@Body() user: IUser): IUser | undefined {
        return undefined;
    }

    @Delete(':id')
    delete(@Param('id') id: string): boolean {
        return false;
    }
}

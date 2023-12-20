import { IUser } from '@ihomer/api';
import { Body, Controller, Delete, Get, Param, Post, Put } from '@nestjs/common';
import { UserService } from './user.service';

@Controller('users')
export class UserController {
    constructor(private readonly userService: UserService) {}

    @Get()
    getAll(): IUser[] {
        return [];
    }

    @Get(':id')
    async get(@Param('id') id: string): Promise<IUser | undefined> {
        return this.userService.read(id);
    }

    @Post()
    async create(@Body() user: IUser): Promise<IUser | undefined> {
        return this.userService.create(user);
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

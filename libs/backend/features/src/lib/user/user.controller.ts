import { ICreateUser, IUpdateUser, IUser } from '@ihomer/api';
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
        const user = await this.userService.read(id);
        if (!user) return undefined;
        user.password = '';
        return user;
    }

    @Post()
    async create(@Body() user: ICreateUser): Promise<IUser | undefined> {
        const newUser = await this.userService.create(user);
        if (!newUser) return undefined;
        newUser.password = '';
        return newUser;
    }

    @Put(':id')
    async update(@Param('id') id: string, @Body() user: IUpdateUser): Promise<IUser | undefined> {
        const updatedUser = await this.userService.update(id, user);
        if (!updatedUser) return undefined;
        updatedUser.password = '';
        return updatedUser;
    }

    @Delete(':id')
    async delete(@Param('id') id: string): Promise<boolean> {
        return await this.userService.delete(id);
    }
}

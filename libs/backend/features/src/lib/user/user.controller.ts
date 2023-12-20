import { ICreateUser, IUpdateUser, IUser } from '@ihomer/api';
import { Body, Controller, Delete, Get, Param, Post, Put } from '@nestjs/common';
import { UserService } from './user.service';

@Controller('users')
export class UserController {
    constructor(private readonly userService: UserService) {}

    @Get()
    async getAll(): Promise<IUser[]> {
        return await this.userService.getAll();
    }

    @Get(':id')
    async get(@Param('id') id: string): Promise<IUser | undefined> {
        const user = await this.userService.read(id);
        return user;
    }

    @Post()
    async create(@Body() user: ICreateUser): Promise<IUser | undefined> {
        const newUser = await this.userService.create(user);
        return newUser;
    }

    @Put(':id')
    async update(@Param('id') id: string, @Body() user: IUpdateUser): Promise<IUser | undefined> {
        const updatedUser = await this.userService.update(id, user);
        return updatedUser;
    }

    @Delete(':id')
    async delete(@Param('id') id: string): Promise<boolean> {
        return await this.userService.delete(id);
    }
}

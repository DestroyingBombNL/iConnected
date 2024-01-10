import { IBende, IBlob, ILogin, IProject, IUser } from '@ihomer/api';
import { Body, Controller, Delete, Get, Param, Post, Put } from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDTO, UpdateUserDTO } from './user.dto';
import { AuthService } from '../auth/auth.service';

@Controller('users')
export class UserController {
    constructor(private readonly userService: UserService, private readonly authService: AuthService) {}

    @Get()
    async getAll(): Promise<IUser[]> {
        return await this.userService.getAll();
    }
    
    @Get('/tags')
    async getTags(): Promise<string[]> {
        return this.userService.getDistinctTagsForAllUsers();
    }

    @Get(':id')
    async get(@Param('id') id: string): Promise<IUser | undefined> {
        const user = await this.userService.read(id);
        return user;
    }

    @Post()
    async create(@Body() user: CreateUserDTO): Promise<IUser | undefined> {
        const newUser = await this.userService.create(user);
        return newUser;
    }

    @Put(':id')
    async update(@Param('id') id: string, @Body() user: UpdateUserDTO): Promise<IUser | undefined> {
        const updatedUser = await this.userService.update(id, user);
        return updatedUser;
    }

    @Delete(':id')
    async delete(@Param('id') id: string): Promise<boolean> {
        return await this.userService.delete(id);
    }

    @Post('/login')
    async (@Body() login: ILogin): Promise<IUser | undefined> {
        console.log(login);
        return this.authService.login(login);
    }

    @Get('/profile/:id')
    async profile(@Param('id') id: string): Promise<{ user: IUser | undefined, blobs: Array<IBlob>, bendes: Array<IBende>, projects: Array<IProject> }> {
        const profile = await this.userService.profile(id);
        return profile;
    }
}

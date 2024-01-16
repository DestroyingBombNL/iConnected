import { IBende, IBlob, ILogin, ILoginResponse, IProject, IUser } from '@ihomer/api';
import { Body, Controller, Delete, Get, Param, Post, Put, UseGuards } from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDTO, UpdateUserDTO } from './user.dto';
import { AuthService } from '../auth/auth.service';
import { AdminGuard, AuthGuard, IsSelfGuard } from '../auth/auth.guards';

@Controller('users')
export class UserController {
    constructor(private readonly userService: UserService, private readonly authService: AuthService) {}

    @Get()
    @UseGuards(AuthGuard)
    async getAll(): Promise<IUser[]> {
        return await this.userService.getAll();
    }
    
    @Get('/tags')
    @UseGuards(AuthGuard)
    async getTags(): Promise<string[]> {
        return this.userService.getDistinctTagsForAllUsers();
    }

    @Get(':id')
    @UseGuards(AuthGuard)
    async get(@Param('id') id: string): Promise<IUser | undefined> {
        const user = await this.userService.read(id);
        return user;
    }

    @Post()
    @UseGuards(AdminGuard)
    async create(@Body() user: CreateUserDTO): Promise<IUser | undefined> {
        const newUser = await this.userService.create(user);
        return newUser;
    }

    @Put(':id')
    @UseGuards(IsSelfGuard)
    async update(@Param('id') id: string, @Body() user: UpdateUserDTO): Promise<IUser | undefined> {
        const updatedUser = await this.userService.update(id, user);
        return updatedUser;
    }

    @Delete(':id')
    @UseGuards(AdminGuard)
    async delete(@Param('id') id: string): Promise<boolean> {
        return await this.userService.delete(id);
    }

    @Post('/login')
    async login(@Body() login: ILogin): Promise<ILoginResponse | undefined> {
        return this.authService.login(login);
    }

    @Get('/profile/:id')
    @UseGuards(AuthGuard)
    async profile(@Param('id') id: string): Promise<{ user: IUser | undefined, blobs: Array<IBlob>, bendes: Array<IBende>, projects: Array<IProject> }> {
        const profile = await this.userService.profile(id);
        return profile;
    }
}

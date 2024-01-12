import { IProject } from '@ihomer/api';
import { Body, Controller, Delete, Get, Param, Post, Put, UseGuards } from '@nestjs/common';
import { ProjectService } from './project.service';
import { AuthGuard } from '../auth/auth.guards';

@Controller('projects')
export class ProjectController {
    constructor(private readonly projectService: ProjectService) {}

    @Get()
    @UseGuards(AuthGuard)
    getAll(): Promise<IProject[] | undefined> {
        return this.projectService.getAll();
    }

    @Get(':id')
    @UseGuards(AuthGuard)
    get(@Param('id') id: string): Promise<IProject | undefined> {
        return this.projectService.get(id);
    }

    @Post()
    @UseGuards(AuthGuard)
    create(@Body() project: IProject): Promise<IProject | undefined>{
        return this.projectService.createProject(project);
    }

    @Put(':id')
    @UseGuards(AuthGuard)
    update(@Body() project: IProject, @Param('id') id: string): Promise<IProject | undefined> {
        return this.projectService.updateProject(project, id);
    }

    @Delete(':id')
    @UseGuards(AuthGuard)
    delete(@Param('id') id: string): Promise<boolean> {
        return this.projectService.deleteProject(id);
    }
}

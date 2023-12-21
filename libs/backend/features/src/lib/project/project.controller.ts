import { IProject } from '@ihomer/api';
import { Body, Controller, Delete, Get, Param, Post, Put } from '@nestjs/common';
import { ProjectService } from './project.service';

@Controller('projects')
export class ProjectController {
    constructor(private readonly projectService: ProjectService) {}

    @Get()
    getAll(): Promise<IProject[] | undefined> {
        return this.projectService.getAll();
    }

    @Get(':id')
    get(@Param('id') id: string): Promise<IProject | undefined> {
        return this.projectService.get(id);
    }

    @Post()
    create(@Body() project: IProject): Promise<IProject | undefined>{
        return this.projectService.createProject(project);
    }

    @Put(':id')
    update(@Body() project: IProject, @Param('id') id: string): Promise<IProject | undefined> {
        return this.projectService.updateProject(project, id);
    }

    @Delete(':id')
    delete(@Param('id') id: string): Promise<boolean> {
        return this.projectService.deleteProject(id);
    }
}

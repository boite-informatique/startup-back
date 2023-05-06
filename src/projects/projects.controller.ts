import { Body, Controller, Get, Post, Request } from '@nestjs/common';
import { ProjectsService } from './projects.service';
import { CreateProjectDto } from './dto/create-project.dto';

@Controller('projects')
export class ProjectsController {
    constructor(private readonly projectsService: ProjectsService) {}

    @Get()
    async getProjects(@Request() req) {
        return await this.projectsService.getProjects(req.user);
    }

    @Post()
    async createProject(@Request() req, @Body() body: CreateProjectDto) {
        return await await this.projectsService.createProject(req.user, body);
    }
}

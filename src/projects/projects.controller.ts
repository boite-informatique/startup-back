import { Body, Controller, Get, Request } from '@nestjs/common';
import { ProjectsService } from './projects.service';

@Controller('projects')
export class ProjectsController {
    constructor(private readonly projectsService: ProjectsService) {}

    @Get()
    async getProjects(@Request() req) {
        return await this.projectsService.getProjects(req.user);
    }
}

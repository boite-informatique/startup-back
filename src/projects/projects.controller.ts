import {
    Body,
    Controller,
    Get,
    Param,
    Post,
    Query,
    Request,
} from '@nestjs/common';
import { ProjectsService } from './projects.service';
import { CreateProjectDto } from './dto/create-project.dto';
import { ValidationDto } from './dto/project-validation.dto';

@Controller('projects')
export class ProjectsController {
    constructor(private readonly projectsService: ProjectsService) {}

    @Get()
    async getProjects(@Request() req, @Query('sc') sc: string) {
        if (sc == 'true') {
            return await this.projectsService.getProjectsForSC(req.user.sub);
        }
        return await this.projectsService.getProjects(req.user);
    }

    @Post()
    async createProject(@Request() req, @Body() body: CreateProjectDto) {
        return await await this.projectsService.createProject(req.user, body);
    }

    @Post(':id/validate')
    async validateProject(
        @Request() user,
        @Body() body: ValidationDto,
        @Param('id') id: string,
    ) {
        this.projectsService.validateProject(user.sub, +id, body);
    }
}

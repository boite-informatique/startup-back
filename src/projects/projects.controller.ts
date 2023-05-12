import {
    Body,
    Controller,
    Delete,
    Get,
    Param,
    Patch,
    Post,
    Put,
    Query,
    Request,
} from '@nestjs/common';
import { ProjectsService } from './projects.service';
import { CreateProjectDto } from './dto/create-project.dto';
import { ValidationDto } from './dto/project-validation.dto';
import { UpdateProjectPeriodsDto } from './dto/update-project-periods.dto';
import { UpdateProjectDto } from './dto/update-project.dto';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('projects')
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
        return await this.projectsService.createProject(req.user, body);
    }

    @Post(':id/validate')
    async validateProject(
        @Request() user,
        @Body() body: ValidationDto,
        @Param('id') id: string,
    ) {
        this.projectsService.validateProject(user.sub, +id, body);
    }

    @Get(':id/tasks')
    async getProjectTasks(@Param('id') id: string) {
        this.projectsService.getProjectTasks(+id);
    }

    @Patch(':id')
    async updateProject(
        @Request() req,
        @Body() body: UpdateProjectDto,
        @Param('id') id: string,
    ) {
        return await this.projectsService.updateProject(
            req.user.sub,
            body,
            +id,
        );
    }

    @Get('periods')
    async getProjectPeriods() {
        return await this.projectsService.getProjectPeriods();
    }

    @Put('periods')
    async updateProjectPeriods(@Body() body: UpdateProjectPeriodsDto) {
        return await this.projectsService.updateProjectPeriods(body);}
    @Delete(':id')
    async deleteProject(@Param('id') id: string){
        return await this.projectsService.deleteProject(+id)
    }

}

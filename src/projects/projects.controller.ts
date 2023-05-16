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
import { createDefenseDocument } from 'src/defense-doc/dto/create-defense-doc.dto';
import { CreateProjectProgressDto } from 'src/project-progress/dto/create-project-progress.dto';
import { CreateDefensePlanificationDto } from 'src/defense-planification/dto/create-defense-planification.dto';

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
        @Request() req,
        @Body() body: ValidationDto,
        @Param('id') id: string,
    ) {
        return this.projectsService.validateProject(req.user.sub, +id, body);
    }

    @Get(':id/tasks')
    async getProjectTasks(@Param('id') id: string) {
        return this.projectsService.getProjectTasks(+id);
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

    @Get('settings')
    async getProjectPeriods() {
        return await this.projectsService.getProjectPeriods();
    }

    @Put('settings')
    async updateProjectPeriods(@Body() body: UpdateProjectPeriodsDto) {
        return await this.projectsService.updateProjectPeriods(body);
    }

    @Post(':id/defense-authorization')
    async createDefenseAuthorization(
        @Param('id') projectId: string,
        @Request() req,
        @Body() body,
    ) {
        return await this.projectsService.createDefenseAuthorization(
            body,
            +projectId,
            req.user.sub,
        );
    }

    @Get(':id/defense-doc')
    async getDefenceDocument(@Param('id') id: string) {
        return await this.projectsService.getDefenseDocument(+id);
    }

    @Post(':id/defense-doc')
    async createDefenseDocument(
        @Param('id') id: string,
        @Body() body: createDefenseDocument,
    ) {
        return this.projectsService.createDefenseDocument(+id, body);
    }

    @Get(':id/progress')
    async getProjectProgress(@Param('id') id: string) {
        return await this.projectsService.getProjectProgress(+id);
    }

    @Post(':id/progress')
    async createProjectProgress(
        @Body() body: CreateProjectProgressDto,
        @Param('id') id: string,
        @Request() req,
    ) {
        return await this.projectsService.createProjectProgress(
            body,
            +id,
            req.user.sub,
        );
    }

    @Get(':id/defense-planification')
    async getDefensePlanification(@Param('id') id: string) {
        return this.projectsService.getDefensePlanification(+id);
    }

    @Post(':id/defense-planification')
    async createDefensePlanification(
        @Param('id') id: string,
        @Body() body: CreateDefensePlanificationDto,
    ) {
        return this.projectsService.createDefensePlanification(+id, body);
    }

    @Delete(':id/defense-pllanification')
    async deleteDefensePlanification(@Param('id') id: string) {
        return await this.projectsService.deleteDefensePlanification(+id);
    }
}

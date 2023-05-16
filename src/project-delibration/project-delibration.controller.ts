import {
    Controller,
    Get,
    Post,
    Body,
    Patch,
    Param,
    Delete,
} from '@nestjs/common';
import { ProjectDelibrationService } from './project-delibration.service';
import { CreateProjectDelibrationDto } from './dto/create-project-delibration.dto';
import { UpdateProjectDelibrationDto } from './dto/update-project-delibration.dto';
import { ProjectReserveDto } from './dto/project-reserve.dto';
import { MemberEvaluationDto } from './dto/member-evaluation.dto';
import { UpdateEvaluationDto } from './dto/update-evaluation.dto';

@Controller('project-delibration')
export class ProjectDelibrationController {
    constructor(
        private readonly projectDelibrationService: ProjectDelibrationService,
    ) {}

    @Post()
    async createDelibration(
        @Body() createProjectDelibrationDto: CreateProjectDelibrationDto,
    ) {
        return this.projectDelibrationService.createDelibration(
            createProjectDelibrationDto,
        );
    }
    @Get(':id')
    async findDelibration(@Param('id') id: string) {
        return this.projectDelibrationService.findDelibration(+id);
    }
    @Patch(':id')
    async updateDelibration(
        @Param('id') id: string,
        @Body() body: UpdateProjectDelibrationDto,
    ) {
        return this.projectDelibrationService.updateDelibration(+id, body);
    }
    @Delete(':id')
    async deleteDelibration(@Param('id') id: string) {
        return this.projectDelibrationService.deleteDelibration(+id);
    }
    @Post(':id/reserve')
    async createReserve(
        @Param('id') id: string,
        @Body() body: ProjectReserveDto,
    ) {
        return this.projectDelibrationService.createReserve(+id, body);
    }
    @Delete(':id/reserve')
    async deleteReserve(@Param('id') id: string) {
        return this.projectDelibrationService.deleteReserve(+id);
    }
    @Post('member-evaluation')
    async createEvaluation(@Body() memberEvaluation: MemberEvaluationDto) {
        return this.projectDelibrationService.createEvaluation(
            memberEvaluation,
        );
    }
    @Get('member-evaluation/:id')
    async FindEvaluation(@Param('id') id: string) {
        return this.projectDelibrationService.FindEvaluation(+id);
    }
    @Patch('member-evaluation/:id')
    async updateEvaluation(
        @Param('id') id: string,
        @Body() body: UpdateEvaluationDto,
    ) {
        return this.projectDelibrationService.updateEvaluation(+id, body);
    }
    @Delete('member-evaluation/:id')
    async deleteEvaluation(@Param('id') id: string) {
        return this.projectDelibrationService.deleteEvaluation(+id);
    }
}

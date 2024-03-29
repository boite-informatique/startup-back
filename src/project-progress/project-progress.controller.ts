import { Body, Controller, Delete, Get, Param, Patch } from '@nestjs/common';
import { UpdateProjectProgressDto } from './dto/update-project-progess.dto';
import { ProjectProgressService } from './project-progress.service';

@Controller('project-progress')
export class ProjectProgressController {
    constructor(
        private readonly projectProgressService: ProjectProgressService,
    ) {}

    @Get()
    get() {
        return this.projectProgressService.getProjectProgress();
    }

    @Patch(':id')
    update(
        @Param('id') id: string,
        @Body() updateProjectProgressDto: UpdateProjectProgressDto,
    ) {
        return this.projectProgressService.update(
            +id,
            updateProjectProgressDto,
        );
    }

    @Delete(':id')
    remove(@Param('id') id: string) {
        return this.projectProgressService.remove(+id);
    }
}

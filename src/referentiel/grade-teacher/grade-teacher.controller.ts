import {
    Controller,
    Get,
    Post,
    Body,
    Patch,
    Param,
    Delete,
    Query,
} from '@nestjs/common';
import { GradeTeacherService } from './grade-teacher.service';
import { CreateGradeTeacherDto } from './dto/create-grade-teacher.dto';
import { UpdateGradeTeacherDto } from './dto/update-grade-teacher.dto';
import { Public } from 'src/iam/authentication/decorators/public.decorator';

@Controller('grade-teacher')
export class GradeTeacherController {
    constructor(private readonly gradeTeacherService: GradeTeacherService) {}

    @Post()
    createGradeTeacher(@Body() createGradeTeacherDto: CreateGradeTeacherDto) {
        return this.gradeTeacherService.createGradeTeacher(
            createGradeTeacherDto,
        );
    }

    @Public()
    @Get()
    findAll(@Query('search') search: string) {
        return this.gradeTeacherService.getAllGradeTeacher(search);
    }

    @Get(':id')
    getOneGradeTeacher(@Param('id') id: string) {
        return this.gradeTeacherService.getOneGradeTeacher(+id);
    }

    @Patch(':id')
    updateGradeTeacher(
        @Param('id') id: string,
        @Body() updateGradeTeacherDto: UpdateGradeTeacherDto,
    ) {
        return this.gradeTeacherService.updateGradeTeacher(
            +id,
            updateGradeTeacherDto,
        );
    }

    @Delete(':id')
    deleteGradeTeacher(@Param('id') id: string) {
        return this.gradeTeacherService.deleteGradeTeacher(+id);
    }
}

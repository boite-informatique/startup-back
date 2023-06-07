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
import { GradeStaffService } from './grade-staff.service';
import { CreateGradeStaffDto } from './dto/create-grade-staff.dto';
import { UpdateGradeStaffDto } from './dto/update-grade-staff.dto';
import { Public } from 'src/iam/authentication/decorators/public.decorator';

@Controller('grade-staff')
export class GradeStaffController {
    constructor(private readonly gradeStaffService: GradeStaffService) {}

    @Post()
    createGradeStaff(@Body() createGradeStaffDto: CreateGradeStaffDto) {
        return this.gradeStaffService.createGradeStaff(createGradeStaffDto);
    }

    @Public()
    @Get()
    findAll(@Query('search') search: string) {
        return this.gradeStaffService.getAllGradeStaff(search);
    }

    @Get(':id')
    getOneGradeStaff(@Param('id') id: string) {
        return this.gradeStaffService.getOneGradeStaff(+id);
    }

    @Patch(':id')
    updateGradeStaff(
        @Param('id') id: string,
        @Body() updateGradeStaffDto: UpdateGradeStaffDto,
    ) {
        return this.gradeStaffService.updateGradeStaff(
            +id,
            updateGradeStaffDto,
        );
    }

    @Delete(':id')
    deleteGradeStaff(@Param('id') id: string) {
        return this.gradeStaffService.deleteGradeStaff(+id);
    }
}

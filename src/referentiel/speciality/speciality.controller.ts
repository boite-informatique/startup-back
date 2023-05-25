import {
    Controller,
    Get,
    Post,
    Body,
    Patch,
    Param,
    Delete,
} from '@nestjs/common';
import { SpecialityService } from './speciality.service';
import { CreateSpecialityDto } from './dto/create-speciality.dto';
import { UpdateSpecialityDto } from './dto/update-speciality.dto';

@Controller('speciality')
export class SpecialityController {
    constructor(private readonly specialityService: SpecialityService) {}

    @Post()
    createSpeciality(@Body() createSpecialityDto: CreateSpecialityDto) {
        return this.specialityService.createSpeciality(createSpecialityDto);
    }

    @Get()
    getAllSpecialities() {
        return this.specialityService.getAllSpecialities();
    }

    @Get(':id')
    getOneSpeciality(@Param('id') id: string) {
        return this.specialityService.getOneSpeciality(+id);
    }

    @Patch(':id')
    updateSpeciality(
        @Param('id') id: string,
        @Body() updateSpecialityDto: UpdateSpecialityDto,
    ) {
        return this.specialityService.updateSpeciality(
            +id,
            updateSpecialityDto,
        );
    }

    @Delete(':id')
    deleteSpeciality(@Param('id') id: string) {
        return this.specialityService.deleteSpeciality(+id);
    }
}

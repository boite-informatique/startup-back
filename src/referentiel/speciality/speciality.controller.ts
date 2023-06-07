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
import { SpecialityService } from './speciality.service';
import { CreateSpecialityDto } from './dto/create-speciality.dto';
import { UpdateSpecialityDto } from './dto/update-speciality.dto';
import { Public } from 'src/iam/authentication/decorators/public.decorator';

@Controller('speciality')
export class SpecialityController {
    constructor(private readonly specialityService: SpecialityService) {}

    @Post()
    createSpeciality(@Body() createSpecialityDto: CreateSpecialityDto) {
        return this.specialityService.createSpeciality(createSpecialityDto);
    }

    @Public()
    @Get()
    getAllSpecialities(@Query('search') search: string) {
        return this.specialityService.getAllSpecialities(search);
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

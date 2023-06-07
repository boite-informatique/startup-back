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
import { FiliereService } from './filiere.service';
import { CreateFiliereDto } from './dto/create-filiere.dto';
import { UpdateFiliereDto } from './dto/update-filiere.dto';
import { Public } from 'src/iam/authentication/decorators/public.decorator';

@Controller('filiere')
export class FiliereController {
    constructor(private readonly filiereService: FiliereService) {}

    @Post()
    create(@Body() createFiliereDto: CreateFiliereDto) {
        return this.filiereService.createFiliere(createFiliereDto);
    }

    @Public()
    @Get()
    findAll(@Query('search') search: string) {
        return this.filiereService.getAllFiliere(search);
    }

    @Get(':id')
    findOne(@Param('id') id: string) {
        return this.filiereService.getOneFiliere(+id);
    }

    @Patch(':id')
    update(
        @Param('id') id: string,
        @Body() updateFiliereDto: UpdateFiliereDto,
    ) {
        return this.filiereService.updateFiliere(+id, updateFiliereDto);
    }

    @Delete(':id')
    remove(@Param('id') id: string) {
        return this.filiereService.deleteFiliere(+id);
    }
}

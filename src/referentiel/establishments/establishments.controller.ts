import {
    Body,
    Controller,
    Delete,
    Get,
    Param,
    Patch,
    Post,
    Query,
} from '@nestjs/common';
import { EstablishmentsService } from './establishments.service';
import { Public } from 'src/iam/authentication/decorators/public.decorator';
import { CreateEstablishmentDto } from './dto/create-establishment.dto';
import { UpdateEstablishmentDto } from './dto/update-establishment.dto';

@Controller('establishments')
export class EstablishmentsController {
    constructor(
        private readonly establishmentsService: EstablishmentsService,
    ) {}

    @Post()
    create(@Body() createEstablishmentDto: CreateEstablishmentDto) {
        return this.establishmentsService.createEstablishment(
            createEstablishmentDto,
        );
    }

    @Public()
    @Get()
    async getEstablishments(@Query('search') search: string) {
        return await this.establishmentsService.getEstablishments(search);
    }

    @Get(':id')
    findOne(@Param('id') id: string) {
        return this.establishmentsService.getOneEstablishment(+id);
    }

    @Patch(':id')
    update(
        @Param('id') id: string,
        @Body() updateEstablishmentDto: UpdateEstablishmentDto,
    ) {
        return this.establishmentsService.updateEstablishment(
            +id,
            updateEstablishmentDto,
        );
    }

    @Delete(':id')
    remove(@Param('id') id: string) {
        return this.establishmentsService.deleteEstablishment(+id);
    }
}

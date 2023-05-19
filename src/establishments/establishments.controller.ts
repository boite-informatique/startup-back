import { Controller, Get, Query } from '@nestjs/common';
import { EstablishmentsService } from './establishments.service';
import { Public } from 'src/iam/authentication/decorators/public.decorator';

@Controller('establishments')
export class EstablishmentsController {
    constructor(
        private readonly establishmentsService: EstablishmentsService,
    ) {}

    @Public()
    @Get()
    async getEstablishments(@Query('search') search: string) {
        return await this.establishmentsService.getEstablishments(search);
    }
}

import { Controller, Get, Query } from '@nestjs/common';
import { EstablishmentsService } from './establishments.service';

@Controller('establishments')
export class EstablishmentsController {
    constructor(
        private readonly establishmentsService: EstablishmentsService,
    ) {}

    @Get()
    async getEstablishments(@Query('search') search: string) {
        return await this.establishmentsService.getEstablishments(search);
    }
}

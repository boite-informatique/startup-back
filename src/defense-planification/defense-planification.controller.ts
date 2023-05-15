import { Body, Controller, Delete, Get, Param, Patch } from '@nestjs/common';
import { DefensePlanificationService } from './defense-planification.service';
import { UpdateDefencePlanificationDto } from './dto/update-defense-planification.dto';

@Controller('defense-planification')
export class DefensePlanificationController {
    constructor(
        private readonly defesePlanificationService: DefensePlanificationService,
    ) {}

    @Get()
    async getDefencePlanification() {
        return await this.defesePlanificationService.getDefencePlanification();
    }

    @Get(':id')
    async getOneDefencePlanification(@Param('id') id: string) {
        return await this.defesePlanificationService.getOneDefencePlanification(
            +id,
        );
    }

    @Patch(':id')
    async updateDefencePlanification(
        @Body() body: UpdateDefencePlanificationDto,
        @Param('id') id: string,
    ) {
        return await this.defesePlanificationService.updateDefencePlanification(
            body,
            +id,
        );
    }

    @Delete(':id')
    async deleteDefencePlanification(@Param('id') id: string) {
        return await this.defesePlanificationService.deleteDefencePlanification(
            +id,
        );
    }
}

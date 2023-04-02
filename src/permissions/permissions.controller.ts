import { Controller, Get } from '@nestjs/common';
import { PermissionsOutput } from './dto/permissions-output.dto';
import { PermissionsService } from './permissions.service';

@Controller('permissions')
export class PermissionsController {
    constructor(private readonly permissionsService: PermissionsService) {}

    @Get()
    async findAll(): Promise<PermissionsOutput[]> {
        return await this.permissionsService.findAllPermissions();
    }
}

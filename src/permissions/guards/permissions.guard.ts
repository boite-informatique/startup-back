import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Observable } from 'rxjs';
import { REQUIRED_PERMISSIONS_KEY } from 'src/permissions/decorators/required-permissions.decorator';
import { PermissionsService } from 'src/permissions/permissions.service';

@Injectable()
export class PermissionsGuard implements CanActivate {
    constructor(
        private readonly reflector: Reflector,
        private readonly permissionService: PermissionsService,
    ) {}
    async canActivate(context: ExecutionContext): Promise<boolean> {
        const requiredPermission =
            this.reflector.get<string>(
                REQUIRED_PERMISSIONS_KEY,
                context.getHandler(),
            ) ||
            this.reflector.get<string>(
                REQUIRED_PERMISSIONS_KEY,
                context.getClass(),
            );

        const { userId } = context.switchToHttp().getRequest().user;

        console.log(userId, requiredPermission);

        return await this.permissionService.checkUserPermission(
            +userId,
            requiredPermission,
        );
    }
}

import { SetMetadata } from '@nestjs/common';

export const REQUIRED_PERMISSIONS_KEY = 'REQUIRED_PERMISSIONS';

export const RequirePermissions = (permissionName: string) =>
    SetMetadata(REQUIRED_PERMISSIONS_KEY, permissionName);

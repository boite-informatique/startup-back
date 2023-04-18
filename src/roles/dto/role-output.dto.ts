import { PermissionsOutput } from 'src/permissions/dto/permissions-output.dto';

export class Role {
    id: number;
    name: string;
}

export class RoleWithPermissionsAndUserCount extends Role {
    permissions: PermissionsOutput[];
    _count: {
        permissions: number;
        users: number;
    };
}

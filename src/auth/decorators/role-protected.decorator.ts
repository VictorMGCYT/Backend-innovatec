import { SetMetadata } from '@nestjs/common';
import { UserRoles } from '../interfaces/user-roles.interface';

// ! Este decorador se encarga de colocar los metadatos para así hacer la validación de roles

export const META_ROLES = 'roles';

export const RoleProtected = (...args: UserRoles[]) => {

    // Se asgina la metadata que resivirá
    return SetMetadata(META_ROLES, args);

}



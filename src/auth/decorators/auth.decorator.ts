import { applyDecorators, SetMetadata, UseGuards } from '@nestjs/common';
import { RoleProtected } from './role-protected.decorator';
import { UserRoles } from '../interfaces/user-roles.interface';
import { AuthGuard } from '@nestjs/passport';
import { UserRoleGuard } from '../guards/user-role.guard';



export const Auth = (...roles: UserRoles[]) => {

    return applyDecorators(

        RoleProtected(...roles), // ! Esto solo asigna la metadata
        UseGuards( AuthGuard(), UserRoleGuard ) // El segundo parametro es para validar la metadata

    )

};

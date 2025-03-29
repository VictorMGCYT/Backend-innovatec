import { BadRequestException, CanActivate, ExecutionContext, ForbiddenException, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Observable } from 'rxjs';
import { META_ROLES } from '../decorators/role-protected.decorator';
import { Users } from '../entities/auth.entity';
import { CssSyntaxError } from 'postcss';

@Injectable()
export class UserRoleGuard implements CanActivate {


  constructor(
    private readonly reflector: Reflector,
  ){}


  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {

    // extraemos la metadata 'roles' o sea lo que se pasó por parametros
    //  en el Auth( -lo de aquí- )
    const roleAsigned: string[] = this.reflector.getAllAndOverride(META_ROLES, [
      context.getHandler(),
      context.getClass(),
    ])

    const request = context.switchToHttp().getRequest();
    const user = request.user as Users;

    if(!user){
      throw new BadRequestException()
    }

    if(roleAsigned.length === 0){
      return true
    }

    if(user.role.includes(String(roleAsigned)) ){
      return true
    }

    throw new ForbiddenException(
      `User with email ${user.email} does't have a valid role like ${roleAsigned}`
    )
  }
}

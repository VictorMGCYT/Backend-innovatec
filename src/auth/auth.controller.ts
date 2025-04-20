import { Controller, Get, Post, Body, Patch, Param, Delete, Req, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { GetUser } from './decorators/get-user.decorator';
import { Auth } from './decorators/auth.decorator';
import { UserRoles } from './interfaces/user-roles.interface';
import { UpdatePasswordDto } from './dto/update-password.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  loginUser(@Body() loginDto: LoginDto){

    return this.authService.login(loginDto)

  }


  @Get('perfil')
  @Auth( UserRoles.COMPANY )
  validStrategy( 
    @GetUser() user
  ){
    return user
  }

  @Patch('update-password')
  @Auth()
  changePassword( @Body() updatePasswordDto: UpdatePasswordDto){
    return this.authService.changePassword(updatePasswordDto);
  }
}

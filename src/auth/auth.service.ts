import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateAuthDto } from './dto/create-auth.dto';
import { UpdateAuthDto } from './dto/update-auth.dto';
import { LoginDto } from './dto/login.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Users } from './entities/auth.entity';
import { Repository } from 'typeorm';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt'
import { JwtPayload } from './interfaces/jwt-payload.interface';

@Injectable()
export class AuthService {
  
  constructor(
    @InjectRepository(Users)
    private readonly userRepository: Repository<Users>,

    private readonly  jwtService: JwtService
  ){}

  async login(loginDto: LoginDto){

    const { email, password } = loginDto;

    // Buscamos el usuario con ese email y devolvemos solo password, email e id
    const user = await this.userRepository.findOne({
      where: {email},
      select: { password: true, email: true, id: true }
    })

    // Verificamos si el usuario existe en la base de datos y si la 
    // contraseña hace match
    if(!user){
      throw new BadRequestException(`User with email: ${email} doesn't exist`)
    }
    if( !bcrypt.compareSync(password, user.password) ){
      throw new BadRequestException(`Password is't valid`)
    }

    return {
      id: user.id,
      email: user.email,
      token: this.getJwt( { email: user.email, id: user.id } )
    };

  }

  private getJwt( payload: JwtPayload ) {
    
    // Aquí firmamos el token con nuestra palabra secreta
    const token = this.jwtService.sign(payload);
    // y devolvemos el token
    return token;

  }

}

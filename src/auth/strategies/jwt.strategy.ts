import { PassportStrategy } from "@nestjs/passport";
import { InjectRepository } from "@nestjs/typeorm";
import { ExtractJwt, Strategy } from "passport-jwt";
import { Users } from "../entities/auth.entity";
import { Repository } from "typeorm";
import { JwtPayload } from "../interfaces/jwt-payload.interface";
import { ConfigService } from "@nestjs/config";
import { InternalServerErrorException, UnauthorizedException } from "@nestjs/common";



export class JwtStrategy extends PassportStrategy(Strategy) {

    constructor(
        @InjectRepository(Users)
        private readonly userRepository: Repository<Users>,

        configService: ConfigService
    ){
        // Extraemos la palabra secreta de las varibales de entorno
        const jwtSecret = configService.get('SECRETJWT_KEY')

        if (!jwtSecret) {
            throw new InternalServerErrorException('JWT_SECRET is not defined in the configuration.');
        }

        super({
            secretOrKey: jwtSecret,
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
        })
    }

    async validate(payload: JwtPayload): Promise<Users> {
        const { email, id } = payload
        const user = await this.userRepository.findOneBy({id});

        if (!user) {
            throw new UnauthorizedException('Token not valid')
        }
        if (!user.isActive) {
            throw new UnauthorizedException('User is inActive')
        }

        return user;
    }   

}
import { createParamDecorator, ExecutionContext, InternalServerErrorException } from "@nestjs/common";
import * as request from 'supertest';



export const GetUser = createParamDecorator(
    (data, context: ExecutionContext) => {

        // El usuario es colocado en la request por la Strategy
        // Ahora lo vamos a extraer para poder invocarlo facilmente en los parámetros de métodos
        const request = context.switchToHttp().getRequest();
        const user = request.user;

        if( !user ){
            throw new InternalServerErrorException('User not found in request')
        }

        return user;

    }
)
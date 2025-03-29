import { createParamDecorator, ExecutionContext } from "@nestjs/common";



export const GetUser = createParamDecorator(
    (data, context: ExecutionContext) => {

        // Todo extraer el usuario de la request, pero primero hacer la strategy

    }
)
import { IsString, IsStrongPassword } from "class-validator";

export class UpdatePasswordDto {


    @IsString()
    id: string;

    @IsString()
    password: string;

    @IsString()
    @IsStrongPassword({
            minLength: 6,
            minLowercase: 1,
            minUppercase: 1,
            minNumbers: 1,
            minSymbols: 0,
        },
        {
            message: "New password must be contain min 6 chacacters, 1 letter in lowercase, 1 letter in uppercase and 1 number"
        })
    newPassword: string;
}

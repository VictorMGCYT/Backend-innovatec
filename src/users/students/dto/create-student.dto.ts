import { IsArray, IsBoolean, IsEmail, IsEnum, IsOptional, IsString, IsStrongPassword, MaxLength, MinLength } from "class-validator";
import { UserRoles } from "src/auth/interfaces/user-roles.interface";


export class CreateStudentDto {

    @IsString()
    @MinLength(1)
    firstName: string;

    @IsString()
    @MinLength(1)
    paternalSurname: string;

    @IsString()
    @MinLength(1)
    maternalSurname: string;

    @IsString()
    @MinLength(1)
    career: string;

    @IsArray()
    @IsOptional()
    skills?: string[];

    @IsArray()
    @IsOptional()
    languages?: string[];

    @IsString()
    @IsOptional()
    cv_url?: string;

    @IsString()
    @IsEmail()
    @MaxLength(255)
    contact_email: string;

    @IsString()
    @MinLength(10)
    @MaxLength(10)
    phone_number: string;

    @IsEnum(UserRoles)
    @IsOptional()
    role?: string;

    @IsString()
    @IsStrongPassword({
        minLength: 6,
        minLowercase: 1,
        minUppercase: 1,
        minNumbers: 1,
        minSymbols: 0,
    },
    {
        message: "Password must be contain min 6 chacacters, 1 letter in lowercase, 1 letter in uppercase and 1 number"
    })
    password: string;

}

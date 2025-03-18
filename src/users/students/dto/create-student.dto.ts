import { IsBoolean, IsEmail, IsOptional, IsString, MaxLength, MinLength } from "class-validator";


export class CreateStudentDto {

    @IsString()
    @MinLength(1)
    name: string;

    @IsString()
    @MinLength(1)
    career: string;

    @IsString()
    @IsOptional()
    skills?: string;

    @IsString()
    @IsOptional()
    languages?: string;

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


}

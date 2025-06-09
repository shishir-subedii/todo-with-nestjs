import { IsEmail, MinLength } from "class-validator";

export class CreateUserDto {
    @MinLength(3, { message: 'Name must be at least 3 characters long' })
    name: string;

    @IsEmail({}, { message: 'Invalid email format' })
    email: string;

    @MinLength(6, { message: 'Password must be at least 6 characters long' })
    password: string;
}

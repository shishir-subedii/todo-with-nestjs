import { IsEmail, IsNotEmpty } from "class-validator";

export class SignupDTO {
    @IsNotEmpty({
        message: 'Name is required'
    })
    name: string;

    @IsEmail({}, {
        message: 'Invalid email format'
    })
    email: string;

    @IsNotEmpty({message: 'Password is required'})
    password: string;
}

export class LoginDTO {
    @IsEmail({}, {
        message: 'Invalid email format'
    })
    email: string;

    @IsNotEmpty({
        message: 'Password is required'
    })
    password: string;
}
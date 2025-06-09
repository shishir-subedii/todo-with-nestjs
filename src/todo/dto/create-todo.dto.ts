import {  IsBoolean, IsDate, IsNumber, IsOptional, IsString, MinLength } from "class-validator";
import {Type} from 'class-transformer'
export class CreateTodoDto {
    @IsNumber()
    @IsOptional()
    userId?: number;

    @IsString()
    @MinLength(3, {message: 'Title must be at least 3 characters long'})
    title: string;

    @IsString()
    @MinLength(3, { message: 'Title must be at least 3 characters long' })
    description: string;

    @IsBoolean()
    @IsOptional()
    @Type(() => Boolean)
    completed?: boolean;

    @IsDate()
    @IsOptional()
    @Type(() => Date)
    date?: Date;
}

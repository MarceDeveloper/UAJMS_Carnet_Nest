import { IsString, IsNotEmpty, IsEmail, IsArray, ArrayMinSize, IsInt } from 'class-validator';

export class CreateUserDto {
  @IsString()
  @IsNotEmpty()
  username: string;

  @IsString()
  @IsNotEmpty()
  password: string;

  @IsEmail()
  email: string;

  @IsArray()
  @ArrayMinSize(1)
  @IsInt({ each: true }) // Asegurarse de que cada valor en roles sea un entero
  roles: number[];
}

import { IsString, IsNotEmpty } from 'class-validator';

export class CreateRolDto {
  @IsString()
  @IsNotEmpty()
  name: string;
}

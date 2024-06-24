import {
  IsString,
  IsNotEmpty,
  IsEmail,
  IsArray,
  ArrayMinSize,
  IsInt,
  IsOptional,
  IsDateString,
  Length,
} from 'class-validator';

export class CreateUserDto {
  @IsString()
  @IsNotEmpty()
  username: string;

  @IsString()
  @IsNotEmpty()
  password: string;

  @IsEmail()
  email: string;

  @IsString()
  @IsNotEmpty()
  nombre: string;

  @IsString()
  @IsNotEmpty()
  apellido: string;

  @IsDateString()
  fecha_nacimiento: string;

  @IsString()
  @IsOptional()
  direccion?: string;

  @IsString()
  @IsOptional()
  ci?: string;

  @IsString()
  @IsOptional()
  foto_perfil?: string;

  @IsString()
  @IsOptional()
  foto_baner?: string;

  @IsString()
  @IsOptional()
  @Length(0, 50)
  color_tema?: string;

  @IsString()
  @IsNotEmpty()
  @Length(0, 50)
  celular: string;

  @IsInt()
  @IsOptional()
  contador_interaccion_correo?: number;

  @IsInt()
  @IsOptional()
  contador_interaccion_whatsapp?: number;

  @IsInt()
  @IsOptional()
  contador_interaccion_telefono?: number;

  @IsInt()
  @IsOptional()
  contador_interaccion_direccion?: number;

  @IsArray()
  @ArrayMinSize(1)
  @IsInt({ each: true })
  roles: number[];
}

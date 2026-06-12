import { IsEmail, IsOptional, IsString, MaxLength, MinLength } from 'class-validator';

// El campo "role" NO se expone aqui a proposito: con whitelist activo,
// cualquier intento de escalar privilegios via body es rechazado.
export class UpdateUserDto {
  @IsOptional()
  @IsString()
  @MinLength(2)
  @MaxLength(80)
  name?: string;

  @IsOptional()
  @IsEmail()
  @MaxLength(254)
  email?: string;

  @IsOptional()
  @IsString()
  @MinLength(8)
  @MaxLength(72)
  password?: string;
}

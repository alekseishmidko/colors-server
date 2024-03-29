import { IsEmail, IsString, MinLength } from 'class-validator';

export class AuthDto {
  @IsEmail()
  email: string;

  @MinLength(2, {
    message: 'name`s length should be more then 2 symbols',
  })
  @IsEmail()
  name: string;

  @MinLength(6, {
    message: 'password`s length should be more then 6 symbols',
  })
  @IsString()
  password: string;
}

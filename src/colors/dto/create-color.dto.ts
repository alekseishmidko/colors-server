import { IsHexColor, IsOptional, IsString } from 'class-validator';

export class CreateColorDto {
  @IsString()
  @IsHexColor()
  hex: string;

  @IsOptional()
  @IsString()
  name?: string;
}

import { IsString } from 'class-validator';

export class PaletteDto {
  @IsString()
  name: string;
}

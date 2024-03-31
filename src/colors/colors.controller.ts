import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  Param,
  Patch,
  Post,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { ColorsService } from './colors.service';
import { Auth } from 'src/auth/decorators/auth.decorator';
import { CurrentUser } from 'src/auth/decorators/user.decorator';
import { CreateColorDto } from './dto/create-color.dto';

@Controller('colors')
export class ColorsController {
  constructor(private readonly colorsService: ColorsService) {}

  @Get(':paletteId/:id')
  @Auth()
  async getById(
    @Param('paletteId') paletteId: string,
    @Param('id') id: string,
    @CurrentUser('id') userId: string,
  ) {
    return this.colorsService.getById(paletteId, id, userId);
  }

  @UsePipes(new ValidationPipe())
  @HttpCode(200)
  @Post(':id')
  @Auth()
  async create(
    @Body() dto: CreateColorDto,
    @Param('id') paletteId: string,
    @CurrentUser('id') userId: string,
  ) {
    return this.colorsService.create(dto, paletteId, userId);
  }

  @UsePipes(new ValidationPipe())
  @HttpCode(200)
  @Patch(':paletteId/:id')
  @Auth()
  async update(
    @Body() dto: CreateColorDto,
    @Param('paletteId') paletteId: string,
    @Param('id') id: string,
    @CurrentUser('id') userId: string,
  ) {
    return this.colorsService.update(dto, paletteId, id, userId);
  }

  @HttpCode(200)
  @Delete(':paletteId/:id')
  @Auth()
  async delete(
    @Param('paletteId') paletteId: string,
    @Param('id') id: string,
    @CurrentUser('id') userId: string,
  ) {
    return this.colorsService.delete(paletteId, id, userId);
  }
}

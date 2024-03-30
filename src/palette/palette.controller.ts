import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  Param,
  Post,
  Put,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { PaletteService } from './palette.service';
import { Auth } from 'src/auth/decorators/auth.decorator';
import { CurrentUser } from 'src/auth/decorators/user.decorator';
import { PaletteDto } from './dto/palette.dto';

@Controller('palette')
export class PaletteController {
  constructor(private readonly paletteService: PaletteService) {}

  @Get()
  @Auth()
  async getAll(@CurrentUser('id') userId: string) {
    return this.paletteService.getAll(userId);
  }

  @UsePipes(new ValidationPipe())
  @HttpCode(200)
  @Post()
  @Auth()
  async create(@Body() dto: PaletteDto, @CurrentUser('id') userId: string) {
    return this.paletteService.create(dto, userId);
  }
  @Get(':id')
  @Auth()
  async getById(@Param('id') id: string, @CurrentUser('id') userId: string) {
    return this.paletteService.getById(id, userId);
  }

  @UsePipes(new ValidationPipe())
  @HttpCode(200)
  @Put(':id')
  @Auth()
  async edit(
    @Body() dto: PaletteDto,
    @CurrentUser('id') userId: string,
    @Param('id') id: string,
  ) {
    return this.paletteService.edit(dto, userId, id);
  }

  @HttpCode(200)
  @Delete(':id')
  @Auth()
  async delete(@Param('id') id: string, @CurrentUser('id') userId: string) {
    return this.paletteService.delete(id, userId);
  }
}

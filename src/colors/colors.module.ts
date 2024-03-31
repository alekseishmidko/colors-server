import { Module } from '@nestjs/common';
import { ColorsService } from './colors.service';
import { ColorsController } from './colors.controller';
import { PrismaService } from 'src/prisma.service';
import { PaletteService } from 'src/palette/palette.service';

@Module({
  controllers: [ColorsController],
  providers: [ColorsService, PrismaService, PaletteService],
})
export class ColorsModule {}

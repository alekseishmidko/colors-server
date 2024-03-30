import { Module } from '@nestjs/common';
import { PaletteService } from './palette.service';
import { PaletteController } from './palette.controller';
import { PrismaService } from 'src/prisma.service';

@Module({
  controllers: [PaletteController],
  providers: [PaletteService, PrismaService],
})
export class PaletteModule {}

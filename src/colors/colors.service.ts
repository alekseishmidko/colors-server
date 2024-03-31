import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';
import { CreateColorDto } from './dto/create-color.dto';
import { PaletteService } from 'src/palette/palette.service';
import axios from 'axios';
import { COLOR_API_URL } from 'src/main';

@Injectable()
export class ColorsService {
  constructor(
    private prisma: PrismaService,
    private paletteService: PaletteService,
  ) {}
  transformHex(hex: string) {
    return hex.startsWith('#') ? hex.slice(1) : hex;
  }
  async determineColorName(hex: string) {
    const res = await axios.get(COLOR_API_URL(hex));
    if (res.data.code === 400) {
      return `unknown`;
    } else {
      return `${res.data.name.value}${res.data.name.distance === 0 ? '' : `_${res.data.name.distance}`}`;
    }
  }

  async isExistColorInPalette(id: string, userId: string, dto: CreateColorDto) {
    const palette = await this.paletteService.getById(id, userId);
    if (!palette) {
      throw new NotFoundException('Palette not found');
    }
    return !!palette.color.find((color) => color.hex === dto.hex);
  }

  async isPermit(paletteId: string, userId: string, colorId: string) {
    const palette = await this.paletteService.getById(paletteId, userId);
    return !!palette.color.find((color) => color.id === colorId);
  }

  async getById(paletteId: string, id: string, userId: string) {
    const permit = await this.isPermit(paletteId, userId, id);
    if (!permit) throw new ForbiddenException('Forbidden operation');
    return this.prisma.color.findUnique({ where: { id, paletteId } });
  }

  async create(dto: CreateColorDto, paletteId: string, userId: string) {
    const hex = this.transformHex(dto.hex);
    const isColorExist = await this.isExistColorInPalette(
      paletteId,
      userId,
      dto,
    );
    if (isColorExist)
      throw new BadRequestException(
        'this HEX color is already exist in palette',
      );
    return this.prisma.color.create({
      data: {
        hex,
        name: dto?.name || (await this.determineColorName(hex)),
        palette: { connect: { id: paletteId } },
      },
    });
  }

  async delete(paletteId: string, id: string, userId: string) {
    const permit = await this.isPermit(paletteId, userId, id);
    if (!permit) throw new ForbiddenException('Forbidden operation');
    return this.prisma.color.delete({ where: { id } });
  }

  async update(
    dto: CreateColorDto,
    paletteId: string,
    id: string,
    userId: string,
  ) {
    const permit = await this.isPermit(paletteId, userId, id);
    if (!permit) throw new ForbiddenException('Forbidden operation');
    return this.prisma.color.update({
      where: { id, paletteId },
      data: { hex: this.transformHex(dto.hex), name: dto.name },
    });
  }
}

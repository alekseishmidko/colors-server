import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';
import { PaletteDto } from './dto/palette.dto';
@Injectable()
export class PaletteService {
  constructor(private prisma: PrismaService) {}

  getById(id: string, userId: string) {
    return this.prisma.palette.findUnique({
      where: { id, userId },
      include: { color: { orderBy: { id: 'desc' } } },
    });
  }

  async getAll(userId: string) {
    return this.prisma.palette.findMany({
      where: { userId },
      include: { color: { orderBy: { id: 'desc' } } },
    });
  }

  async create(dto: PaletteDto, userId: string) {
    return this.prisma.palette.create({
      data: { ...dto, user: { connect: { id: userId } } },
    });
  }

  async edit(dto: PaletteDto, userId: string, id: string) {
    return this.prisma.palette.update({
      where: { id, userId },
      data: { name: dto.name },
    });
  }

  async delete(id: string, userId: string) {
    return this.prisma.$transaction([
      this.prisma.color.deleteMany({
        where: { paletteId: id },
      }),
      this.prisma.palette.delete({
        where: { id, userId },
      }),
    ]);
  }
}

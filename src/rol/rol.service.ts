import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateRolDto } from './dto/create-rol.dto';
import { UpdateRolDto } from './dto/update-rol.dto';

@Injectable()
export class RolService {
  constructor(private readonly prisma: PrismaService) {}

  async create(createRolDto: CreateRolDto) {
    return this.prisma.role.create({
      data: {
        name: createRolDto.name,
      },
    });
  }

  async findAll() {
    return this.prisma.role.findMany();
  }

  async findOne(id: number) {
    return this.prisma.role.findUnique({
      where: { id },
    });
  }

  async update(id: number, updateRolDto: UpdateRolDto) {
    return this.prisma.role.update({
      where: { id },
      data: {
        name: updateRolDto.name,
      },
    });
  }

  async remove(id: number) {
    return this.prisma.role.delete({
      where: { id },
    });
  }
}

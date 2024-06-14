import { Injectable, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import * as bcrypt from 'bcrypt';
import { is_validateRoles } from '../common/utils/validate-roles.util';

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}

  async create(createUserDto: CreateUserDto) {
    const { roles, ...userData } = createUserDto;
    const rolesAreValid = await is_validateRoles(this.prisma, roles);

    if (!rolesAreValid) {
      throw new BadRequestException('One or more roles are invalid');
    }

    const hashedPassword = await bcrypt.hash(createUserDto.password, 10);

    const user = await this.prisma.user.create({
      data: {
        ...userData,
        password: hashedPassword,
        roles: {
          create: roles.map(roleId => ({
            role: { connect: { id: roleId } }
          }))
        },
      },
      include: { roles: { include: { role: true } } },
    });

    return user;
  }

  async findAll() {
    return this.prisma.user.findMany({
      include: { roles: { include: { role: true } } },
    });
  }

  async findOne(id: number) {
    return this.prisma.user.findUnique({
      where: { id },
      include: { roles: { include: { role: true } } },
    });
  }

  async findOne_by_username(username: string) {
    return this.prisma.user.findUnique({
      where: { username },
      include: { roles: { include: { role: true } } },
    });
  }

  async update(id: number, updateUserDto: UpdateUserDto) {
    const { roles, ...userData } = updateUserDto;
    const rolesAreValid = roles ? await is_validateRoles(this.prisma, roles) : true;

    if (!rolesAreValid) {
      throw new BadRequestException('One or more roles are invalid');
    }

    if (userData.password) {
      userData.password = await bcrypt.hash(userData.password, 10);
    }

    return this.prisma.user.update({
      where: { id },
      data: {
        ...userData,
        roles: roles ? {
          deleteMany: {}, // Remove existing roles
          create: roles.map(roleId => ({
            role: { connect: { id: roleId } }
          }))
        } : undefined,
      },
      include: { roles: { include: { role: true } } },
    });
  }

  async remove(id: number) {
    return this.prisma.user.delete({
      where: { id },
      include: { roles: true },
    });
  }
}

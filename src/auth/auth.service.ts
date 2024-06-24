import { Injectable, UnauthorizedException, BadRequestException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from '../prisma/prisma.service';
import { LoginDto } from './dto/login.dto';
import { CreateUserDto } from '../users/dto/create-user.dto';
import * as bcrypt from 'bcrypt';
import { is_validateRoles } from '../common/utils/validate-roles.util';
import { secret_key_auth, time_expired_jwt } from '../../config_api/config_auth';
import { create_auth_payload, UserWithRoles } from './utils/create_auth_payload';

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService,
  ) {}

  async validateUser(username: string, password: string): Promise<UserWithRoles | null> {
    const user = await this.prisma.user.findUnique({
      where: { username },
      include: {
        roles: {
          include: {
            role: true,
          },
        },
      },
    });

    if (user && await bcrypt.compare(password, user.password)) {
      const userWithRoles: UserWithRoles = {
        ...user,
        roles: user.roles.map((userRole) => userRole.role),
      };
      return userWithRoles;
    }
    return null;
  }

  async login(loginDto: LoginDto) {
    const { username, password } = loginDto;
    const user = await this.validateUser(username, password);
    if (!user) {
      throw new UnauthorizedException('Invalid username or password');
    }

    const payload = create_auth_payload(user);
    const accessToken = this.jwtService.sign(payload, { expiresIn: time_expired_jwt });

    return {
      access_token: accessToken,
      data_sesion : {
        userId: user.id,
        username: user.username,
        roles: user.roles,
      }
    };
  }

  async register(createUserDto: CreateUserDto) {
    const { username, email, password, roles } = createUserDto;
    const hashedPassword = await bcrypt.hash(password, 10);

    if (!(await is_validateRoles(this.prisma, roles))) {
      throw new BadRequestException('One or more roles are invalid');
    }

    const user = await this.prisma.user.create({
      data: {
        username,
        email,
        password: hashedPassword,
        roles: {
          create: roles.map(roleId => ({
            role: { connect: { id: roleId } }
          }))
        }
      },
      include: {
        roles: {
          include: {
            role: true
          }
        }
      }
    });

    const userWithRoles: UserWithRoles = {
      ...user,
      roles: user.roles.map((userRole) => userRole.role),
    };

    return { username: userWithRoles.username, email: userWithRoles.email, roles: userWithRoles.roles };
  }
}

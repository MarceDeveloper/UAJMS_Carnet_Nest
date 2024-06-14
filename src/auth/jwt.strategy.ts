import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { JwtService } from '@nestjs/jwt';
import { Request } from 'express';
import { PrismaService } from '../prisma/prisma.service';
import { secret_key_auth, time_expired_jwt, time_refres_token } from '../../config_api/config_auth';
import { create_auth_payload, UserWithRoles } from './utils/create_auth_payload';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private prisma: PrismaService, private jwtService: JwtService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: secret_key_auth,
      passReqToCallback: true,
    });
  }

  async validate(req: Request, payload: any) {
    const user = await this.prisma.user.findUnique({
      where: { id: payload.sub },
      include: {
        roles: {
          include: {
            role: true,
          },
        },
      },
    });

    if (!user) {
      throw new UnauthorizedException('User not found');
    }

    const userWithRoles: UserWithRoles = {
      ...user,
      roles: user.roles.map((userRole) => userRole.role),
    };

    // Check token expiration
    const token = req.headers.authorization.split(' ')[1];
    const decodedToken = this.jwtService.decode(token, { complete: true }) as any;
    const exp = decodedToken.payload.exp;
    const currentTime = Math.floor(Date.now() / 1000);
    const expDate = new Date(exp * 1000).toLocaleString();
    const currentDate = new Date(currentTime * 1000).toLocaleString();


    // console.log('Token Expiration Time:', exp, '->', expDate);
    // console.log('Current Time:', currentTime, '->', currentDate);
    // console.log('Time Left (seconds):', exp - currentTime);

    //verificar si esta por expirar para refrescar el token
    console.log(exp - currentTime)
    if (exp - currentTime < time_refres_token) {
      const newPayload = create_auth_payload(userWithRoles);
      const newToken = this.jwtService.sign(newPayload, { expiresIn: time_expired_jwt });
      req.headers['x-renewed-token'] = newToken;
    }

    return { userId: payload.sub, username: payload.username, roles: userWithRoles.roles };
  }
}

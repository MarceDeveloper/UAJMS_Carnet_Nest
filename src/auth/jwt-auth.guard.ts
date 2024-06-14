// import { Injectable } from '@nestjs/common';
// import { AuthGuard } from '@nestjs/passport';

// @Injectable()
// export class JwtAuthGuard extends AuthGuard('jwt') {}






import { Injectable, ExecutionContext, UnauthorizedException } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
  handleRequest(err, user, info, context: ExecutionContext) {
    const req = context.switchToHttp().getRequest();

    if (err || !user) {
      throw err || new UnauthorizedException();
    }

    // Check if the token was renewed and set the new token in the response header
    const newToken = req.headers['x-renewed-token'];
    if (newToken) {
      const res = context.switchToHttp().getResponse();
      res.setHeader('x-renewed-token', newToken);
    }

    return user;
  }
}













// import { Injectable, ExecutionContext, UnauthorizedException } from '@nestjs/common';
// import { AuthGuard } from '@nestjs/passport';
// import { Reflector } from '@nestjs/core';
// import { Observable } from 'rxjs';

// @Injectable()
// export class JwtAuthGuard extends AuthGuard('jwt') {
//   constructor(private reflector: Reflector) {
//     super();
//   }

//   canActivate(context: ExecutionContext): boolean | Promise<boolean> | Observable<boolean> {
//     const request = context.switchToHttp().getRequest();
//     const authHeader = request.headers.authorization;

//     console.log('Authorization Header:', authHeader);

//     if (!authHeader || !authHeader.startsWith('Bearer ')) {
//       throw new UnauthorizedException('No token found');
//     }

//     return super.canActivate(context);
//   }

//   handleRequest(err, user, info) {
//     if (err || !user) {
//       console.error('Error in JwtAuthGuard:', err);
//       console.error('Info:', info);
//       throw err || new UnauthorizedException();
//     }
//     return user;
//   }
// }

import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaService } from './prisma/prisma.service';
import { PrismaModule } from './prisma/prisma.module';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { RolModule } from './rol/rol.module';

@Module({
  imports: [PrismaModule, AuthModule, UsersModule, RolModule],
  controllers: [AppController],
  providers: [AppService, PrismaService],
})
export class AppModule {}

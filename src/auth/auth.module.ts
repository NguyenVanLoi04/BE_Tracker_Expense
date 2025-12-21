import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';

import { AuthController } from './controllers/auth.controller';
import { UserModule } from '../user/user.module';
import { AuthService } from './services/auth.service';
import { JwtStrategy } from './services/jwt.strategy';
require('dotenv').config();
@Module({
  imports: [
    UserModule,
    JwtModule.register({
      secret: process.env.AUTH_SECRET_TOKEN,
      signOptions: { expiresIn: '7d' },
    }),
  ],
  controllers: [AuthController],
  providers: [AuthService, JwtStrategy],
})
export class AuthModule {}

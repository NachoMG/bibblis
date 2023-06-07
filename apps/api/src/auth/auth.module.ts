import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';

import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { ConfigModule } from '@nestjs/config';
import { EmailVerificationModule } from '../email-verification/email-verification.module';
import { JwtAuthStrategy } from './strategies/jwt-auth.strategy';
import { JwtEmailVerificationStrategy } from './strategies/jwt-email-verification.strategy';
import { JwtRefreshTokenStrategy } from './strategies/jwt-refresh.strategy';
import { PasswordResetModule } from '../password-reset/password-reset.module';
import { PrismaModule } from '../prisma/prisma.module';
import { RefreshTokenModule } from '../refresh-token/refresh-token.module';
import { UserModule } from '../user/user.module';

@Module({
  imports: [
    ConfigModule,
    EmailVerificationModule,
    JwtModule.register({}),
    PasswordResetModule,
    PrismaModule,
    RefreshTokenModule,
    UserModule,
  ],
  controllers: [AuthController],
  providers: [
    AuthService,
    JwtAuthStrategy,
    JwtEmailVerificationStrategy,
    JwtRefreshTokenStrategy,
  ],
})
export class AuthModule {}

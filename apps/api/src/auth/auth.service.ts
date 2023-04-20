import Crypto from 'crypto';

import { BadRequestException, ConflictException, Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

import { Prisma } from '@prisma/client';

import * as bcrypt from 'bcrypt';
import ms from 'ms';

import { IJwtAuthTokens } from './interfaces/i-tokens';
import { SignUpDto } from './dto/sign-up.dto';
import { UserService } from '../user/user.service';
import { IAccessTokenPayload } from './interfaces/i-access-token-payload';
import { IRefreshTokenPayload } from './interfaces/i-refresh-token-payload';
import { RefreshTokenService } from '../refresh-token/refresh-token.service';
import { ConfigService } from '@nestjs/config';
import { SignInDto } from './dto/sign-in.dto';

@Injectable()
export class AuthService {
  constructor(
    private jwtService: JwtService,
    private userService: UserService,
    private refreshTokenService: RefreshTokenService,
    private configService: ConfigService,
  ) {}

  private hash(data: string) {
    return bcrypt.hash(data, 10);
  }

  private async generateAccessToken(userId: string, userEmail: string) {
    const accessTokenPayload: IAccessTokenPayload = {
      sub: userId,
      email: userEmail,
    };

    return await this.jwtService.signAsync(accessTokenPayload, {
      secret: this.configService.get('JWT_ACCESS_TOKEN_SECRET'),
      expiresIn: this.configService.get('JWT_ACCESS_TOKEN_EXPIRATION_TIME'),
    });
  }

  private async generateRefreshToken(userId: string, userEmail: string) {
    const refreshTokenPayload: IRefreshTokenPayload = {
      sub: userId,
      email: userEmail,
      jti: Crypto.randomUUID(),
    };

    const refreshToken = await this.jwtService.signAsync(refreshTokenPayload, {
      secret: this.configService.get('JWT_REFRESH_TOKEN_SECRET'),
      expiresIn: this.configService.get('JWT_REFRESH_TOKEN_EXPIRATION_TIME'),
    });
    await this.refreshTokenService.insert({
      userId,
      jti: refreshTokenPayload.jti,
      hashedToken: await this.hash(refreshToken),
      expiresAt: new Date(Date.now() + ms('10s')),
    });

    return refreshToken;
  }

  private async generateJwtAuthTokens(userId: string, userEmail: string): Promise<IJwtAuthTokens> {
    const [access_token, refresh_token] = await Promise.all([
      await this.generateAccessToken(userId, userEmail),
      await this.generateRefreshToken(userId, userEmail),
    ]);

    return { access_token, refresh_token };
  }

  async signUp(signUpDto: SignUpDto): Promise<IJwtAuthTokens> {
    const existingUser = await this.userService.findOne({
      email: signUpDto.email,
    });
    if (existingUser) {
      throw new ConflictException('User already exists');
    }
  
    if (signUpDto.email !== signUpDto.emailConfirm) {
      throw new BadRequestException(
        'Fields email and emailConfirm should have the same value'
      );
    }

    if (signUpDto.password !== signUpDto.passwordConfirm) {
      throw new BadRequestException(
        'Fields password and passwordConfirm should have the same value'
      );
    }

    const salt = Crypto.randomBytes(16).toString('base64');
    const hashedPassword = await this.hash(`${signUpDto.password}${salt}`);

    const newUserData: Prisma.UserCreateInput = {
      email: signUpDto.email,
      password: hashedPassword,
      salt,
      lang: signUpDto.lang,
      firstName: signUpDto.firstName,
      lastName: signUpDto.lastName,
      birthDate: new Date(signUpDto.birthDate),
      acceptedMarketing: signUpDto.acceptedMarketing,
    };
    const user = await this.userService.insert(newUserData);
    const jwtAuthTokens = await this.generateJwtAuthTokens(
      user.id, user.email
      );

    // TODO Send confirmation email
    return jwtAuthTokens;
  }

  async signIn(signInDto: SignInDto) {
    const user = await this.userService.findOne({
      email: signInDto.email,
    });
    if (!user) {
      throw new UnauthorizedException('Incorrect email or password');
    }

    const candidatePassword = `${signInDto.password}${user.salt}`;
    const isSamePassword = await bcrypt.compare(candidatePassword, user.password);
    if (!isSamePassword) {
      throw new UnauthorizedException('Incorrect email or password');
    }

    return this.generateJwtAuthTokens(user.id, user.email);
  }

  async refresh({ sub: userId, email, jti, token }: IRefreshTokenPayload) {
    const refreshToken = await this.refreshTokenService.findOne({ jti });
    if (
      !refreshToken
      || userId !== refreshToken.userId
      || !await bcrypt.compare(token, refreshToken.hashedToken)
    ) {
      throw new UnauthorizedException();
    }

    await this.refreshTokenService.delete({ jti });
    return this.generateJwtAuthTokens(userId, email);
  }

  async signOut({ jti }: IRefreshTokenPayload) {
    await this.refreshTokenService.delete({ jti });
  }
}

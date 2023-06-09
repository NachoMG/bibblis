import Crypto from 'crypto';
import querystring from 'node:querystring';

import { BadRequestException, ConflictException, Injectable, InternalServerErrorException, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';

import { Prisma } from '@prisma/client';
import { MailerService } from '@nestjs-modules/mailer';

import * as bcrypt from 'bcrypt';
import ms from 'ms';

import { EmailVerificationService } from '../email-verification/email-verification.service';
import { ForgotPasswordDto } from './dto/forgot-password.dto';
import { IDefaultTokenPayload } from './interfaces/i-default-token-payload';
import { IDefaultTokenPayloadWithToken } from './interfaces/i-default-token-payload-with-token';
import { IJwtAuthTokens } from './interfaces/i-tokens';
import { IRefreshTokenPayload } from './interfaces/i-refresh-token-payload';
import { IRefreshTokenPayloadWithToken } from './interfaces/i-refresh-token-payload-with-token';
import { PasswordResetService } from '../password-reset/password-reset.service';
import { RefreshTokenService } from '../refresh-token/refresh-token.service';
import { SignInDto } from './dto/sign-in.dto';
import { SignUpDto } from './dto/sign-up.dto';
import { UserService } from '../user/user.service';

@Injectable()
export class AuthService {
  constructor(
    private configService: ConfigService,
    private emailVerificationService: EmailVerificationService,
    private jwtService: JwtService,
    private mailerService: MailerService,
    private passwordResetService: PasswordResetService,
    private refreshTokenService: RefreshTokenService,
    private userService: UserService,
  ) {}

  private hash(data: string) {
    return bcrypt.hash(data, 10);
  }

  private async generateAccessToken(userId: string, userEmail: string) {
    const accessTokenPayload: IDefaultTokenPayload = {
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

  private async generateConfirmEmailToken(userId: string, userEmail: string) {
    const payload = { sub: userId, email: userEmail };

    await this.emailVerificationService.delete({ userId });

    const confirmEmailToken = await this.jwtService.signAsync(payload, {
      secret: this.configService.get('JWT_EMAIL_VERIFICATION_TOKEN_SECRET'),
      expiresIn: this.configService.get('JWT_EMAIL_VERIFICATION_TOKEN_EXPIRATION_TIME'),
    });

    const hashedToken = await this.hash(confirmEmailToken);

    await this.emailVerificationService.insert({
      userId,
      hashedToken: hashedToken,
      sentAt: new Date(),
    });

    return confirmEmailToken;
  }

  private async generateResetPasswordToken(userId: string, userEmail: string) {
    const payload = { sub: userId, email: userEmail };

    const resetPasswordToken = await this.jwtService.signAsync(payload, {
      secret: this.configService.get('JWT_RESET_PASSWORD_TOKEN_SECRET'),
      expiresIn: this.configService.get('JWT_RESET_PASSWORD_TOKEN_EXPIRATION_TIME'),
    });

    const hashedResetPasswordToken = await this.hash(resetPasswordToken);

    await this.passwordResetService.updateMany(
      { active: true, userId, completedAt: null },
      { active: false }
    );
    await this.passwordResetService.insert({
      userId,
      hashedToken: hashedResetPasswordToken,
    });

    return resetPasswordToken;
  }

  async signUp(signUpDto: SignUpDto): Promise<IJwtAuthTokens> {
    const email = signUpDto.email.toLowerCase();
    const existingUser = await this.userService.findOne({ email });
    if (existingUser) {
      throw new ConflictException('User already exists');
    }
  
    if (email !== signUpDto.emailConfirm.toLowerCase()) {
      throw new BadRequestException(
        'Fields email and emailConfirm should have the same value'
      );
    }

    if (signUpDto.password !== signUpDto.passwordConfirm) {
      throw new BadRequestException(
        'Fields password and passwordConfirm should have the same value'
      );
    }

    const hashedPassword = await this.hash(signUpDto.password);

    const newUserData: Prisma.UserCreateInput = {
      email,
      password: hashedPassword,
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
    const confirmEmailToken = await this.generateConfirmEmailToken(
      user.id, user.email
    );

    const confirmEmailQuerystring = querystring.stringify({
      token: confirmEmailToken,
    });
    this.mailerService.sendMail({
      to: email,
      subject: 'Bibblis - Activa tu cuenta',
      template: 'sign-up',
      context: { confirmEmailQuerystring },
    });
    return jwtAuthTokens;
  }

  async signIn(signInDto: SignInDto) {
    const user = await this.userService.findOne({
      email: signInDto.email,
    });
    if (!user) {
      throw new UnauthorizedException('Incorrect email or password');
    }

    const isSamePassword = await bcrypt.compare(signInDto.password, user.password);
    if (!isSamePassword) {
      throw new UnauthorizedException('Incorrect email or password');
    }

    return this.generateJwtAuthTokens(user.id, user.email);
  }

  async refresh({ sub: userId, email, jti, token }: IRefreshTokenPayloadWithToken) {
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

  async verifyEmail({ sub: userId, token }: IDefaultTokenPayloadWithToken) {
    const emailVerification = await this.emailVerificationService.findOne({
      userId,
      completedAt: null,
    });
    if (!emailVerification) {
      throw new NotFoundException();
    }

    const isSameToken = bcrypt.compare(token, emailVerification.hashedToken);
    if (!isSameToken) {
      throw new UnauthorizedException();
    }

    try {
      await Promise.all([
        this.emailVerificationService.updateOne({
          where: { userId },
          data: { completedAt: new Date() },
        }),
        this.userService.updateOne({
          where: { id: userId },
          data: { validated: true },
        }),
      ]);
    } catch (exception) {
      // TODO log exception?
      throw new InternalServerErrorException();
    }
  }

  async forgotPassword({ email }: ForgotPasswordDto) {
    const user = await this.userService.findOne({ email });
    if (user) {
      const resetPasswordToken = await this.generateResetPasswordToken(
        user.id, user.email
      );
      const resetPasswordQuerystring = querystring.stringify({
        token: resetPasswordToken,
      });
      this.mailerService.sendMail({
        to: email,
        subject: 'Bibblis - Modifica tu contraseña',
        template: 'reset-password',
        context: { resetPasswordQuerystring },
      });
    }
  }

  async checkResetPasswordToken({ sub: userId, token }: IDefaultTokenPayloadWithToken) {
    const resetPassword = await this.passwordResetService.findFirst({
      userId,
      active: true,
      completedAt: null,
    });
    if (!resetPassword) {
      throw new NotFoundException();
    }

    const isSameToken = await bcrypt.compare(token, resetPassword.hashedToken);
    if (!isSameToken) {
      throw new UnauthorizedException();
    }

    return resetPassword;
  }

  async resetPassword(
    tokenPayloadWithToken: IDefaultTokenPayloadWithToken, newPassword: string
  ) {
    const resetPassword = await this.checkResetPasswordToken(tokenPayloadWithToken);
    
    const newHashedPassword = await this.hash(newPassword);
    await this.userService.updateOne({
      where: { id: tokenPayloadWithToken.sub },
      data: { password: newHashedPassword },
    });
    await this.passwordResetService.updateOne(
      { id: resetPassword.id },
      { completedAt: new Date() },
    );
  }
}

import { Body, Controller, Post, UseGuards, Res, HttpCode, Req } from '@nestjs/common';

import { ApiCookieAuth,ApiResponse, ApiOperation, ApiBearerAuth, ApiTags } from '@nestjs/swagger';

import { Response } from 'express';

import { AuthService } from './auth.service';
import { ForgotPasswordDto } from './dto/forgot-password.dto';
import { IRequestWithDefaultTokenPayloadWithToken } from './interfaces/i-request-with-access-token-payload-with-token';
import { IRequestWithRefreshTokenPayloadWithToken } from './interfaces/i-request-with-refresh-token-payload-with-token';
import { JwtEmailVerificationGuard } from './guards/jwt-email-verification.guard';
import { JwtPasswordResetGuard } from './guards/jwt-password-reset.guard';
import { JwtRefreshGuard } from './guards/jwt-refresh.guard';
import { ResetPasswordDto } from './dto/reset-password.dto';
import { SignInDto } from './dto/sign-in.dto';
import { SignUpDto } from './dto/sign-up.dto';

@ApiTags('Authentication')
@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @ApiOperation({ summary: 'User registration' })
  @ApiResponse({ status: 200, description: 'Access token successfully refreshed' })
  @ApiResponse({ status: 409, description: 'User already exists' })
  @ApiResponse({ status: 400, description: 'Bad request' })
  @Post('sign-up')
  @HttpCode(200)
  async signUp(
    @Res({ passthrough: true }) res: Response,
    @Body() signUpDto: SignUpDto
  ) {
    const { access_token, refresh_token } = await this.authService.signUp(signUpDto);
    res.cookie('refresh', refresh_token, { httpOnly: true });
    return { access_token };
  }

  @ApiOperation({ summary: 'User login' })
  @ApiResponse({ status: 200, description: 'Login OK' })
  @ApiResponse({ status: 401, description: 'Invalid user/email' })
  @Post('sign-in')
  @HttpCode(200)
  async signIn(
    @Res({ passthrough: true }) res: Response,
    @Body() signInDto: SignInDto
  ) {
    const { access_token, refresh_token } = await this.authService.signIn(signInDto);
    res.cookie('refresh', refresh_token, { httpOnly: true });
    return { access_token };
  }

  @UseGuards(JwtRefreshGuard)
  @ApiCookieAuth()
  @ApiOperation({ summary: 'Refresh user access token' })
  @ApiResponse({ status: 200, description: 'Access token successfully refreshed' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @Post('refresh')
  @HttpCode(200)
  async refresh(
    @Req() req: IRequestWithRefreshTokenPayloadWithToken,
    @Res({ passthrough: true }) res: Response
  ) {
    const { access_token, refresh_token } = await this.authService.refresh(req.user);
    res.cookie('refresh', refresh_token, { httpOnly: true });
    return { access_token };
  }

  @UseGuards(JwtRefreshGuard)
  @ApiCookieAuth()
  @ApiOperation({ summary: 'User sign out' })
  @ApiResponse({ status: 200, description: 'Refresh token successfully destroyed' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @Post('sign-out')
  @HttpCode(200)
  signOut(
    @Req() req: IRequestWithRefreshTokenPayloadWithToken,
    @Res({ passthrough: true }) res: Response
  ) {
    this.authService.signOut(req.user);
    res.clearCookie('refresh');
  }

  @UseGuards(JwtEmailVerificationGuard)
  @ApiBearerAuth('Confirm email token')
  @ApiOperation({ summary: 'User email confirmation' })
  @ApiResponse({ status: 200, description: 'Email successfully confirmed' })
  @ApiResponse({ status: 401, description: 'Unauthorized (invalid confirmation token)' })
  @ApiResponse({ status: 404, description: 'Token not found' })
  @Post('verify-email')
  async verifyEmail(@Req() req: IRequestWithDefaultTokenPayloadWithToken) {
    await this.authService.verifyEmail(req.user);
  }

  @ApiOperation({ summary: 'Sends a reset password email' })
  @ApiResponse({ status: 200, description: 'Login OK' })
  @Post('forgot-password')
  forgotPassword(@Body() req: ForgotPasswordDto) {
    this.authService.forgotPassword(req);
  }

  @UseGuards(JwtPasswordResetGuard)
  @ApiBearerAuth('Reset password token')
  @ApiOperation({ summary: 'Checks if a reset password token is valid' })
  @ApiResponse({ status: 200, description: 'Valid reset password token' })
  @ApiResponse({ status: 401, description: 'Unauthorized (invalid confirmation token)' })
  @ApiResponse({ status: 404, description: 'Token not found' })
  @Post('/check-reset-password-token')
  async checkResetPasswordToken(@Req() req: IRequestWithDefaultTokenPayloadWithToken) {
    await this.authService.checkResetPasswordToken(req.user);
  }

  @UseGuards(JwtPasswordResetGuard)
  @ApiBearerAuth('Reset password token')
  @ApiOperation({ summary: 'Checks if a reset password token is valid' })
  @ApiResponse({ status: 200, description: 'Valid reset password token' })
  @ApiResponse({ status: 401, description: 'Unauthorized (invalid reset password token)' })
  @ApiResponse({ status: 404, description: 'Token not found' })
  @Post('/reset-password')
  async resetPassword(
    @Req() req: IRequestWithDefaultTokenPayloadWithToken,
    @Body() resetPasswordDto: ResetPasswordDto
  ) {
    await this.authService.resetPassword(req.user, resetPasswordDto.newPassword);
  }
}

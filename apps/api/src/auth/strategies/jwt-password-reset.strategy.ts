import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ConfigService } from '@nestjs/config';

import { ExtractJwt, Strategy } from 'passport-jwt';
import { Request } from 'express';

import { IDefaultTokenPayload } from '../interfaces/i-default-token-payload';
import { IDefaultTokenPayloadWithToken } from '../interfaces/i-default-token-payload-with-token';

@Injectable()
export class JwtPasswordResetStrategy extends PassportStrategy(
  Strategy,
  'jwt-password-reset'
) {
  constructor(configService: ConfigService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: configService.get('JWT_RESET_PASSWORD_TOKEN_SECRET'),
      passReqToCallback: true,
    })
  }

  validate(request: Request, payload: IDefaultTokenPayload): IDefaultTokenPayloadWithToken {
    const [, token] = request.headers.authorization.split(' ') ?? [];
    return {
      ...payload,
      token,
    };
  }
}

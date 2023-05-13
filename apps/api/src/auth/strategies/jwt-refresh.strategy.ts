import { PassportStrategy } from '@nestjs/passport';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

import { Request } from 'express';
import { ExtractJwt, Strategy } from 'passport-jwt';

import { IRefreshTokenPayload } from '../interfaces/i-refresh-token-payload';
import { IRefreshTokenPayloadWithToken } from '../interfaces/i-refresh-token-payload-with-token';

@Injectable()
export class JwtRefreshTokenStrategy extends PassportStrategy(
  Strategy,
  'jwt-refresh-token',
) {
  constructor(configService: ConfigService) {
    super({
      jwtFromRequest: ExtractJwt.fromExtractors([(request: Request) => {
        return request?.cookies?.refresh
      }]),
      secretOrKey: configService.get('JWT_REFRESH_TOKEN_SECRET'),
      passReqToCallback: true,
    });
  }

  validate(request: Request, payload: IRefreshTokenPayload): IRefreshTokenPayloadWithToken {
    const token = request.cookies.refresh;
    return {
      ...payload,
      token,
    };
  }
}

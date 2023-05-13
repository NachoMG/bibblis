import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ConfigService } from '@nestjs/config';

import { ExtractJwt, Strategy } from 'passport-jwt';
import { Request } from 'express';

import { IDefaultTokenPayload } from '../interfaces/i-default-token-payload';
import { IDefaultTokenPayloadWithToken } from '../interfaces/i-default-token-payload-with-token';

@Injectable()
export class JwtEmailVerificationStrategy extends PassportStrategy(
  Strategy,
  'jwt-email-verification'
) {
  constructor(configService: ConfigService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: configService.get('JWT_EMAIL_VERIFICATION_TOKEN_SECRET'),
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

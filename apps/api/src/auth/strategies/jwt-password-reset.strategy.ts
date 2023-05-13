import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ConfigService } from '@nestjs/config';

import { ExtractJwt, Strategy } from 'passport-jwt';
import { IDefaultTokenPayload } from '../interfaces/i-default-token-payload';

@Injectable()
export class JwtPasswordResetStrategy extends PassportStrategy(
  Strategy,
  'jwt-passwordReset'
) {
  constructor(configService: ConfigService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: configService.get('JWT_RESET_PASSWORD_TOKEN_SECRET'),
    })
  }

  validate(payload: IDefaultTokenPayload) {
    return { userId: payload.sub, email: payload.email };
  }
}

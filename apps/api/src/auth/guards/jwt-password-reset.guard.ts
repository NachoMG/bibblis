import { Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
export class JwtPasswordResetGuard extends AuthGuard('jwt-password-reset') {}

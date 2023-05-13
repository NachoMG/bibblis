import { IDefaultTokenPayload } from './i-default-token-payload';

export interface IRefreshTokenPayload extends IDefaultTokenPayload {
  jti: string;
}

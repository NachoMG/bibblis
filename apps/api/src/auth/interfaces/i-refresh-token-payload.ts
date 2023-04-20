import { IAccessTokenPayload } from './i-access-token-payload';

export interface IRefreshTokenPayload extends IAccessTokenPayload {
  jti: string;
  token?: string;
}

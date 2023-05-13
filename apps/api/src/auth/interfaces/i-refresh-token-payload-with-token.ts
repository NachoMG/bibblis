import { IRefreshTokenPayload } from './i-refresh-token-payload';

export interface IRefreshTokenPayloadWithToken extends IRefreshTokenPayload {
  token: string;
}

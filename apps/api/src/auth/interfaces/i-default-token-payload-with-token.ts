import { IDefaultTokenPayload } from './i-default-token-payload';

export interface IDefaultTokenPayloadWithToken extends IDefaultTokenPayload {
  token: string;
}

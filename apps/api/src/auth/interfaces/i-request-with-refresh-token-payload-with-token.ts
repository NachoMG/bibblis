import { Request } from 'express';

import { IRefreshTokenPayloadWithToken } from './i-refresh-token-payload-with-token';

export interface IRequestWithRefreshTokenPayloadWithToken extends Request {
  user: IRefreshTokenPayloadWithToken;
}

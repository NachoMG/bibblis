import { Request } from 'express';

import { IRefreshTokenPayload } from './i-refresh-token-payload';

export interface IRequestWithRefreshTokenPayload extends Request {
  user: IRefreshTokenPayload;
}

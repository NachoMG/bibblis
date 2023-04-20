import { Request } from 'express';

import { IAccessTokenPayload } from './i-access-token-payload';

export interface IRequestWithAccessTokenPayload extends Request {
  user: IAccessTokenPayload;
}

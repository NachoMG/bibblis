import { Request } from 'express';

import { IDefaultTokenPayloadWithToken } from './i-default-token-payload-with-token';

export interface IRequestWithDefaultTokenPayloadWithToken extends Request {
  user: IDefaultTokenPayloadWithToken;
}

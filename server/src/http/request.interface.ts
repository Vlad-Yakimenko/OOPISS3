import { IncomingMessage as IncomingRequest } from 'http';

export interface Request extends IncomingRequest {
  body: Record<string, any>;
}
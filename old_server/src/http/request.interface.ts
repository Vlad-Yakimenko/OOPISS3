import { IncomingMessage as IncomingRequest } from 'http';

export interface Request extends IncomingRequest {
  [key: string]: any; // attach whatever you want
}
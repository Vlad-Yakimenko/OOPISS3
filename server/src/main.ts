require('dotenv').config();
import { Server } from './http/server';
import { Logger } from '@app/log';

const PORT = Number(process.env.PORT) || 5000;
const HOST = process.env.HOST || '127.0.0.1';

const logger = new Logger();

const server = new Server(logger);

server.start(PORT, HOST);

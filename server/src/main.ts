require('dotenv').config();
import { Server } from './http/server';
import { Logger } from '@app/log';
import { RouteDispatcher } from './http/route-dispatcher';

const PORT = Number(process.env.PORT) || 5000;
const HOST = process.env.HOST || '127.0.0.1';

const logger = new Logger();

const routeDispatcher = new RouteDispatcher();

const server = new Server(routeDispatcher, logger);

server.start(PORT, HOST);

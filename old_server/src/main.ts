require('dotenv').config();
import { Logger } from '@app/log';
import { generateTestData } from '@test/random';
import { RouteDispatcher, Server } from './http';

const PORT = Number(process.env.PORT) || 5000;
const HOST = process.env.HOST || '127.0.0.1';

const logger = new Logger();
const routeDispatcher = new RouteDispatcher();
const server = new Server(routeDispatcher, logger);

server.start(PORT, HOST);

// for testing only
(async function () {
  await generateTestData();
})();

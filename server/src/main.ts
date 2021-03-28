require('dotenv').config();
import * as http from 'http';

import { Logger } from '@app/log';
import { Connector } from './db/connector';

const PORT = Number(process.env.PORT) || 5000;
const HOST = process.env.HOST || '127.0.0.1';

const logger = new Logger();

const server = http.createServer(async (req, res) => {
  logger.info(`Received request for ${req.url}`);

  res.writeHead(200, { 'Content-Type': 'text/plain' });
  res.write('Server is working! \n\n');
  res.end('Hello, Buddy! \n');
});

server.listen(PORT, HOST, () => logger.info(`Server is listening on port ${PORT}`));

require('dotenv').config();
import { Logger } from '@app/log';
import { RouteDispatcher, Server } from './http';
import { UserRepository } from './repository/user.repository';
import { Bill, User } from './entity';
import { Country, Currency, Role } from './entity/enum';

const PORT = Number(process.env.PORT) || 5000;
const HOST = process.env.HOST || '127.0.0.1';

const logger = new Logger();

const routeDispatcher = new RouteDispatcher();

const server = new Server(routeDispatcher, logger);

///
const userRepo = new UserRepository();

const userBill: Bill = {
  balance: 0,
  currency: Currency.UAH,
};

const user: User = {
  username: 'maksym',
  password: 'password',
  isConnected: false,
  country: Country.Ukraine,
  role: Role.Abonent,
  bill: userBill
};
////

server.start(PORT, HOST);

// for testing only
(async function () {
  await userRepo.query(`
  SET FOREIGN_KEY_CHECKS=0; 
  delete from bill; 
  delete from calling; 
  delete from tariff; 
  delete from user; 
  delete from user_tariff; 
  `);

  //const user = await userRepo.findById(10);

  //console.log(user);
  //console.log(await userRepo.count());
})();

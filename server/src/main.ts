require('dotenv').config();
import { Logger } from '@app/log';
import { RouteDispatcher, Server } from './http';
import { UserRepository } from './repository/user.repository';
import { Bill, Tariff, User } from './entity';
import { Country, Currency, Role } from './entity/enum';
import { TariffRepository } from './repository/tariff.repository';
import { CryptoHelperService } from './helper';

const PORT = Number(process.env.PORT) || 5000;
const HOST = process.env.HOST || '127.0.0.1';

const logger = new Logger();

const routeDispatcher = new RouteDispatcher();

const server = new Server(routeDispatcher, logger);

server.start(PORT, HOST);

// for testing only
(async function () {
  const userRepo = new UserRepository();
  const tariffRepo = new TariffRepository();
  const cryptoHeler = new CryptoHelperService();

  const userBill: Bill = {
    balance: 0,
    currency: Currency.UAH,
  };

  const user: User = {
    username: 'maksym',
    password: await cryptoHeler.hash('password'),
    isConnected: false,
    country: Country.Ukraine,
    role: Role.Abonent,
    bill: userBill
  };

  const user2: User = {
    username: 'maksym2',
    password: await cryptoHeler.hash('password2'),
    isConnected: false,
    country: Country.Ukraine,
    role: Role.Abonent,
    bill: userBill
  };

  const tariff: Tariff = {
    naming: 'Tariff1',
    discount: 30.0,
    country: Country.Ukraine,
    cost: 100,
  };
  const tariff2: Tariff = {
    naming: 'Tariff2',
    discount: 40.0,
    country: Country.USA,
    cost: 400,
  };

  /////////////////////////
  await userRepo.query(`
    SET FOREIGN_KEY_CHECKS=0;
    delete from bill;
    delete from calling;
    delete from tariff;
    delete from user;
    delete from user_tariff;
  `);

  await userRepo.create(user);
  await userRepo.create(user2);

  await tariffRepo.create(tariff);
  await tariffRepo.create(tariff2);

  const userId = (await userRepo.findByUsername(user.username)).id;
  const userId2 = (await userRepo.findByUsername(user2.username)).id;

  console.log('userId: ', userId);
  console.log('userId2: ', userId2);

  const tariffId = (await tariffRepo.findByNaming(tariff.naming)).id;
  const tariffId2 = (await tariffRepo.findByNaming(tariff2.naming)).id;

  console.log('tariffId: ', tariffId);
  console.log('tariffId2: ', tariffId2);

  await userRepo.addTariff(userId, tariffId);
  await userRepo.addTariff(userId, tariffId2);

  const abonents = await userRepo.findAllAbonents();

  console.log(JSON.stringify(abonents, undefined, 2));

  console.log('-------------------------------------');

  //console.log(await userRepo.findByUsername('maksym'));

  //const user = await userRepo.findById(10);

  //console.log(await userRepo.count());
})();

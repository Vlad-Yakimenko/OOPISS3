import { Bill, Calling, Tariff, User } from "@app/entity";
import { Country, Currency, Role } from "@app/entity/enum";
import { CryptoHelperService } from "@app/helper";
import { AddCallingsService, GetCallingsService } from "@app/http/service/calling";
import { CallingRepository, TariffRepository, UserRepository } from "@app/repository";

export async function generateTestData() {
  const userRepo = new UserRepository();
  const tariffRepo = new TariffRepository();
  const callingRepo = new CallingRepository();

  const cryptoHeler = new CryptoHelperService();
  const getCallingsService = new GetCallingsService();
  const addCallingsService = new AddCallingsService();

  const userBill: Bill = {
    balance: 1000,
    currency: Currency.UAH,
  };

  const user: User = {
    phone: '380993479957',
    password: await cryptoHeler.hash('password'),
    isConnected: false,
    country: Country.Ukraine,
    role: Role.Admin,
    bill: userBill
  };

  const user2: User = {
    phone: '380993479958',
    password: await cryptoHeler.hash('password2'),
    isConnected: false,
    country: Country.Ukraine,
    role: Role.Abonent,
    bill: userBill
  };

  const tariff: Tariff = {
    naming: 'Tariff1',
    discount: 10.0,
    country: Country.Ukraine,
    cost: 100,
  };
  const tariff2: Tariff = {
    naming: 'Tariff2',
    discount: 20.0,
    country: Country.Poland,
    cost: 300,
  };
  const tariff3: Tariff = {
    naming: 'Tariff3',
    discount: 35.0,
    country: Country.USA,
    cost: 500,
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
  await tariffRepo.create(tariff3);

  const userId = (await userRepo.findByPhone(user.phone)).id; //user `+380993479957`
  const userId2 = (await userRepo.findByPhone(user2.phone)).id; //user `+380993479958`

  await userRepo.changeStatus(userId);

  const calling: Calling = {
    receiverId: userId2,
    senderId: userId,
    cost: 90,
    duration: 100,
  };
  const calling2: Calling = {
    receiverId: userId2,
    senderId: userId,
    cost: 180,
    duration: 200,
  };
  const calling3: Calling = {
    receiverId: userId,
    senderId: userId2,
    cost: 300,
    duration: 300,
  };

  // const callings: Calling[] = [calling, calling2, calling3];
  // await Promise.all(callings.map(calling => callingRepo.create(calling)));

  // console.log(await getCallingsService.getCallings(userId));
  // console.log('-------------------------------');
  // console.log(await getCallingsService.getCallings(userId2));

  // ----------------------------------------------------------------

  const tariffId = (await tariffRepo.findByNaming(tariff.naming)).id;
  const tariffId2 = (await tariffRepo.findByNaming(tariff2.naming)).id;
  const tariffId3 = (await tariffRepo.findByNaming(tariff3.naming)).id;

  await userRepo.addTariff(userId, tariffId);
  await userRepo.addTariff(userId, tariffId2);
  //await userRepo.addTariff(userId, tariffId3);

  await addCallingsService.addCallings({ userId: userId, callings: [calling, calling2] }); // for user +380993479957
  await addCallingsService.addCallings({ userId: userId2, callings: [calling3] }); // for user +380993479958
}

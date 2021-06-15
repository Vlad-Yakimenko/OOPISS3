import { Connection } from "typeorm";
import { CallingEntity } from "@app/db/entity";
import { Country, Currency, Role } from "@app/db/entity/enum";
import { 
  CallingRepository, TariffRepository, 
  UserRepository,
} from "@app/db/repository";
import { CryptoHelperService } from "@app/shared/helper";
import { Bill, Calling, Tariff, User } from "@app/shared/interface";
import { AddCallingsService } from "@app/http/module/calling";

export async function generateTestData(connection: Connection) {
  const userRepo = connection.getCustomRepository(UserRepository);
  const tariffRepo = connection.getCustomRepository(TariffRepository);
  const callingRepo = connection.getCustomRepository(CallingRepository);

  const addCallingsService = new AddCallingsService(
    callingRepo, userRepo, tariffRepo,
  );
  const cryptoHelper = new CryptoHelperService();

  await userRepo.query(`
    SET FOREIGN_KEY_CHECKS=0;
  `);
  await userRepo.query(`
    delete from bill;
  `);
  await userRepo.query(`
    delete from calling;
  `);
  await userRepo.query(`
    delete from tariff;
  `);
  await userRepo.query(`
    delete from user;
  `);
  await userRepo.query(`
    delete from user_tariff;
  `);

  const userBill: Bill = {
    balance: 1000,
    currency: Currency.UAH,
  };

  const user: User = {
    phone: '380993479957',
    password: await cryptoHelper.hash('password'),
    isConnected: false,
    country: Country.Ukraine,
    role: Role.Admin,
    bill: userBill
  };

  const user2: User = {
    phone: '380993479958',
    password: await cryptoHelper.hash('password2'),
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

  await userRepo.createAndSave(user);
  await userRepo.createAndSave(user2);

  await tariffRepo.createAndSave(tariff);
  await tariffRepo.createAndSave(tariff2);
  await tariffRepo.createAndSave(tariff3);

  const userFound = await userRepo.findByPhone(user.phone);
  const userFound2 = await userRepo.findByPhone(user2.phone);
  const userId = userFound.id; //user `+380993479957`
  const userId2 = userFound2.id; //user `+380993479958`

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

  // userFound.incomingCallings = [
  //   ...userFound.incomingCallings, 
  //   callingRepo.create(calling3)
  // ];

  // userFound.outgoingCallings = [
  //   ...userFound.outgoingCallings, callingRepo.create(calling), 
  //   callingRepo.create(calling2)
  // ];

  // userFound2.outgoingCallings = [
  //   ...userFound2.outgoingCallings, 
  //   callingRepo.create(calling3)
  // ];

  // userFound2.incomingCallings = [
  //   ...userFound2.incomingCallings, callingRepo.create(calling), 
  //   callingRepo.create(calling2)
  // ];

  await userRepo.save(userFound);
  await userRepo.save(userFound2);

  const tariffId = (await tariffRepo.findByNaming(tariff.naming)).id;
  const tariffId2 = (await tariffRepo.findByNaming(tariff2.naming)).id;
  const tariffId3 = (await tariffRepo.findByNaming(tariff3.naming)).id;

  await userRepo.addTariff(userId, tariffId);
  await userRepo.addTariff(userId, tariffId2);

  await addCallingsService.addCallings({ userId: userId, callings: [calling, calling2] }); // for user +380993479957
  await addCallingsService.addCallings({ userId: userId2, callings: [calling3] }); // for user +380993479958

  //console.log(await callingRepo.findCallingsByUserId(userId));
}

import { TableName } from "@app/db";
import { User } from "@app/entity";
import {
  Country, Currency, Role
} from "@app/entity/enum";
import {
  genRandomFloat, genRandomInt, genRandomString
} from "@test/random";
import { UserRepository } from "./user.repository";

describe('`UserRepository`', () => {
  let userRepository: UserRepository;
  const mockConnector = {
    query: jest.fn(),
  };

  beforeEach(() => {
    userRepository = new UserRepository(mockConnector as any);
  });

  it('should be instance of `UserRepository`', () => {
    expect(userRepository).toBeInstanceOf(UserRepository);
    expect(new UserRepository()).toBeInstanceOf(UserRepository);
  });

  describe('`count`', () => {
    it(`should count rows in ${TableName.User} table`, async () => {
      const userCounter: number = genRandomInt();
      const queryPattern = `SELECT COUNT(*) as userCounter FROM ${TableName.User}; `;
      const rows = [{ userCounter }];

      mockConnector.query.mockResolvedValue(rows);
      await expect(userRepository.count()).resolves.toEqual(userCounter);
      expect(mockConnector.query).toHaveBeenCalledWith(
        expect.stringContaining(queryPattern)
      );
    });
  });

  describe('`findById`', () => {
    it(`should return user with his bill if exists`, async () => {
      const queryPattern = ``;
      const userId = genRandomInt();
      const values = [userId];
      const bill = {
        billId: genRandomInt(),
        userId,
        balance: genRandomFloat(),
        currency: Currency.UAH,
      };
      const rows = [
        {
          id: userId,
          phone: genRandomString(),
          ...bill,
        },
      ];

      mockConnector.query.mockResolvedValue(rows);
      await expect(userRepository.findById(userId)).resolves.toEqual(rows[0]);
      expect(mockConnector.query).toHaveBeenCalledWith(
        expect.stringContaining(queryPattern),
        values,
      );
    });

    it('should return null if user does not exist', async () => {
      const queryPattern = ``;
      const userId = genRandomInt();
      const values = [userId];
      const rows = [];

      mockConnector.query.mockResolvedValue(rows);
      await expect(userRepository.findById(userId)).resolves.toEqual(null);
      expect(mockConnector.query).toHaveBeenCalledWith(
        expect.stringContaining(queryPattern),
        values,
      );
    });
  });

  describe('`findByPhone`', () => {
    it(`should return user with his bill if exists`, async () => {
      const queryPattern = ``;
      const userId = genRandomInt();
      const phone = genRandomString();
      const values = [phone];
      const bill = {
        billId: genRandomInt(),
        userId,
        balance: genRandomFloat(),
        currency: Currency.UAH,
      };
      const rows = [
        {
          id: userId,
          phone,
          ...bill,
        },
      ];

      mockConnector.query.mockResolvedValue(rows);
      await expect(userRepository.findByPhone(phone)).resolves.toEqual(rows[0]);
      expect(mockConnector.query).toHaveBeenCalledWith(
        expect.stringContaining(queryPattern),
        values,
      );
    });

    it('should return null if user does not exist', async () => {
      const queryPattern = ``;
      const phone = genRandomString();
      const values = [phone];
      const rows = [];

      mockConnector.query.mockResolvedValue(rows);
      await expect(userRepository.findByPhone(phone)).resolves.toEqual(null);
      expect(mockConnector.query).toHaveBeenCalledWith(
        expect.stringContaining(queryPattern),
        values,
      );
    });
  });

  describe('`create`', () => {
    it('should create user', async () => {
      const queryPattern = `INSERT INTO ${TableName.User} `;
      const queryPattern2 = `INSERT INTO ${TableName.Bill} `;
      const user: User = {
        phone: genRandomString(),
        password: genRandomString(),
        isConnected: false,
        country: Country.Ukraine,
        role: Role.Abonent,
        bill: {
          balance: genRandomInt(),
          currency: Currency.UAH,
        }
      };
      const values = [user.phone, user.password, user.isConnected, user.country, user.role];
      const values2 = [user.bill.balance, user.bill.currency, user.phone];

      await userRepository.create(user);
      expect(mockConnector.query).toHaveBeenNthCalledWith(
        1,
        expect.stringContaining(queryPattern),
        values,
      );
      expect(mockConnector.query).toHaveBeenNthCalledWith(
        2,
        expect.stringContaining(queryPattern2),
        values2,
      )
    });
  });

  describe('`changeStatus`', () => {
    it('should change user status to the opposite', async () => {
      const userId = genRandomInt();
      const queryPattern = `UPDATE ${TableName.User} SET isConnected = !isConnected WHERE id = ?; `;
      const values = [userId];

      await userRepository.changeStatus(userId);
      expect(mockConnector.query).toHaveBeenCalledWith(
        expect.stringContaining(queryPattern),
        values,
      );
    })
  });

  describe('`changeBalance`', () => {
    it('should change user balance', async () => {
      const userId = genRandomInt();
      const newBalance = genRandomFloat();
      const queryPattern = `UPDATE ${TableName.Bill} SET balance = ? `;
      const values = [newBalance, userId];

      await userRepository.changeBalance(userId, newBalance);
      expect(mockConnector.query).toHaveBeenCalledWith(
        expect.stringContaining(queryPattern),
        values,
      );
    })
  });

  describe('`addTariff`', () => {
    it('should add an existing tariff to the user', async () => {
      const userId = genRandomInt();
      const tariffId = genRandomInt();
      const queryPattern = `INSERT INTO ${TableName.User_Tariff} (userId, tariffId)
      VALUES (?, ?); `;
      const values = [userId, tariffId];

      await userRepository.addTariff(userId, tariffId);
      expect(mockConnector.query).toHaveBeenCalledWith(
        expect.stringContaining(queryPattern),
        values,
      );
    });
  });

  describe('`findAllAbonents`', () => {
    it('should find all users with `Abonent` role', async () => {
      const abonents = [
        {
          id: 1,
          phone: genRandomString(),
          isConnected: 0,
          role: Role.Abonent,
          country: Country.Poland,
        },
        {
          id: 2,
          phone: genRandomString(),
          isConnected: 1,
          role: Role.Abonent,
          country: Country.USA,
        }
      ];
      const tariffs = [
        {
          userId: 1,
          country: Country.Poland,
          cost: genRandomFloat(),
        },
        {
          userId: 2,
          country: Country.USA,
          cost: genRandomFloat(),
        }
      ];

      const queryPattern = `SELECT ${TableName.User}`;
      const queryPattern2 = `SELECT ${TableName.Tariff}`;
      const values = [Role.Abonent];
      const values2 = [1, 2];

      mockConnector.query
        .mockResolvedValueOnce(abonents)
        .mockResolvedValueOnce(tariffs);

      const allAbonents = await userRepository.findAllAbonents();

      allAbonents.forEach((abonent, ind) => {
        expect(abonent).toMatchObject({
          ...abonents[ind],
          bill: expect.any(Object),
          tariffs: expect.any(Array),
        });
      });
      expect(mockConnector.query).toHaveBeenNthCalledWith(
        1,
        expect.stringContaining(queryPattern),
        values,
      );
      expect(mockConnector.query).toHaveBeenNthCalledWith(
        2,
        expect.stringContaining(queryPattern2),
        values2,
      );
    });
  });
});
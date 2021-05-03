import { TableName } from "@app/db";
import { Tariff } from "@app/entity";
import { Country } from "@app/entity/enum";
import { genRandomInt, genRandomString } from "@test/random";
import { TariffRepository } from "./tariff.repository";


describe('`TariffRepository`', () => {
  let tariffRepository: TariffRepository;
  const mockConnector = {
    query: jest.fn(),
  };

  beforeEach(() => {
    tariffRepository = new TariffRepository(mockConnector as any);
  });

  it('should be instance of `TariffRepository`', () => {
    expect(tariffRepository).toBeInstanceOf(TariffRepository);
    expect(new TariffRepository()).toBeInstanceOf(TariffRepository);
  });

  describe('`count`', () => {
    it(`should count rows in ${TableName.Tariff} table`, async () => {
      const tariffCounter: number = genRandomInt();
      const queryPattern = `SELECT COUNT(*) as tariffCounter FROM ${TableName.Tariff}; `;
      const rows = [{ tariffCounter }];

      mockConnector.query.mockResolvedValue(rows);
      await expect(tariffRepository.count()).resolves.toEqual(tariffCounter);
      expect(mockConnector.query).toHaveBeenCalledWith(
        expect.stringContaining(queryPattern)
      );
    });
  });

  describe('`findById`', () => {
    it(`should return tariff if exists`, async () => {
      const queryPattern = `SELECT * FROM ${TableName.Tariff} WHERE id = ?; `;
      const tariffId = genRandomInt();
      const values = [tariffId];
      const rows = [
        {
          id: tariffId,
          discount: genRandomInt(10, 50),
        },
      ];

      mockConnector.query.mockResolvedValue(rows);
      await expect(tariffRepository.findById(tariffId)).resolves.toEqual(rows[0]);
      expect(mockConnector.query).toHaveBeenCalledWith(
        expect.stringContaining(queryPattern),
        values,
      );
    });

    it('should return null if calling does not exist', async () => {
      const queryPattern = `SELECT * FROM ${TableName.Tariff} WHERE id = ?; `;
      const tariffId = genRandomInt();
      const values = [tariffId];
      const rows = [];

      mockConnector.query.mockResolvedValue(rows);
      await expect(tariffRepository.findById(tariffId)).resolves.toEqual(null);
      expect(mockConnector.query).toHaveBeenCalledWith(
        expect.stringContaining(queryPattern),
        values,
      );
    });
  });

  describe('`create`', () => {
    it('should create tariff', async () => {
      const queryPattern = `INSERT INTO ${TableName.Tariff} `;
      const tariff: Tariff = {
        naming: genRandomString(),
        discount: genRandomInt(10, 50),
        country: Country.USA,
        cost: genRandomInt(),
      };
      const values = [tariff.naming, tariff.discount, tariff.country, tariff.cost];

      await tariffRepository.create(tariff);
      expect(mockConnector.query).toHaveBeenCalledWith(
        expect.stringContaining(queryPattern),
        values,
      );
    });
  });

  describe('`findByNaming`', () => {
    it(`should return tariff if exists`, async () => {
      const queryPattern = `SELECT * FROM ${TableName.Tariff} WHERE naming = ?; `;
      const tariffNaming = genRandomString();
      const values = [tariffNaming];
      const rows = [
        {
          id: genRandomInt(),
          discount: genRandomInt(10, 50),
          naming: tariffNaming
        },
      ];

      mockConnector.query.mockResolvedValue(rows);
      await expect(tariffRepository.findByNaming(tariffNaming)).resolves.toEqual(rows[0]);
      expect(mockConnector.query).toHaveBeenCalledWith(
        expect.stringContaining(queryPattern),
        values,
      );
    });

    it('should return null if calling does not exist', async () => {
      const queryPattern = `SELECT * FROM ${TableName.Tariff} WHERE naming = ?; `;
      const tariffNaming = genRandomString();
      const values = [tariffNaming];
      const rows = [];

      mockConnector.query.mockResolvedValue(rows);
      await expect(tariffRepository.findByNaming(tariffNaming)).resolves.toEqual(null);
      expect(mockConnector.query).toHaveBeenCalledWith(
        expect.stringContaining(queryPattern),
        values,
      );
    });
  });

  describe('`findAllTariffs`', () => {
    it('should return all tariffs', async () => {
      const queryPattern = `SELECT * FROM ${TableName.Tariff}; `;
      const rows = [];

      mockConnector.query.mockResolvedValue(rows);
      await expect(tariffRepository.findAllTariffs()).resolves.toEqual(rows);
      expect(mockConnector.query).toHaveBeenCalledWith(
        expect.stringContaining(queryPattern),
      );
    });
  });

  describe('`findTariffsByUserId`', () => {
    it('should return tariffs for user with provided userId', async () => {
      const queryPattern = `SELECT * FROM ${TableName.Tariff} WHERE id`;
      const userId = genRandomInt();
      const values = [userId];
      const rows = [];

      mockConnector.query.mockResolvedValue(rows);
      await expect(tariffRepository.findTariffsByUserId(userId)).resolves.toEqual(rows);
      expect(mockConnector.query).toHaveBeenCalledWith(
        expect.stringContaining(queryPattern),
        values,
      );
    });
  });
});
import { TableName } from '@app/db';
import { Bill } from '@app/entity';
import { Currency } from '@app/entity/enum';
import { genRandomInt } from '@test/random';
import { BillRepository } from './bill.repository';

describe('`BillRepository`', () => {
  let billRepository: BillRepository;
  const mockConnector = {
    query: jest.fn(),
  };

  beforeEach(() => {
    billRepository = new BillRepository(mockConnector as any);
  });

  it('should be instance of `BillRepository`', () => {
    expect(billRepository).toBeInstanceOf(BillRepository);
    expect(new BillRepository()).toBeInstanceOf(BillRepository);
  });

  describe('`count`', () => {
    it(`should count rows in ${TableName.Bill} table`, async () => {
      const billCounter: number = genRandomInt();
      const queryPattern: string = `SELECT COUNT(*) as billCounter FROM ${TableName.Bill}; `;
      const rows = [{ billCounter }];

      mockConnector.query.mockResolvedValue(rows);
      await expect(billRepository.count()).resolves.toEqual(billCounter);
      expect(mockConnector.query).toHaveBeenCalledWith(
        expect.stringContaining(queryPattern)
      );
    });
  });

  describe('`findById`', () => {
    it(`should return bill if exists`, async () => {
      const queryPattern = `SELECT * FROM ${TableName.Bill} WHERE id = ?; `;
      const billId = genRandomInt();
      const values = [billId];
      const rows = [
        {
          id: billId,
          balance: genRandomInt(0, 1000),
        },
      ];

      mockConnector.query.mockResolvedValue(rows);
      await expect(billRepository.findById(billId)).resolves.toEqual(rows[0]);
      expect(mockConnector.query).toHaveBeenCalledWith(
        expect.stringContaining(queryPattern),
        values,
      );
    });

    it('should return null if bill does not exist', async () => {
      const queryPattern = `SELECT * FROM ${TableName.Bill} WHERE id = ?; `;
      const billId = genRandomInt();
      const values = [billId];
      const rows = [];

      mockConnector.query.mockResolvedValue(rows);
      await expect(billRepository.findById(billId)).resolves.toEqual(null);
      expect(mockConnector.query).toHaveBeenCalledWith(
        expect.stringContaining(queryPattern),
        values,
      );
    });
  });

  describe('`create`', () => {
    it('should create bill', async () => {
      const queryPattern = `INSERT INTO ${TableName.Bill}`;
      const bill = {
        user: {},
        balance: {},
        currency: Currency.UAH,
      };
      const values = [bill.user, bill.balance, bill.currency];

      await billRepository.create(bill as Bill);
      expect(mockConnector.query).toHaveBeenCalledWith(
        expect.stringContaining(queryPattern),
        values,
      );
    });
  });
});
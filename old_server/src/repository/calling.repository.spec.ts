import { TableName } from '@app/db';
import { Calling } from '@app/entity';
import { genRandomInt } from '@test/random';
import { CallingRepository } from './calling.repository';

describe('`CallingRepository`', () => {
  let callingRepository: CallingRepository;
  const mockConnector = {
    query: jest.fn(),
  };

  beforeEach(() => {
    callingRepository = new CallingRepository(mockConnector as any);
  });

  it('should be instance of `CallingRepository`', () => {
    expect(callingRepository).toBeInstanceOf(CallingRepository);
    expect(new CallingRepository()).toBeInstanceOf(CallingRepository);
  });

  describe('`count`', () => {
    it(`should count rows in ${TableName.Calling} table`, async () => {
      const callingCounter: number = genRandomInt();
      const queryPattern = `SELECT COUNT(*) as callingCounter FROM ${TableName.Calling}; `;
      const rows = [{ callingCounter }];

      mockConnector.query.mockResolvedValue(rows);
      await expect(callingRepository.count()).resolves.toEqual(callingCounter);
      expect(mockConnector.query).toHaveBeenCalledWith(
        expect.stringContaining(queryPattern)
      );
    });
  });

  describe('`findById`', () => {
    it(`should return calling if exists`, async () => {
      const queryPattern = `SELECT * FROM ${TableName.Calling} WHERE id = ?; `;
      const callingId = genRandomInt();
      const values = [callingId];
      const rows = [
        {
          id: callingId,
          cost: genRandomInt(0, 1000),
        },
      ];

      mockConnector.query.mockResolvedValue(rows);
      await expect(callingRepository.findById(callingId)).resolves.toEqual(rows[0]);
      expect(mockConnector.query).toHaveBeenCalledWith(
        expect.stringContaining(queryPattern),
        values,
      );
    });

    it('should return null if calling does not exist', async () => {
      const queryPattern = `SELECT * FROM ${TableName.Calling} WHERE id = ?; `;
      const callingId = genRandomInt();
      const values = [callingId];
      const rows = [];

      mockConnector.query.mockResolvedValue(rows);
      await expect(callingRepository.findById(callingId)).resolves.toEqual(null);
      expect(mockConnector.query).toHaveBeenCalledWith(
        expect.stringContaining(queryPattern),
        values,
      );
    });
  });

  describe('`create`', () => {
    it('should create calling', async () => {
      const queryPattern = `INSERT INTO ${TableName.Calling}`;
      const calling: Calling = {
        receiverId: genRandomInt(),
        senderId: genRandomInt(),
        cost: genRandomInt(),
        duration: genRandomInt(),
      };
      const values = [calling.receiverId, calling.senderId, calling.cost, calling.duration];

      await callingRepository.create(calling);
      expect(mockConnector.query).toHaveBeenCalledWith(
        expect.stringContaining(queryPattern),
        values,
      );
    });
  });

  describe('`findCallingsByUserId`', () => {
    it('should find calling for user with provided id', async () => {
      const userId = genRandomInt();
      const queryPattern = `SELECT * FROM ${TableName.Calling} WHERE receiverId = ? OR senderId = ?; `;
      const values = [userId, userId];
      const callings = [];

      mockConnector.query.mockResolvedValue(callings);

      await expect(callingRepository.findCallingsByUserId(userId))
        .resolves
        .toEqual(callings);
      expect(mockConnector.query).toHaveBeenCalledWith(queryPattern, values);
    });
  });
});
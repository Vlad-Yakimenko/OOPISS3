import { 
  genRandomArray, genRandomInt, genRandomType 
} from '@test/random';
import * as mysql from 'mysql2';
import {
  ResultSetHeader as SqlMetadata
} from 'mysql2/promise';

import { ILogger } from '../log';
import { Connector } from './';

const mockPromisePool = {
  query: jest.fn(),
};
const mockPool = {
  promise: jest.fn(() => mockPromisePool),
};

jest.mock('mysql2', () => {
  return {
    createPool: jest.fn(() => mockPool)
  }
});

describe('`Connector`', () => {
  let connector: Connector;

  let mockLogger: ILogger = {
    info: jest.fn(),
    warn: jest.fn(),
    error: jest.fn(),
  };

  beforeEach(() => {
    connector = new Connector(mockLogger);
  });

  it('should be instance of `Connector`', () => {
    expect(connector).toBeInstanceOf(Connector);
  });

  describe('`query`', () => {
    it('should execute non-select sql query and return empty array', async () => {
      const query = 'NON_SELECT_SQL_QUERY';
      const wrappedQuery = `START TRANSACTION; ${query} COMMIT;`;
      const values = genRandomArray(genRandomType, 3);
      const metadata = {
        affectedRows: genRandomInt(1),
        fieldCount: genRandomInt(1),
        // some other fields from `SqlMetadata`
      };
      const sqlData = [
        // no rows in response
        metadata,
      ];

      const querySpy = jest.spyOn(mockPromisePool, 'query').mockResolvedValue(sqlData);
      const data = await connector.query(query, values);

      expect(querySpy).toHaveBeenCalledWith(wrappedQuery, values);
      expect(data).toEqual([]);
    });

    it('should execute select sql query and return non-empty array', async () => {
      const query = 'SELECT_SQL_QUERY_WITHOUT_PLACEHOLDERS';
      const wrappedQuery = `START TRANSACTION; ${query} COMMIT;`;
      const rows = [{ rowField: genRandomType() }, { rowField: genRandomType() }];
      const metadata = {
        affectedRows: genRandomInt(1),
        fieldCount: genRandomInt(1), 
        // some other fields from `SqlMetadata`
      };
      const sqlData = [
        rows,
        metadata,
      ];

      const querySpy = jest.spyOn(mockPromisePool, 'query').mockResolvedValue(sqlData);
      const data = await connector.query(query);

      expect(querySpy).toHaveBeenCalledWith(wrappedQuery, []);
      expect(data).toEqual(rows);
    });

    it('should log error and execute rollback if provided invalid sql query', async () => {
      const query = 'INVALID_SQL_QUERY';
      const wrappedQuery = `START TRANSACTION; ${query} COMMIT;`;
      const values = genRandomArray(genRandomType, 3);
      const error = new Error('SQL_ERROR');

      const querySpy = jest.spyOn(mockPromisePool, 'query').mockRejectedValueOnce(error);
      const data = await connector.query(query, values);

      expect(querySpy).toHaveBeenCalledWith(wrappedQuery, values);
      expect(mockLogger.error).toHaveBeenNthCalledWith(
        1, expect.any(String), wrappedQuery, expect.any(String), JSON.stringify(values)
      );
      expect(mockLogger.error).toHaveBeenNthCalledWith(2, error.stack);
      expect(querySpy).toHaveBeenCalledWith('ROLLBACK;');
      expect(data).toEqual([]);
    });
  });
});

import * as mysql from 'mysql2';
import { 
  ResultSetHeader as SqlMetadata 
} from 'mysql2/promise';

import { ILogger } from '../log'; //TODO: replace with path alias
import { Connector } from './'; //TODO: replace with path alias

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
      const values = ['value1', 'value2', 'value3'];
      const metadata = {
        affectedRows: 1, //randint
        fieldCount: 1, //randint
        // some other fields from `SqlMetadata`
      };
      const sqlData = [
        // no rows in response
        metadata,
      ];

      const querySpy = jest.spyOn(mockPromisePool, 'query').mockResolvedValue(sqlData);
      const data = await connector.query(query, values);

      expect(querySpy).toHaveBeenCalledWith(query, values);
      expect(data).toEqual([]);
    });

    it('should execute select sql query and return non-empty array', async () => {
      const query = 'SELECT_SQL_QUERY';
      const values = ['value1', 'value2', 'value3'];
      const rows = [{ rowField: 'rawField1' }, { rowField: 'rawField2' }];
      const metadata = {
        affectedRows: 1, //randint
        fieldCount: 1, //randint
        // some other fields from `SqlMetadata`
      };
      const sqlData = [
        rows,
        metadata,
      ];

      const querySpy = jest.spyOn(mockPromisePool, 'query').mockResolvedValue(sqlData);
      const data = await connector.query(query, values);

      expect(querySpy).toHaveBeenCalledWith(query, values);
      expect(data).toEqual(rows);
    });

    it('should log error if provided invalid sql query', async () => {
      const query = 'INVALID_SQL_QUERY';
      const values = ['value1', 'value2', 'value3'];
      const error = new Error('SQL_ERROR');

      const querySpy = jest.spyOn(mockPromisePool, 'query').mockRejectedValue(error);
      const data = await connector.query(query, values);

      expect(querySpy).toHaveBeenCalledWith(query, values);
      expect(mockLogger.error).toHaveBeenNthCalledWith(1, expect.any(String), query, expect.any(String), JSON.stringify(values));
      expect(mockLogger.error).toHaveBeenNthCalledWith(2, error.stack);
      expect(data).toEqual([]);
    });
  });
});

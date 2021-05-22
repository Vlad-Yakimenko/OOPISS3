const mockSqlModule = {
  createConnection: jest.fn(),
};
jest.mock('mysql2/promise', () => mockSqlModule);

import { genRandomInt } from '@test/random';
import { ConnectionPool, POOL_SIZE } from './connection-pool';

describe('`ConnectionPool`', () => {
  let connectionPool: ConnectionPool;
  const mockConfig = {};

  beforeEach(() => {
    connectionPool = new ConnectionPool(mockConfig);
  });

  it('should be instance of `ConnectionPool`', () => {
    expect(connectionPool).toBeInstanceOf(ConnectionPool);
  });

  describe('`query`', () => {
    it('should get connection from a pool, execute query with placeholders and release connection', async () => {
      const query = 'SQL_QUERY_WITH_PLACEHOLDERS';
      const values = [];
      const data = [];

      const mockConnection = {
        query: jest.fn().mockResolvedValue(data),
      };
      jest.spyOn(connectionPool, 'getConnection').mockResolvedValueOnce(mockConnection as any);
      jest.spyOn(connectionPool, 'releaseConnection').mockImplementationOnce(() => null);

      await expect(connectionPool.query(query, values))
        .resolves
        .toEqual(data);
      expect(connectionPool.getConnection).toHaveBeenCalled();
      expect(mockConnection.query).toHaveBeenCalledWith(query, values);
    });

    it('should get connection from a pool, execute query without placeholders and release connection', async () => {
      const query = 'SQL_QUERY_WITHOUT_PLACEHOLDERS';
      const data = [];

      const mockConnection = {
        query: jest.fn().mockResolvedValue(data),
      };
      jest.spyOn(connectionPool, 'getConnection').mockResolvedValueOnce(mockConnection as any);
      jest.spyOn(connectionPool, 'releaseConnection').mockImplementationOnce(() => null);

      await expect(connectionPool.query(query))
        .resolves
        .toEqual(data);
      expect(connectionPool.getConnection).toHaveBeenCalled();
      expect(mockConnection.query).toHaveBeenCalledWith(query, []);
    });
  });

  describe('`getConnection`', () => {
    it('should throw error if pool is closed', async () => {
      await connectionPool.close();
      await expect(connectionPool.getConnection())
        .rejects
        .toThrowError();
    });

    it('should throw error if connection limit reached', async () => {
      for (let i = 0; i < POOL_SIZE; i++) {
        await connectionPool.getConnection();
      }

      mockSqlModule.createConnection.mockResolvedValue({});
      await expect(connectionPool.getConnection())
        .rejects
        .toThrowError();
    });

    it('should create connection if there are no free connections available', async () => {
      const mockConnection = {};
      mockSqlModule.createConnection.mockResolvedValue(mockConnection);

      await expect(connectionPool.getConnection())
        .resolves
        .toEqual(mockConnection);
    });

    it('should get connection from free connections and does not create new one', async () => {
      const mockConnection = {};
      mockSqlModule.createConnection.mockResolvedValue(mockConnection);

      await connectionPool.getConnection();
      connectionPool.releaseConnection(mockConnection as any);
      jest.clearAllMocks();

      await expect(connectionPool.getConnection())
        .resolves
        .toEqual(mockConnection);
      expect(mockSqlModule.createConnection).not.toHaveBeenCalled();
    });
  });

  describe('`close`', () => {
    it('should throw error if pool has already closed', async () => {
      await connectionPool.close();
      await expect(connectionPool.close())
        .rejects
        .toThrowError();
    });

    it('should release and close all connections in the pool', async () => {
      const amountOfConnections = 5;
      const amountOfFreeConnections = 2;
      const connections = [];

      const mockConnection = {
        end: jest.fn().mockResolvedValue(null),
      };

      mockSqlModule.createConnection.mockResolvedValue(mockConnection);
      
      for (let i = 0; i < amountOfConnections; i++) {
        const connection = await connectionPool.getConnection();
        connections.push(connection);
      }

      for (let i = 0; i < amountOfFreeConnections; i++) {
        connectionPool.releaseConnection(connections[i]);
      }

      jest.spyOn(connectionPool, 'releaseConnection');

      await connectionPool.close();
      expect(connectionPool.releaseConnection).toHaveBeenCalledTimes(amountOfConnections - amountOfFreeConnections);
      expect(mockConnection.end).toHaveBeenCalledTimes(amountOfConnections);
    });
  });
});

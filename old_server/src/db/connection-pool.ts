import { createConnection, Connection } from 'mysql2/promise';
import { PoolOptions } from 'mysql2';

export const POOL_SIZE: number = 15;

export class ConnectionPool {
  private isClosed: boolean = false;
  private freeConnections: Array<Connection> = [];
  private usedConnections: Array<Connection> = [];
  private readonly config: PoolOptions;

  constructor(
    config: PoolOptions,
  ) {
    this.config = config;
  }

  public async query(query: string, values: any[] = []): Promise<any> {
    const connection = await this.getConnection();
    return connection
      .query(query, values)
      .finally(() => { this.releaseConnection(connection) });
  }

  public async getConnection(): Promise<Connection> {
    if (this.isClosed) {
      throw new Error('Pool is closed');
    }

    if (this.usedConnections.length + this.freeConnections.length >= POOL_SIZE) {
      throw new Error('Connection limit reached');
    }

    let connection: Connection = this.freeConnections.length
      ? this.freeConnections.shift()
      : await createConnection(this.config);

    this.usedConnections.push(connection);
    return connection;
  }

  public releaseConnection(connection: Connection): void {
    this.freeConnections.push(connection);
    const connectionIndex = this.usedConnections.findIndex(con => con === connection);
    if (connectionIndex >= 0) {
      this.usedConnections.splice(connectionIndex, 1);
    }
  }

  public async close(): Promise<void> {
    if (this.isClosed) {
      throw new Error('Pool has already closed');
    }

    while (this.usedConnections.length) {
      const connection = this.usedConnections[this.usedConnections.length - 1];
      this.releaseConnection(connection);
    }

    this.freeConnections.forEach(conn => conn.end());
    this.freeConnections = this.usedConnections = [];
    this.isClosed = true;
  }
}

import * as mysql from 'mysql2';
import {
  Pool as PromisePool,
  ResultSetHeader as SqlMetadata,
} from 'mysql2/promise';
import { ILogger, Logger } from '../log';

const defaultDbOptions: mysql.PoolOptions = {
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  dateStrings: true,
  multipleStatements: true,
  debug: false,
  connectTimeout: 15000,
};

export class Connector {
  private readonly promisePool: PromisePool;

  constructor(
    private readonly logger: ILogger = new Logger(),
    private readonly dbOptions: mysql.PoolOptions = defaultDbOptions,
  ) {
    this.promisePool = mysql.createPool(dbOptions).promise();
  }

  /**
    * Raw SQL query execution (can send several queries at once, but it's more preferable to execute only one at a time)
    * @param {string} query - SQL query to execute
    * @param {any[]} values - Placeholder values for SQL query
    * @return {Promise<any>}
  **/
  public async query(query: string, values: any[] = []): Promise<any> {
    const wrappedQuery: string = this.wrapQueryWithTransaction(query);
    const rows: any = await this.promisePool
      .query(wrappedQuery, values)
      .then(([rows]) => rows)
      .catch(async (err) => {
        this.logger.error('DB error with query:', wrappedQuery, 'and values:', JSON.stringify(values));
        this.logger.error(err.stack);
        await this.promisePool.query('ROLLBACK;');
      });

    return this.parseSqlData(rows);
  }

  private wrapQueryWithTransaction(query: string): string {
    return `START TRANSACTION; ${query} COMMIT;`;
  }

  private parseSqlData(rows: any): any[] {
    return Array.isArray(rows)
      ? (rows as any[]).flat(10).filter(row => !this.isSqlMetadata(row))
      : [];
  }

  private isSqlMetadata(data: Record<string, any>): boolean {
    return 'affectedRows' in data
      && 'fieldCount' in data; // check `SqlMetadata` interface above
  }
}

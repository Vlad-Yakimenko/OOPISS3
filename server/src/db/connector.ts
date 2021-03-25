import * as mysql from 'mysql2';
import {
  Pool as PromisePool,
  ResultSetHeader as SqlMetadata,
} from 'mysql2/promise';


import { ILogger, Logger } from '../log';

const dbOptions: mysql.PoolOptions = {
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  dateStrings: true,
  multipleStatements: true,
  debug: false,
  connectTimeout: 15000
};

export class Connector {
  private readonly promisePool: PromisePool;

  constructor(
    private readonly logger: ILogger,
  ) {
    this.promisePool = mysql.createPool(dbOptions).promise();
  }

  // can send several requests at once, but it's more preferable to execute only one at a time
  public async query(query: string, values: any[] = []): Promise<any> {
    const rows: any = await this.promisePool
      .query(query, values)
      .then(([rows]) => rows)
      .catch(err => {
        this.logger.error('DB error with query:', query, 'and values:', JSON.stringify(values));
        this.logger.error(err.stack);
      });

    return this.parseSqlData(rows);
  }

  private parseSqlData(rows: any): any[] {
    return Array.isArray(rows)
      ? (rows as any[]).flat(10).filter(row => !this.isSqlMetadata(row))
      : [];
  }

  private isSqlMetadata(data: Record<string, any>): boolean { //TODO: try check data.constructor.name === 'ResultSetHeader'
    return 'affectedRows' in data 
      && 'fieldCount' in data; // check `SqlMetadata` interface above
  }
}

import { Connector } from "@app/db";

export abstract class AbstractRepository<TEntity> {
  protected readonly connector: Connector;

  constructor(
    connector: Connector
  ) {
    this.connector = connector;
  }

  public async query(query: string, values: any[] = []): Promise<any> {
    return this.connector.query(query, values);
  }

  public abstract findById(id: number): Promise<TEntity | null>;

  public abstract create(entity: TEntity): Promise<void>;

  public abstract count(): Promise<number>;
}

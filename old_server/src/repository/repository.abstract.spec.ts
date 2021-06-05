import { AbstractRepository } from "./repository.abstract";

class TestAbstractRepository extends AbstractRepository<any> {
  constructor(connector: any) {
    super(connector);
  }

  public async findById(): Promise<any> {
    throw new Error('This method should be tested for each repository separately, not here');
  }

  public async count(): Promise<any> {
    throw new Error('This method should be tested for each repository separately, not here');
  }

  public async create(): Promise<any> {
    throw new Error('This method should be tested for each repository separately, not here');
  }
}

describe('`AbstractRepository`', () => {
  let testAbstractRepository: TestAbstractRepository;
  const mockConnector = {
    query: jest.fn(),
  };

  beforeEach(() => {
    testAbstractRepository = new TestAbstractRepository(mockConnector);
  });

  it('should be instance of `AbstractRepository`', () => {
    expect(testAbstractRepository).toBeInstanceOf(AbstractRepository);
  });

  describe('`query`', () => {
    it('should make query without placeholder values', async () => {
      const query: string = 'sql_query';
      const rows = [];

      mockConnector.query.mockResolvedValue(rows);
      await expect(testAbstractRepository.query(query))
        .resolves
        .toEqual(rows);
      expect(mockConnector.query).toHaveBeenCalledWith(query, []);
    });

    it('should make query with placeholder values', async () => {
      const query: string = 'sql_query';
      const values = [{ value1: 'value1' }, 2, 'value3'];
      const rows = [];

      mockConnector.query.mockResolvedValue(rows);
      await expect(testAbstractRepository.query(query, values))
        .resolves
        .toEqual(rows);
      expect(mockConnector.query).toHaveBeenCalledWith(query, values);
    });
  });
});
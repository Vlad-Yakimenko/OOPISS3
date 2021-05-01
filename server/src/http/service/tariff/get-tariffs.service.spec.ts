import { Tariff } from '@app/entity/';
import { genRandomInt } from '@test/random';
import { GetTariffsService } from "./get-tariffs.service";


describe('`GetTariffsService`', () => {
  let getTariffsService: GetTariffsService;
  const mockTariffRepository = {
    findTariffsByUserId: jest.fn(),
    findAllTariffs: jest.fn(),
  };

  beforeEach(() => {
    getTariffsService = new GetTariffsService(mockTariffRepository as any);
  });

  it('should be instance of `GetTariffsService`', () => {
    expect(getTariffsService).toBeInstanceOf(GetTariffsService);
    expect(new GetTariffsService()).toBeInstanceOf(GetTariffsService);
  });

  describe('`getAllTariffs`', () => {
    it('should retrieve all tariffs if userId not provided', async () => {
      const tariffs: Tariff[] = [];
      mockTariffRepository.findAllTariffs.mockResolvedValue(tariffs);
      await expect(getTariffsService.getAllTariffs()).resolves.toEqual({
        tariffs,
      });
      expect(mockTariffRepository.findAllTariffs).toHaveBeenCalled();
      expect(mockTariffRepository.findTariffsByUserId).not.toHaveBeenCalled();
    });

    it('should retrieve tariffs for specific user if userId provided', async () => {
      const tariffs: Tariff[] = [];
      const userId: number = genRandomInt();

      mockTariffRepository.findTariffsByUserId.mockResolvedValue(tariffs);
      await expect(getTariffsService.getAllTariffs(userId)).resolves.toEqual({
        tariffs,
      });
      expect(mockTariffRepository.findAllTariffs).not.toHaveBeenCalled();
      expect(mockTariffRepository.findTariffsByUserId).toHaveBeenCalledWith(userId);
    });
  });
});
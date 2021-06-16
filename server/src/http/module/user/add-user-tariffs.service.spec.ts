import { AddUserTariffsDto } from '@app/shared/dto/user';
import { Tariff, User, Calling } from '@app/shared/interface';
import { HttpMessageResponse } from '@app/shared/enum';
import { ForbiddenException, NotFoundException } from '@app/shared/error';
import { genRandomFloat, genRandomInt } from '@test/random';
import { AddUserTariffsService } from './add-user-tariffs.service';

describe('`AddUserTariffsService`', () => {
  let addUserTariffsService: AddUserTariffsService;
  const mockUserRepository = {
    findById: jest.fn(),
    changeBalance: jest.fn(),
    addTariff: jest.fn()
  };

  beforeEach(() => {
    addUserTariffsService = new AddUserTariffsService(mockUserRepository as any);
  });

  it('should be instance of `AddUserTariffsService`', () => {
    expect(addUserTariffsService).toBeInstanceOf(AddUserTariffsService);
  });

  describe('`addTariffs`', () => {
    it('should throw `NotFountException` if user does not exist', async () => {
      const addUserTariffsDto: AddUserTariffsDto = {
        userId: genRandomInt(),
        tariffs: [
          { id: 1, cost: genRandomInt() } as Tariff,
          { id: 2, cost: genRandomInt() } as Tariff,
          { id: 3, cost: genRandomInt() } as Tariff,
        ]
      };
      mockUserRepository.findById.mockResolvedValue(null);

      await expect(addUserTariffsService.addTariffs(addUserTariffsDto))
        .rejects
        .toThrowError(NotFoundException);
      expect(mockUserRepository.findById).toHaveBeenCalledWith(addUserTariffsDto.userId);
    });

    it('should throw `ForbiddenException` if user does not have enough money', async () => {
      const userId = genRandomInt();
      const user = {
        id: userId,
        bill: {
          balance: genRandomFloat(1, 100, 2),
        }
      } as User;
      const addUserTariffsDto: AddUserTariffsDto = {
        userId,
        tariffs: [
          { id: 1, cost: genRandomInt(100, 200) } as Tariff,
          { id: 2, cost: genRandomInt(100, 200) } as Tariff,
          { id: 3, cost: genRandomInt(100, 200) } as Tariff,
        ]
      };

      mockUserRepository.findById.mockResolvedValue(user);
      await expect(addUserTariffsService.addTariffs(addUserTariffsDto))
        .rejects
        .toThrowError(ForbiddenException);
      expect(mockUserRepository.findById).toHaveBeenCalledWith(userId);
    });

    it('should change user balance and return status if user has enough money', async () => {
      const userId = genRandomInt();
      const user = {
        id: userId,
        bill: {
          balance: genRandomFloat(50, 100, 2),
        }
      } as User;
      const addUserTariffsDto: AddUserTariffsDto = {
        userId,
        tariffs: [
          { id: 1, cost: genRandomInt(1, 10) } as Tariff,
          { id: 2, cost: genRandomInt(1, 10) } as Tariff,
          { id: 3, cost: genRandomInt(1, 10) } as Tariff,
        ]
      };

      mockUserRepository.findById.mockResolvedValue(user);
      await expect(addUserTariffsService.addTariffs(addUserTariffsDto))
        .resolves
        .toEqual({ status: HttpMessageResponse.OK });
      expect(mockUserRepository.findById).toHaveBeenCalledWith(userId);
      expect(mockUserRepository.changeBalance).toHaveBeenCalledWith(userId, expect.any(Number));
      addUserTariffsDto.tariffs.forEach(tariff => {
        expect(mockUserRepository.addTariff).toHaveBeenCalledWith(userId, tariff.id);
      });
    });
  });
});

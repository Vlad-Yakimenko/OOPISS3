import { Calling, Tariff } from "@app/shared/interface";
import { Country } from "@app/db/entity/enum";
import { HttpMessageResponse } from "@app/shared/enum";
import { BadRequestException, ForbiddenException, NotFoundException } from "@app/shared/error";
import { genRandomInt } from "@test/random";
import { AddCallingsService } from "./add-callings.service";

describe('`AddCallingsService`', () => {
  let addCallingsService: AddCallingsService;
  const mockCallingRepository = {
    createAndSave: jest.fn(),
  };
  const mockUserRepository = {
    changeBalance: jest.fn(),
    findById: jest.fn(),
  };
  const mockTariffRepository = {
    findTariffsByUserId: jest.fn(),
  };

  beforeEach(() => {
    addCallingsService = new AddCallingsService(
      mockCallingRepository as any,
      mockUserRepository as any,
      mockTariffRepository as any,
    );
  });

  it('should be instance of `AddCallingsService`', () => {
    expect(addCallingsService).toBeInstanceOf(AddCallingsService);
  });

  describe('`addCallings`', () => {
    it('should throw `BadRequestException` if user does not provided as sender at least in one calling', async () => {
      const userId = genRandomInt();
      const callings = [
        {
          id: genRandomInt(),
          receiverId: userId,
          senderId: userId + 1,
        }
      ] as Calling[];

      await expect(addCallingsService.addCallings({ userId, callings }))
        .rejects
        .toThrowError(BadRequestException);
    });

    it('should throw `BadRequestException` if provided incorrect cost at least for one calling', async () => {
      const userId = genRandomInt();
      const callings = [
        {
          id: genRandomInt(),
          receiverId: genRandomInt(),
          senderId: userId,
          duration: genRandomInt(),
        }
      ] as Calling[];
      const tariffs = [
        {
          id: genRandomInt(),
          country: Country.Ukraine,
          discount: genRandomInt(1, 50)
        },
      ] as Tariff[];
      const receiver = {
        id: genRandomInt(),
        country: Country.Ukraine
      };

      mockUserRepository.findById.mockResolvedValue(receiver);
      mockTariffRepository.findTariffsByUserId.mockResolvedValue(tariffs);

      await expect(addCallingsService.addCallings({ userId, callings }))
        .rejects
        .toThrowError(BadRequestException);
    });

    it('should throw `NotFoundException` if user with provided userId does not exist', async () => {
      const userId = genRandomInt();
      const callings = [
        {
          id: genRandomInt(),
          receiverId: userId + 1,
          senderId: userId,
          duration: 10,
          cost: 10,
        }
      ] as Calling[];
      const tariffs = [] as Tariff[];
      const receiver = {
        id: genRandomInt(),
        country: Country.Ukraine
      };

      mockUserRepository.findById
        .mockResolvedValueOnce(receiver)
        .mockResolvedValueOnce(null)
      mockTariffRepository.findTariffsByUserId.mockResolvedValue(tariffs);

      await expect(addCallingsService.addCallings({ userId, callings }))
        .rejects
        .toThrowError(NotFoundException);
    });

    it('should throw `ForbiddenException` if user does not have enough money', async () => {
      const userId = genRandomInt();
      const callings = [
        {
          id: genRandomInt(),
          receiverId: userId + 1,
          senderId: userId,
          duration: 10,
          cost: 10,
        }
      ] as Calling[];
      const tariffs = [] as Tariff[];
      const receiver = {
        id: genRandomInt(),
        country: Country.Ukraine
      };
      const notEnoughBalance: number = -1;

      mockUserRepository.findById
        .mockResolvedValueOnce(receiver)
        .mockImplementationOnce((userId: number) => {
          return {
            id: userId,
            bill: { balance: notEnoughBalance }
          }
        });
      mockTariffRepository.findTariffsByUserId.mockResolvedValue(tariffs);

      await expect(addCallingsService.addCallings({ userId, callings }))
        .rejects
        .toThrowError(ForbiddenException);
    });

    it('should process all provided callings and return OK status if user has enough money', async () => {
      const userId = genRandomInt();
      const callings = [
        {
          id: genRandomInt(),
          receiverId: userId + 1,
          senderId: userId,
          duration: 10,
          cost: 10,
        }
      ] as Calling[];
      const tariffs = [] as Tariff[];
      const receiver = {
        id: genRandomInt(),
        country: Country.Ukraine
      };
      const totalCallingsCost: number = callings.reduce((acc, calling) => acc + calling.cost, 0);
      const enoughBalance: number = totalCallingsCost + 1;

      mockUserRepository.findById
        .mockResolvedValueOnce(receiver)
        .mockImplementationOnce((userId: number) => {
          return {
            id: userId,
            bill: { balance: enoughBalance }
          }
        });
      mockTariffRepository.findTariffsByUserId.mockResolvedValue(tariffs);

      await expect(addCallingsService.addCallings({ userId, callings }))
        .resolves
        .toEqual({ status: HttpMessageResponse.OK });
      callings.forEach((calling) => {
        expect(mockCallingRepository.createAndSave).toHaveBeenCalledWith(calling);
      });
      expect(mockUserRepository.changeBalance).toHaveBeenCalledWith(userId, enoughBalance - totalCallingsCost);
    });
  });
});

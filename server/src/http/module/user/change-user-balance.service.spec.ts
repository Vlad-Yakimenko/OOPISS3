import { ChangeUserBalanceDto } from '@app/shared/dto/user';
import { HttpMessageResponse } from '@app/shared/enum';
import { genRandomFloat, genRandomInt } from '@test/random';
import { ChangeUserBalanceService } from './change-user-balance.service';

describe('`ChangeUserBalanceService`', () => {
  let changeUserBalanceService: ChangeUserBalanceService;
  const mockUserRepository = {
    changeBalance: jest.fn(),
  };

  beforeEach(() => {
    changeUserBalanceService = new ChangeUserBalanceService(mockUserRepository as any);
  });

  it('should be instance of `ChangeUserBalanceService`', () => {
    expect(changeUserBalanceService).toBeInstanceOf(ChangeUserBalanceService);
  });

  describe('`changeUserBalance`', () => {
    it('should change user balance and return status', async () => {
      const changeUserBalanceDto: ChangeUserBalanceDto = {
        userId: genRandomInt(),
        newBalance: genRandomFloat()
      };
      mockUserRepository.changeBalance.mockResolvedValue(null);
      await expect(changeUserBalanceService.changeUserBalance(changeUserBalanceDto)).resolves.toEqual({
        status: HttpMessageResponse.OK
      });
      expect(mockUserRepository.changeBalance).toHaveBeenCalledWith(
        changeUserBalanceDto.userId, changeUserBalanceDto.newBalance
      );
    });
  });
});

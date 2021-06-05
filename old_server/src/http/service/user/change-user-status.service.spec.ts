import { ChangeUserStatusDto } from '@app/dto/user';
import { HttpMessageResponse } from '@app/http/enum';
import { genRandomInt } from '@test/random';
import { ChangeUserStatusService } from './change-user-status.service';

describe('`ChangeUserStatusService`', () => {
  let changeUserStatusService: ChangeUserStatusService;
  const mockUserRepository = {
    changeStatus: jest.fn(),
  };

  beforeEach(() => {
    changeUserStatusService = new ChangeUserStatusService(mockUserRepository as any);
  });

  it('should be instance of `ChangeUserStatusService`', () => {
    expect(changeUserStatusService).toBeInstanceOf(ChangeUserStatusService);
    expect(new ChangeUserStatusService()).toBeInstanceOf(ChangeUserStatusService);
  });

  describe('`changeUserStatus`', () => {
    it('should change user status to opposite and return status', async () => {
      const changeUserStatusDto: ChangeUserStatusDto = {
        userId: genRandomInt(),
      };
      mockUserRepository.changeStatus.mockResolvedValue(null);
      await expect(changeUserStatusService.changeUserStatus(changeUserStatusDto)).resolves.toEqual({
        status: HttpMessageResponse.OK
      });
      expect(mockUserRepository.changeStatus).toHaveBeenCalledWith(changeUserStatusDto.userId);
    });
  });
});

import { Role } from "@app/entity/enum";
import { NotFoundException } from "@app/http/error";
import { genRandomInt, genRandomString } from "@test/random";
import { GetUsersService } from "./get-users.service";

describe('`GetUsersService`', () => {
  let getUsersService: GetUsersService;
  const mockUserRepository = {
    findAllAbonents: jest.fn(),
    findById: jest.fn(),
    findByUsername: jest.fn(),
  };

  beforeEach(() => {
    getUsersService = new GetUsersService(mockUserRepository as any);
  });

  it('should be instance of `GetUsersService`', () => {
    expect(getUsersService).toBeInstanceOf(GetUsersService);
    expect(new GetUsersService()).toBeInstanceOf(GetUsersService);
  });

  describe('`getAbonents`', () => {
    it('should retrieve all abonents from the database', () => {
      const abonents = [
        {
          id: 1,
          username: 'user1',
          role: Role.Abonent,
        },
        {
          id: 2,
          username: 'user2',
          role: Role.Abonent,
        },
        {
          id: 3,
          username: 'user3',
          role: Role.Abonent,
        }
      ];
      mockUserRepository.findAllAbonents.mockResolvedValue(abonents);

      expect(getUsersService.getAbonents()).resolves.toEqual({ abonents });
      expect(mockUserRepository.findAllAbonents).toHaveBeenCalledTimes(1);
    });
  });

  describe('`getUserById`', () => {
    it('should throw NotFoundException if user not exists', () => {
      const unexistingUserId = genRandomInt(1, 100);
      mockUserRepository.findById.mockResolvedValue(null);

      expect(getUsersService.getUserById(unexistingUserId)).rejects.toThrowError(NotFoundException);
      expect(mockUserRepository.findById).toHaveBeenCalledTimes(1);
    });

    it('should retrieve user if exists', () => {
      const user = {
        id: genRandomInt(1, 100),
        username: genRandomString(7),
      };
      mockUserRepository.findById.mockResolvedValue(user);

      expect(getUsersService.getUserById(user.id)).resolves.toEqual({ user });
      expect(mockUserRepository.findById).toHaveBeenCalledTimes(1);
    });
  });

  describe('`getUserByUsername`', () => {
    it('should throw NotFoundException if user not exists', () => {
      const unexistingUsername = 'unexistingUsername';
      mockUserRepository.findByUsername.mockResolvedValue(null);

      expect(getUsersService.getUserByUsername(unexistingUsername)).rejects.toThrowError(NotFoundException);
      expect(mockUserRepository.findByUsername).toHaveBeenCalledTimes(1);
    });

    it('should retrieve user if exists', () => {
      const user = {
        id: genRandomInt(1, 100),
        username: genRandomString(7),
      };
      mockUserRepository.findByUsername.mockResolvedValue(user);

      expect(getUsersService.getUserByUsername(user.username)).resolves.toEqual({ user });
      expect(mockUserRepository.findByUsername).toHaveBeenCalledTimes(1);
    });
  });
});

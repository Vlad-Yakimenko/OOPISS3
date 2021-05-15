import { Role } from "@app/entity/enum";
import { NotFoundException } from "@app/http/error";
import { genRandomInt, genRandomString } from "@test/random";
import { GetUsersService } from "./get-users.service";

describe('`GetUsersService`', () => {
  let getUsersService: GetUsersService;
  const mockUserRepository = {
    findAllAbonents: jest.fn(),
    findById: jest.fn(),
    findByPhone: jest.fn(),
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
          phone: 'user1',
          role: Role.Abonent,
        },
        {
          id: 2,
          phone: 'user2',
          role: Role.Abonent,
        },
        {
          id: 3,
          phone: 'user3',
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
        phone: genRandomString(7),
      };
      mockUserRepository.findById.mockResolvedValue(user);

      expect(getUsersService.getUserById(user.id)).resolves.toEqual({ user });
      expect(mockUserRepository.findById).toHaveBeenCalledTimes(1);
    });
  });

  describe('`getUserByPhone`', () => {
    it('should throw NotFoundException if user not exists', () => {
      const unexistingPhone = 'unexistingPhone';
      mockUserRepository.findByPhone.mockResolvedValue(null);

      expect(getUsersService.getUserByPhone(unexistingPhone)).rejects.toThrowError(NotFoundException);
      expect(mockUserRepository.findByPhone).toHaveBeenCalledTimes(1);
    });

    it('should retrieve user if exists', () => {
      const user = {
        id: genRandomInt(1, 100),
        phone: genRandomString(7),
      };
      mockUserRepository.findByPhone.mockResolvedValue(user);

      expect(getUsersService.getUserByPhone(user.phone)).resolves.toEqual({ user });
      expect(mockUserRepository.findByPhone).toHaveBeenCalledTimes(1);
    });
  });
});

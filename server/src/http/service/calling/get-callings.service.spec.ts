import { genRandomInt } from "@test/random";
import { GetCallingsService } from "./get-callings.service";

describe('`GetCallingsService`', () => {
  let getCallingsService: GetCallingsService;
  const mockCallingRepository = {
    findCallingsByUserId: jest.fn(),
  };

  beforeEach(() => {
    getCallingsService = new GetCallingsService(mockCallingRepository as any);
  });

  it('should be instance of `GetCallingsService`', () => {
    expect(getCallingsService).toBeInstanceOf(GetCallingsService);
    expect(new GetCallingsService()).toBeInstanceOf(GetCallingsService);
  });

  describe('`getCallings`', () => {
    it('should retrieve both outgoing and incoming callings for user', async () => {
      const userId = genRandomInt(5, 100);
      const callings = [
        {
          id: 1,
          receiverId: userId,
          senderId: 1,
        }, 
        {
          id: 2,
          receiverId: userId,
          senderId: 2,
        }, 
        {
          id: 3,
          senderId: userId,
          receiverId: 3,
        }, 
        {
          id: 4,
          senderId: userId,
          receiverId: 4,
        }
      ];
      const incomingCallings = callings.filter(calling => calling.receiverId === userId);
      const outgoingCallings = callings.filter(calling => calling.senderId === userId);

      mockCallingRepository.findCallingsByUserId.mockResolvedValue(callings);

      await expect(getCallingsService.getCallings(userId)).resolves.toEqual({
        outgoingCallings,
        incomingCallings,
      });
    });
  });
});

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
    it('should retrieve both outgoing and incoming calling for user', async () => {
      const userId = genRandomInt();
      const callings = [
        {
          id: genRandomInt(),
          receiverId: userId,
          senderId: genRandomInt(),
        }, 
        {
          id: genRandomInt(),
          receiverId: userId,
          senderId: genRandomInt(),
        }, 
        {
          id: genRandomInt(),
          senderId: userId,
          receiverId: genRandomInt(),
        }, 
        {
          id: genRandomInt(),
          senderId: userId,
          receiverId: genRandomInt(),
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

import { Calling } from "@app/entity";
import { CallingRepository } from "@app/repository";

export class GetCallingsService {
  constructor(
    private readonly callingRepository: CallingRepository = new CallingRepository(),
  ) { }

  public async getCallings(userId: number): Promise<{
    outgoingCallings: Calling[],
    incomingCallings: Calling[],
  }> {
    const outgoingCallings: Calling[] = [];
    const incomingCallings: Calling[] = [];

    const callings: Calling[] = await this.callingRepository.findCallingsByUserId(userId);

    callings.forEach(calling => {
      calling.receiverId === userId
        ? incomingCallings.push(calling)
        : outgoingCallings.push(calling);
    });

    return {
      outgoingCallings,
      incomingCallings,
    }
  }
}

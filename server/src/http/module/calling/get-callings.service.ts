import { Injectable } from "@nestjs/common";

import { Calling } from "@app/shared/interface";
import { CallingRepository } from "@app/db/repository";

@Injectable()
export class GetCallingsService {
  constructor(
    private readonly callingRepository: CallingRepository,
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

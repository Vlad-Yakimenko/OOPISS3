import { Tariff } from "@app/entity";
import { TariffRepository } from "@app/repository";

export class GetTariffsService {
  constructor(
    private readonly tariffRepository: TariffRepository = new TariffRepository(),
  ) { }

  public async getAllTariffs(userId?: number): Promise<{ tariffs: Tariff[] }> {
    const tariffs: Tariff[] = userId
      ? await this.tariffRepository.findTariffsByUserId(userId)
      : await this.tariffRepository.findAllTariffs();
    return { tariffs };
  }
}
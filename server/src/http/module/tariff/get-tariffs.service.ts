import { Tariff } from "@app/shared/interface";
import { TariffRepository } from "@app/db/repository";
import { Injectable } from "@nestjs/common";

@Injectable()
export class GetTariffsService {
  constructor(
    private readonly tariffRepository: TariffRepository,
  ) { }

  public async getAllTariffs(userId?: number): Promise<{ tariffs: Tariff[] }> {
    const tariffs: Tariff[] = userId
      ? await this.tariffRepository.findTariffsByUserId(userId)
      : await this.tariffRepository.findAllTariffs();
    return { tariffs };
  }
}
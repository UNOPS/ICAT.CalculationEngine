import { Injectable } from '@nestjs/common';

@Injectable()
export class MacService {
  public pmtCalculation(
    discount_rate: number,
    project_life: number,
    totalInvestment: number,
  ) {
    const presentage = 100;
    if (project_life == 0) {
      return 0;
    } else {
      const presentValueInterstFector = Math.pow(
        1 + discount_rate / presentage,
        project_life,
      );
      const pmt =
        ((discount_rate / presentage) *
          totalInvestment *
          presentValueInterstFector) /
        (presentValueInterstFector - 1);
      return pmt;
    }
  }

  public totolCost(
    invest: number,
    OM: number,
    fuelCost: number,
    other: number,
  ) {
    return invest + OM + fuelCost + other;
  }
}

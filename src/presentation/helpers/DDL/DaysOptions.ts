import { DaysEnum } from "@domain/enums/days/DaysEnum";

export interface IDaysOptionsDDL {
  value: number;
  label: string;
}
export const DaysOptionsDDL: IDaysOptionsDDL[] = Object.keys(DaysEnum)
  .filter((v) => isNaN(Number(v)))
  .map((key) => ({
    value: DaysEnum[key as keyof typeof DaysEnum],
    label: key,
  }));
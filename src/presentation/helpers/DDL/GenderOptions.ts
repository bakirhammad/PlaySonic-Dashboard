import { GenderEnum } from "@domain/enums/gender/GenderEnum";

export interface IfeatureOptionsDDL {
  value: number;
  label: string;
}
export const GenderOptionsDDL: IfeatureOptionsDDL[] = Object.keys(GenderEnum)
  .filter((v) => isNaN(Number(v)))
  .map((key) => ({
    value: GenderEnum[key as keyof typeof GenderEnum],
    label: key,
  }));
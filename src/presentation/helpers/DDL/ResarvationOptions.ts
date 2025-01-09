import { ReservationTypeEnum } from "@domain/enums/reservationType/ReservationTypeEnum";

export interface IResarvationOptionsDDL {
  value: number;
  label: string;
}
export const ResarvationOptions: IResarvationOptionsDDL[] = Object.keys(ReservationTypeEnum)
  .filter((v) => isNaN(Number(v)))
  .map((key) => ({
    value: ReservationTypeEnum[key as keyof typeof ReservationTypeEnum],
    label: key,
  }));
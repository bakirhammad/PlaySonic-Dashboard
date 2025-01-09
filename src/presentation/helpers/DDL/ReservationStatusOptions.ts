import { ReservationStatusEnum } from "@domain/enums/reservationStatus/ReservationStatusEnum";

export interface IReservationStatusOptionsDDL {
  value: number;
  label: string;
}
export const ReservationStatusOptionsOptions: IReservationStatusOptionsDDL[] = Object.keys(ReservationStatusEnum)
  .filter((v) => isNaN(Number(v)))
  .map((key) => ({
    value: ReservationStatusEnum[key as keyof typeof ReservationStatusEnum],
    label: key,
  }));
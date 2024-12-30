import { GMTTimeZones } from "@domain/enums";
export interface IGMTTimeZonesOptionsDDL {
  value: number;
  label: string;
  image?: string | undefined;
}
export const GMTTimeZonesOptionsDDL: IGMTTimeZonesOptionsDDL[] = Object.keys(
  GMTTimeZones
)
  .filter((v) => isNaN(Number(v)))
  .map((key) => ({
    value: GMTTimeZones[key as keyof typeof GMTTimeZones],
    label: key,
  }));

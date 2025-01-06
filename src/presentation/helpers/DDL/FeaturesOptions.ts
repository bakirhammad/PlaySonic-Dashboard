import { ClubFeaturesEnum } from "@domain/enums/clubFeature/ClubFeaturesEnum";

export interface IfeatureOptionsDDL {
  value: number;
  label: string;
}
export const FeaturesOptionsDDL: IfeatureOptionsDDL[] = Object.keys(ClubFeaturesEnum)
  .filter((v) => isNaN(Number(v)))
  .map((key) => ({
    value: ClubFeaturesEnum[key as keyof typeof ClubFeaturesEnum],
    label: key,
  }));
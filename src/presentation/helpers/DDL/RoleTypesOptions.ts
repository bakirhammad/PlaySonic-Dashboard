import { RoleTypesEnum } from "@domain/enums/roleTypesEnum/RoleTypesEnum";

export interface IRolesOptionsDDL {
  value: number;
  label: string;
}
export const RoleTypesOptions: IRolesOptionsDDL[] = Object.keys(RoleTypesEnum)
  .filter((v) => isNaN(Number(v)))
  .map((key) => ({
    value: RoleTypesEnum[key as keyof typeof RoleTypesEnum],
    label: key,
  }));
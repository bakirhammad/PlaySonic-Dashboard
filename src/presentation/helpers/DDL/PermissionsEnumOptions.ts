import { PermissionsEnum } from "@domain/enums/PermissionsEnum/PermissionsEnum";

export interface IRolesOptionsDDL {
  value: number;
  label: string;
}
export const PermissionsEnumOptions: IRolesOptionsDDL[] = Object.keys(PermissionsEnum)
  .filter((v) => isNaN(Number(v)))
  .map((key) => ({
    value: PermissionsEnum[key as keyof typeof PermissionsEnum],
    label: key,
  }));
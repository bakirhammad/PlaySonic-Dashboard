import { IDDlOption } from "@domain/entities";

const DDL = () => {
  const daysDDL: IDDlOption[] = Array.from({ length: 31 }).map(
    (array, index) => {
      return { label: String(index + 1), value: index + 1 };
    }
  );
  return daysDDL;
};
export const daysDDLOption = DDL();

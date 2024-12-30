import { IDDlOption } from "@domain/entities";

const DDL = () => {
  const minutsDDl: IDDlOption[] = Array.from({ length: 60 }).map(
    (array, index) => {
      return { label: String(index + 1), value: index + 1 };
    }
  );
  return minutsDDl;
};
export const mintsDDlOption = DDL();

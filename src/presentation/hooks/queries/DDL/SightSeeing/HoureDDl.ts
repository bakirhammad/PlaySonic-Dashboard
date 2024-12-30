import { IDDlOption } from "@domain/entities";

const DDL = () => {
  const HoureDDl: IDDlOption[] = Array.from({ length: 24 }).map(
    (array, index) => {
      return { label: String(index + 1), value: index + 1 };
    }
  );
  return HoureDDl;
};
export const hoursDDlOption = DDL();

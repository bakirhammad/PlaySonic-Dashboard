import { useCourtsDDL } from "@presentation/hooks/queries/DDL/Court/useCourtsDDL";
import { FC } from "react";

export interface ICourtName {
  courtId: number;
}

const CourtNameCell: FC<ICourtName> = ({courtId}) => {
  const {CourtsOption} = useCourtsDDL();
  const courtName = CourtsOption.map((elem) => {
    if (elem.value === courtId) {
      return elem.label;
    }
  });
  return courtName;
};

export default CourtNameCell;

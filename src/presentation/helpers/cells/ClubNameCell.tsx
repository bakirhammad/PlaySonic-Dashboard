import { useClubsDDL } from "@presentation/hooks/queries/DDL/Club/useClubsDDL";
import { FC } from "react";

export interface IClubName {
  clubId: number;
}

const ClubNameCell: FC<IClubName> = ({clubId}) => {
  const { clubsOption } = useClubsDDL();
  const clubName = clubsOption.map((elem) => {
    if (elem.value === clubId) {
      return elem.label;
    }
  });
  return clubName;
};

export default ClubNameCell;

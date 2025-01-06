import { useSlotTypesDDL } from "@presentation/hooks/queries/DDL/SlotTypes/useSlotTypesDDL";
import { FC } from "react";

export interface ICourtName {
  slotTypeId: number;
}

const SlotTypeNameCell: FC<ICourtName> = ({ slotTypeId }) => {
  const { SlotTypesOption } = useSlotTypesDDL();
  const SlotTypeName = SlotTypesOption.map((elem) => {
    if (elem.value === slotTypeId) {
      return elem.label;
    }
  });
  return SlotTypeName;
};

export default SlotTypeNameCell;

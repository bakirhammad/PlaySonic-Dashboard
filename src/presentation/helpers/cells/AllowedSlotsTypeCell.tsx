import { useSlotTypesDDL } from "@presentation/hooks/queries/DDL/SlotTypes/useSlotTypesDDL";
import { FC } from "react";

type Props = {
  slot: number;
};

const AllowedSlotsTypeCell: FC<Props> = ({ slot }) => {
  const { SlotTypesOption } = useSlotTypesDDL();

  const matchingLabels = SlotTypesOption.filter(
    (option) => (option.value & slot) === option.value
  ).map((option) => option.label);

  return (
    <div className="d-flex align-items-center w-150px">
      <div className="d-flex flex-wrap gap-2">
        {matchingLabels.map((label, index) => (
          <span className="badge text-bg-secondary fw-bolder" key={index}>
            {label}
          </span>
        ))}
      </div>
    </div>
  );
};

export { AllowedSlotsTypeCell };

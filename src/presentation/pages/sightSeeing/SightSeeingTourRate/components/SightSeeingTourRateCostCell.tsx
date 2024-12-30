import SightSeeingCustomCostCell from "@presentation/components/tables/cells/SightSeeingCustomCostCell";
import { useQueryRequest } from "@presentation/context";
import { FC } from "react";
type Props = {
  index: number;
};
const SightSeeingTourRateCostCell: FC<Props> = ({ index }) => {
  const { data } = useQueryRequest();
  const SightSeeingTourRate = data.data[index];

  const cost = SightSeeingTourRate?.adultCost || 0;
  const markup = SightSeeingTourRate?.adultMarkup || 0;

  return (
    <>
      <SightSeeingCustomCostCell cost={cost} markup={markup} />
    </>
  );
};

export { SightSeeingTourRateCostCell };

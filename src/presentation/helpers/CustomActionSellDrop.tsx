import { ActionItem } from "@presentation/components";
import { FC } from "react";
import { useNavigate } from "react-router-dom";

interface ICourtId {
  courtId: number;
}
const CustomActionSellDrop: FC<ICourtId> = ({ courtId }) => {
  const navigate = useNavigate();
  return (
    <div>
      <ActionItem
        icon=""
        onClick={() => navigate(`/apps/courtslots/${courtId}`)}
        title="Court Slots"
      />
      <ActionItem
        icon=""
        onClick={() => navigate(`/apps/courtschedule/${courtId}`)}
        title="Court Schedule"
      />
    </div>
  );
};

export default CustomActionSellDrop;

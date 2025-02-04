import { ActionItem } from "@presentation/components";
import { FC } from "react";
import { useNavigate } from "react-router-dom";

interface ICourtId {
  courtId: number;
  isSuper: boolean;
}
const CustomActionSellDrop: FC<ICourtId> = ({ courtId, isSuper }) => {
  const navigate = useNavigate();
  return (
    <div>
      <ActionItem
        icon=""
        onClick={() =>
          isSuper
            ? navigate(`/apps/court/courtslots/${courtId}`)
            : navigate(`/apps/courtslots/${courtId}`)
        }
        title="Court Slots"
      />
      <ActionItem
        icon=""
        onClick={() =>
          isSuper
            ? navigate(`/apps/court/courtschedule/${courtId}`)
            : navigate(`/apps/courtschedule/${courtId}`)
        }
        title="Court Schedule"
      />
    </div>
  );
};

export default CustomActionSellDrop;

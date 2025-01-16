import {
  ActionItem,
  CustomButton,
  CustomToast,
} from "@presentation/components";
import { CustomComfirmationAlert } from "@presentation/components/alerts/CustomComfirmationAlert";
import { FC } from "react";

interface IStatusApproval {
  id: number;
}
const StatusApproval: FC<IStatusApproval> = ({ id }) => {
  const handleSubmit = async (statusId: number) => {
    try {
      const confirmAction = await CustomComfirmationAlert(
        "Are You Sure?",
        "Yes"
      );

      if (confirmAction) {
        CustomToast(`Success`, "success");
      }
    } catch {
      console.log("Error");
    }
  };
  return (
    <div className="d-flex tw-flex-col ">
      <ActionItem
        icon="tablet-ok"
        onClick={() => handleSubmit(2)}
        title="Approve"
      />
      <ActionItem
        icon="tablet-delete"
        onClick={() => handleSubmit(16)}
        title="Reject"
      />

      {/* <CustomButton
        text={"Approve"}
        className={"btn btn-primary tw-w-32"}
        onClick={() => handleSubmit(2)}
      />
      <CustomButton
        text={"Reject"}
        className={"btn btn-danger tw-w-32"}
        onClick={() => handleSubmit(16)}
      /> */}
    </div>
  );
};

export default StatusApproval;

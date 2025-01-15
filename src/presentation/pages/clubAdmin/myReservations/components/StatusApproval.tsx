import { ActionItem, CustomButton } from "@presentation/components";
import { FC, useState } from "react";

interface IStatusApproval {
  id: number;
}
const StatusApproval: FC<IStatusApproval> = ({ id }) => {
  const [statusId, setStatusId] = useState("");

  const handleSubmit = async (statusId: number) => {
    // try{
    // }catch{
    // }
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

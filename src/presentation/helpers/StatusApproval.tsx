import { StatusCommandInstance } from "@app/useCases/general/status/command/StatusCommand";
import { StatusUrlEnum } from "@domain/enums/URL/General/GeneralEnum/StatusEnum";
import { ActionItem, CustomToast } from "@presentation/components";
import { CustomComfirmationAlert } from "@presentation/components/alerts/CustomComfirmationAlert";
import { QUERIES } from "@presentation/helpers";
import { FC } from "react";
import { useQueryClient } from "react-query";

interface IStatusApproval {
  id: number;
}
const StatusApproval: FC<IStatusApproval> = ({ id }) => {
  const queryClient = useQueryClient();
  const handleSubmit = async (statusId: number, statusType: string) => {
    try {
      const confirmAction = await CustomComfirmationAlert(
        `Are You Want to ${statusType} ?`,
        "Yes"
      );

      if (confirmAction) {
        const formData = new FormData();

        formData.append("Id", id.toString());
        formData.append("Status", statusId.toString());
        const statusResult = await StatusCommandInstance.updateStatus(
          StatusUrlEnum.UpdateStatus,
          formData
        );
        if (statusResult) {
          console.log(statusResult, "statusresres");
          CustomToast(`Success Update Status`, "success");
          queryClient.invalidateQueries({
            queryKey: ["MyReservations"],
          });
        } else {
          CustomToast(`Failed to  Update Status`, "error");
        }
      }
    } catch (error) {
      console.error("Error when Update Status", error);
      CustomToast(`Failed to Update Status`, "error");
    }
  };
  return (
    <div className="d-flex tw-flex-col">
      <ActionItem
        icon="tablet-ok"
        onClick={() => handleSubmit(2, "Approve")}
        title="Approve"
      />
      <ActionItem
        icon="tablet-delete"
        onClick={() => handleSubmit(16, "Reject")}
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

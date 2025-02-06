import { StatusCommandInstance } from "@app/useCases/general/status/command/StatusCommand";
import { ReservationQueryByIdInstance } from "@app/useCases/reservation";
import { ReservationStatusEnum } from "@domain/enums/reservationStatus/ReservationStatusEnum";
import { StatusUrlEnum } from "@domain/enums/URL/General/GeneralEnum/StatusEnum";
import { ReservationUrlEnum } from "@domain/enums/URL/Reservation/reservationUrls/Reservation";
import { ActionItem, CustomToast } from "@presentation/components";
import { CustomComfirmationAlert } from "@presentation/components/alerts/CustomComfirmationAlert";
import { FC } from "react";
import { useQuery, useQueryClient } from "react-query";

interface IStatusApproval {
  id: number;
  queryKey: string;
}
const StatusApproval: FC<IStatusApproval> = ({ id, queryKey }) => {
  const queryClient = useQueryClient();

  const { data, error } = useQuery({
    queryKey: ["MyReservations", id],
    queryFn: () => {
      return ReservationQueryByIdInstance.getReservationById(
        ReservationUrlEnum.GetReservationById,
        id
      );
    },
    onError: () => {
      console.error("Error submitting form:", error);
      CustomToast(`Failed to get Reservation data`, "error");
    },
  });

  const handleSubmit = async (statusId: number, statusType: string) => {
    if (data) {
      try {
        const confirmAction = await CustomComfirmationAlert(
          `Are You Want to ${statusType} ?`,
          "Yes"
        );

        if (confirmAction) {
          const formData = new FormData();

          formData.append("Id", id.toString());
          formData.append("CourtId", data?.courtId.toString());
          formData.append("SlotTypeId", data?.slotTypeId.toString());
          formData.append("StartTime", data?.startTime);
          formData.append("EndTime", data?.endTime);
          formData.append("OwnerID", data?.ownerID);
          formData.append(
            "ReservationTypeId",
            data?.reservationTypeId.toString()
          );
          formData.append("Status", statusId.toString());
          formData.append("ReservationDate", data?.reservationDate);
          formData.append("MinLevel", data?.levelMin.toString());
          formData.append("MaxLevel", data?.levelMax.toString());

          const statusResult = await StatusCommandInstance.updateStatus(
            StatusUrlEnum.UpdateStatus,
            formData
          );
          if (statusResult) {
            CustomToast(`Success Update Status`, "success");
            queryClient.invalidateQueries({
              queryKey: [queryKey],
            });
          } else {
            CustomToast(`Failed to Update Status`, "error");
          }
        }
      } catch (error) {
        console.error("Error when Update Status", error);
        CustomToast(`Failed to Update Status`, "error");
      }
    }
  };
  return (
    <div className="d-flex tw-flex-col">
      <ActionItem
        icon="tablet-ok"
        onClick={() =>
          handleSubmit(ReservationStatusEnum["Approved"], "Approve")
        }
        title="Approve"
      />
      <ActionItem
        icon="tablet-delete"
        onClick={() =>
          handleSubmit(ReservationStatusEnum["Cancelled"], "Reject")
        }
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

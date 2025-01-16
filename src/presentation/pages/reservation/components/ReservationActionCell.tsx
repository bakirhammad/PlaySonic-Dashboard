import {
  CustomActionsCell,
  CustomModal,
  showConfirmationAlert,
  showDeletedAlert,
} from "@presentation/components";
import { CustomToast } from "@presentation/components/alerts/CustomToast";
import { FC } from "react";
import { useQueryClient, useMutation, useQuery } from "react-query";
import { QUERIES } from "@presentation/helpers";
import { useListView } from "@presentation/context/index";
import { IReservationData } from "@domain/entities/Reservation/Reservation";
import {
  ReservationCommandInstance,
  ReservationQueryByIdInstance,
} from "@app/useCases/reservation";
import { ReservationUrlEnum } from "@domain/enums/URL/Reservation/reservationUrls/Reservation";
import UpdateReservationForm from "./UpdateReservationForm";
import StatusApproval from "@presentation/pages/clubAdmin/myReservation/components/StatusApproval";

interface Props {
  id: number;
  name?: string;
}

const ReservationActionCell: FC<Props> = ({ id, name }) => {
  const { itemIdForUpdate, setItemIdForUpdate } = useListView();
  const queryClient = useQueryClient();

  const { data, error, isLoading } = useQuery({
    queryKey: [QUERIES.ReservationList, id],
    queryFn: () => {
      return ReservationQueryByIdInstance.getReservationById(
        ReservationUrlEnum.GetReservationById,
        id
      );
    },
    onError: () => {
      console.error("Error submitting form:", error);
      CustomToast(`Failed to get Reservation data`, "error");
      setItemIdForUpdate(undefined);
    },
    enabled: itemIdForUpdate === id,
  });

  const { mutate: deleteReservation } = useMutation(
    async (id: number) => {
      const data = await ReservationCommandInstance.deleteReservation(
        ReservationUrlEnum.DeleteReservation,
        id
      );
      return data;
    },
    {
      onSuccess: async (res: IReservationData | number) => {
        if (res === -1) {
          const confirmForceDelete = await showConfirmationAlert(
            "This Item has Related entities"
          );
          if (confirmForceDelete) {
            await ReservationCommandInstance.deleteReservation(
              ReservationUrlEnum.DeleteReservation + `forceDelete=true&`,
              id
            );
            CustomToast(`Deleted successfully`, "success");
            showDeletedAlert(name);
            queryClient.invalidateQueries({
              queryKey: [QUERIES.ReservationList],
            });
          }
        } else {
          CustomToast(`Deleted successfully`, "success");
          showDeletedAlert(name);
          queryClient.invalidateQueries({
            queryKey: [QUERIES.ReservationList],
          });
        }
      },
      onError: (error) => {
        console.error("Error when delete Reservation", error);
        CustomToast(`Failed to delete Reservation`, "error");
      },
    }
  );

  const handleDelete = async () => {
    const confirm = await showConfirmationAlert(name);
    if (confirm) {
      deleteReservation(id);
    }
  };

  return (
    <>
      <CustomActionsCell
        id={id}
        editBtnOnClick={() => {
          setItemIdForUpdate(id);
        }}
        deletBtnOnClick={() => handleDelete()}
        children={<StatusApproval id={id} />}
      />
      {itemIdForUpdate === id && (
        <CustomModal
          modalSize="xl"
          modalTitle="Reservation-UPDATE-MODAL"
          onClick={() => {
            setItemIdForUpdate(undefined);
          }}
        >
          {data && (
            <UpdateReservationForm
              ReservationData={data}
              isLoading={isLoading}
            />
          )}
        </CustomModal>
      )}
    </>
  );
};

export { ReservationActionCell };

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
import { CourtScheduleCommandInstance, CourtScheduleQueryByIdInstance } from "@app/useCases/courtSchedule";
import { CourtScheduleUrlEnum } from "@domain/enums/URL/CourtSchedule/CourtScheduleUrls/CourtSchedule";
import { ICourtScheduleData } from "@domain/entities/CourtSchedule/CourtSchedule";
import UpdateCourtScheduleModalForm from "./UpdateCourtScheduleModalForm";

interface Props {
  id: number;
  name?: string;
}

const CourtScheduleActionCell: FC<Props> = ({ id, name }) => {
  const { itemIdForUpdate, setItemIdForUpdate } = useListView();
  const queryClient = useQueryClient();

  const { data, error, isLoading } = useQuery({
    queryKey: [QUERIES.CourtScheduleList, id],
    queryFn: () => {
      return CourtScheduleQueryByIdInstance.getCourtScheduleById(CourtScheduleUrlEnum.GetCourtScheduleById, id);
    },
    onError: () => {
      console.error("Error submitting form:", error);
      CustomToast(`Failed to get CourtSchedule data`, "error");
      setItemIdForUpdate(undefined);
    },
    enabled: itemIdForUpdate === id,
  });

  const { mutate: deleteCourtSchedule } = useMutation(
    async (id: number) => {
      const data = await CourtScheduleCommandInstance.deleteCourtSchedule(
        CourtScheduleUrlEnum.DeleteCourtSchedule,
        id
      );
      return data;
    },
    {
      onSuccess: async (res: ICourtScheduleData | number) => {
        if (res === -1) {
          const confirmForceDelete = await showConfirmationAlert(
            "This Item has Related entities"
          );
          if (confirmForceDelete) {
            await CourtScheduleCommandInstance.deleteCourtSchedule(
              CourtScheduleUrlEnum.DeleteCourtSchedule + `forceDelete=true&`,
              id
            );
            CustomToast(`Deleted successfully`, "success");
            showDeletedAlert(name);
            queryClient.invalidateQueries({
              queryKey: [QUERIES.CourtScheduleList],
            });
          }
        } else {
          CustomToast(`Deleted successfully`, "success");
          showDeletedAlert(name);
          queryClient.invalidateQueries({
            queryKey: [QUERIES.CourtScheduleList],
          });
        }
      },
      onError: (error) => {
        console.error("Error when delete CourtSchedule", error);
        CustomToast(`Failed to delete CourtSchedule`, "error");
      },
    }
  );

  const handleDelete = async () => {
    const confirm = await showConfirmationAlert(name);
    if (confirm) {
      deleteCourtSchedule(id);
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
      />
      {itemIdForUpdate === id && (
        <CustomModal
          modalSize="xl"
          modalTitle="Court-Schedule-UPDATE-MODAL"
          onClick={() => {
            setItemIdForUpdate(undefined);
          }}
        >
          {data && (
            <UpdateCourtScheduleModalForm CourtScheduleData={data} isLoading={isLoading} />
          )}
        </CustomModal>
      )}
    </>
  );
};

export { CourtScheduleActionCell };

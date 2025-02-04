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
import {
  CourtSlotsCommandInstance,
  CourtSlotsQueryByIdInstance,
} from "@app/useCases/courtSlot";
import { CourtSlotsUrlEnum } from "@domain/enums/URL/courtSlots/courtSlotsUrls/CourtSlots";
import { ICourtSlotsData } from "@domain/entities/CourtSlot/CourtSlot";
import UpdateCourtSlotsModalForm from "./UpdateCourtSlotsModalForm";
import useCheckPermission from "@presentation/helpers/useCheckPermission";

interface Props {
  id: number;
  name?: string;
}

const CourtSlotsActionCell: FC<Props> = ({ id, name }) => {
  const { itemIdForUpdate, setItemIdForUpdate } = useListView();
  const queryClient = useQueryClient();

  const { data, error, isLoading } = useQuery({
    queryKey: [QUERIES.CourtSlotsList, id],
    queryFn: () => {
      return CourtSlotsQueryByIdInstance.getCourtSlotsById(
        CourtSlotsUrlEnum.GetCourtSlotsById,
        id
      );
    },
    onError: () => {
      console.error("Error submitting form:", error);
      CustomToast(`Failed to get CourtSlots data`, "error");
      setItemIdForUpdate(undefined);
    },
    enabled: itemIdForUpdate === id,
  });

  const { mutate: deleteCourtSlots } = useMutation(
    async (id: number) => {
      const data = await CourtSlotsCommandInstance.deleteCourtSlots(
        CourtSlotsUrlEnum.DeleteCourtSlots,
        id
      );
      return data;
    },
    {
      onSuccess: async (res: ICourtSlotsData | number) => {
        if (res === -1) {
          const confirmForceDelete = await showConfirmationAlert(
            "This Item has Related entities"
          );
          if (confirmForceDelete) {
            await CourtSlotsCommandInstance.deleteCourtSlots(
              CourtSlotsUrlEnum.DeleteCourtSlots + `forceDelete=true&`,
              id
            );
            CustomToast(`Deleted successfully`, "success");
            showDeletedAlert(name);
            queryClient.invalidateQueries({
              queryKey: [QUERIES.CourtSlotsList],
            });
          }
        } else {
          CustomToast(`Deleted successfully`, "success");
          showDeletedAlert(name);
          queryClient.invalidateQueries({
            queryKey: [QUERIES.CourtSlotsList],
          });
        }
      },
      onError: (error) => {
        console.error("Error when delete CourtSlots", error);
        CustomToast(`Failed to delete CourtSlots`, "error");
      },
    }
  );

  const handleDelete = async () => {
    const confirm = await showConfirmationAlert(name);
    if (confirm) {
      deleteCourtSlots(id);
    }
  };
  const checkSuperEditPermission = useCheckPermission("Access Super Edit");
  const checkSuperDeletePermission = useCheckPermission("Access Super Delete");

  const checkClubEditSlotPermission = useCheckPermission(
    "Access Club Slot/Edit"
  );
  const checkClubDeleteSlotPermission = useCheckPermission(
    "Access Club Slot/Delete"
  );
  return (
    <>
      <CustomActionsCell
        id={id}
        editBtn={checkSuperEditPermission || checkClubEditSlotPermission}
        editBtnOnClick={() => {
          setItemIdForUpdate(id);
        }}
        deleteBtn={checkSuperDeletePermission || checkClubDeleteSlotPermission}
        deletBtnOnClick={() => handleDelete()}
      />
      {itemIdForUpdate === id && (
        <CustomModal
          modalSize="xl"
          modalTitle="Court-Slots-UPDATE-MODAL"
          onClick={() => {
            setItemIdForUpdate(undefined);
          }}
        >
          {data && (
            <UpdateCourtSlotsModalForm
              CourtSlotsData={data}
              isLoading={isLoading}
            />
          )}
        </CustomModal>
      )}
    </>
  );
};

export { CourtSlotsActionCell };

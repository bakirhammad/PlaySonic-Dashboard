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
import { ISlotTypeData } from "@domain/entities/SlotType/SlotType";
import {
  SlotTypeCommandInstance,
  SlotTypeQueryByIdInstance,
} from "@app/useCases/slotType";
import { SlotTypeUrlEnum } from "@domain/enums/URL/SlotType/SlotTyeUrls/SlotType";
import UpdateSlotTypeModalForm from "./UpdateSlotTypeModalForm";

interface Props {
  id: number;
  name?: string;
}

const SlotTypeActionCell: FC<Props> = ({ id, name }) => {
  const { itemIdForUpdate, setItemIdForUpdate } = useListView();
  const queryClient = useQueryClient();

  const { data, error, isLoading } = useQuery({
    queryKey: [QUERIES.SlotTypeList, id],
    queryFn: () => {
      return SlotTypeQueryByIdInstance.getSlotTypeById(
        SlotTypeUrlEnum.GetSlotTypeById,
        id
      );
    },
    onError: () => {
      console.error("Error submitting form:", error);
      CustomToast(`Failed to get SlotType data`, "error");
      setItemIdForUpdate(undefined);
    },
    enabled: itemIdForUpdate === id,
  });

  const { mutate: deleteSlotType } = useMutation(
    async (id: number) => {
      const data = await SlotTypeCommandInstance.deleteSlotType(
        SlotTypeUrlEnum.DeleteSlotType,
        id
      );
      return data;
    },
    {
      onSuccess: async (res: ISlotTypeData | number) => {
        if (res === -1) {
          const confirmForceDelete = await showConfirmationAlert(
            "This Item has Related entities"
          );
          if (confirmForceDelete) {
            await SlotTypeCommandInstance.deleteSlotType(
              SlotTypeUrlEnum.DeleteSlotType + `forceDelete=true&`,
              id
            );
            CustomToast(`Deleted successfully`, "success");
            showDeletedAlert(name);
            queryClient.invalidateQueries({
              queryKey: [QUERIES.SlotTypeList],
            });
          }
        } else {
          CustomToast(`Deleted successfully`, "success");
          showDeletedAlert(name);
          queryClient.invalidateQueries({
            queryKey: [QUERIES.SlotTypeList],
          });
        }
      },
      onError: (error) => {
        console.error("Error when delete SlotType", error);
        CustomToast(`Failed to delete SlotType`, "error");
      },
    }
  );

  const handleDelete = async () => {
    const confirm = await showConfirmationAlert(name);
    if (confirm) {
      deleteSlotType(id);
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
          modalSize="lg"
          modalTitle="Slot-Type-UPDATE-MODAL"
          onClick={() => {
            setItemIdForUpdate(undefined);
          }}
        >
          {data && (
            <UpdateSlotTypeModalForm
              SlotTypeData={data}
              isLoading={isLoading}
            />
          )}
        </CustomModal>
      )}
    </>
  );
};

export { SlotTypeActionCell };

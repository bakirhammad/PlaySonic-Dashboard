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
import { AreaUrlEnum } from "@domain/enums/URL/General/GeneralEnum/AreaEnum";
import { AreaQueryByIdInstance } from "@app/useCases/general/area/query/AreaQueryById";
import { AreaCommandInstance } from "@app/useCases/general/area/command/AreaCommand";
import { IAreaBody } from "@domain/entities/general/area/Area";
import UpdateArea from "./UpdateArea";

interface Props {
  id: number;
  name?: string;
}

const AreaActionCell: FC<Props> = ({ id, name }) => {
  const { itemIdForUpdate, setItemIdForUpdate } = useListView();
  const queryClient = useQueryClient();

  const { data, error, isLoading } = useQuery({
    queryKey: [QUERIES.AreaList, id],
    queryFn: () => {
      return AreaQueryByIdInstance.getAreaById(AreaUrlEnum.GetAreaById, id);
    },
    onError: () => {
      console.error("Error submitting form:", error);
      CustomToast(`Failed to get Area data`, "error");
      setItemIdForUpdate(undefined);
    },
    enabled: itemIdForUpdate === id,
  });

  const { mutate: deleteArea } = useMutation(
    async (id: number) => {
      const data = await AreaCommandInstance.deleteArea(
        AreaUrlEnum.DeleteArea,
        id
      );
      return data;
    },
    {
      onSuccess: async (res: IAreaBody | number) => {
        if (res === -1) {
          const confirmForceDelete = await showConfirmationAlert(
            "This Item has Related entities"
          );
          if (confirmForceDelete) {
            await AreaCommandInstance.deleteArea(
              AreaUrlEnum.DeleteArea + `forceDelete=true&`,
              id
            );
            CustomToast(`Deleted successfully`, "success");
            showDeletedAlert(name);
            queryClient.invalidateQueries({
              queryKey: [QUERIES.AreaList],
            });
          }
        } else {
          CustomToast(`Deleted successfully`, "success");
          showDeletedAlert(name);
          queryClient.invalidateQueries({
            queryKey: [QUERIES.AreaList],
          });
        }
      },
      onError: (error) => {
        console.error("Error when delete Area", error);
        CustomToast(`Failed to delete Area`, "error");
      },
    }
  );

  const handleDelete = async () => {
    const confirm = await showConfirmationAlert(name);
    if (confirm) {
      deleteArea(id);
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
          modalSize="Default"
          modalTitle="Area-UPDATE-MODAL"
          onClick={() => {
            setItemIdForUpdate(undefined);
          }}
        >
          {data && <UpdateArea AreaData={data} isLoading={isLoading} />}
        </CustomModal>
      )}
    </>
  );
};

export { AreaActionCell };

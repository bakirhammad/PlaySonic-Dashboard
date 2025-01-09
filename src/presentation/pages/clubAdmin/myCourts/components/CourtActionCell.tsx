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
  CourtCommandInstance,
  CourtQueryByIdInstance,
} from "@app/useCases/court";
import { CourtUrlEnum } from "@domain/enums/URL/Court/CourtUrls/Court";
import UpdateCourtModalForm from "./UpdateCourtModalForm";
import { ICourtData } from "@domain/entities/Court/Court";

interface Props {
  id: number;
  name: string;
}

const CourtActionCell: FC<Props> = ({ id, name }) => {
  const { itemIdForUpdate, setItemIdForUpdate } = useListView();
  const queryClient = useQueryClient();

  const { data, error, isLoading } = useQuery({
    queryKey: [QUERIES.CourtList, id],
    queryFn: () => {
      return CourtQueryByIdInstance.getCourtById(CourtUrlEnum.GetCourtById, id);
    },
    onError: () => {
      console.error("Error submitting form:", error);
      CustomToast(`Failed to get Court data`, "error");
      setItemIdForUpdate(undefined);
    },
    enabled: itemIdForUpdate === id,
  });

  const { mutate: deleteCourt } = useMutation(
    async (id: number) => {
      const data = await CourtCommandInstance.deleteCourt(
        CourtUrlEnum.DeleteCourt,
        id
      );
      return data;
    },
    {
      onSuccess: async (res: ICourtData | number) => {
        if (res === -1) {
          const confirmForceDelete = await showConfirmationAlert(
            "This Item has Related entities"
          );
          if (confirmForceDelete) {
            await CourtCommandInstance.deleteCourt(
              CourtUrlEnum.DeleteCourt + `forceDelete=true&`,
              id
            );
            CustomToast(`Deleted successfully`, "success");
            showDeletedAlert(name);
            queryClient.invalidateQueries({
              queryKey: [QUERIES.CourtList],
            });
          }
        } else {
          CustomToast(`Deleted successfully`, "success");
          showDeletedAlert(name);
          queryClient.invalidateQueries({
            queryKey: [QUERIES.CourtList],
          });
        }
      },
      onError: (error) => {
        console.error("Error when delete Court", error);
        CustomToast(`Failed to delete Court`, "error");
      },
    }
  );

  const handleDelete = async () => {
    const confirm = await showConfirmationAlert(name);
    if (confirm) {
      deleteCourt(id);
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
          modalTitle="COURT-UPDATE-MODAL"
          onClick={() => {
            setItemIdForUpdate(undefined);
          }}
        >
          {data && (
            <UpdateCourtModalForm CourtData={data} isLoading={isLoading} />
          )}
        </CustomModal>
      )}
    </>
  );
};

export { CourtActionCell };

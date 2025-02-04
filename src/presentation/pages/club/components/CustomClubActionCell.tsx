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
import UpdateClubModalForm from "./UpdateClubModalForm";
import {
  ClubCommandInstance,
  ClubQueryByIdInstance,
} from "@app/useCases/clubs";
import { ClubUrlEnum } from "@domain/enums/URL/Clubs/ClubUrls/Club";
import { IClubData } from "@domain/entities/Clubs/Clubs";
import useCheckPermission from "@presentation/helpers/useCheckPermission";

interface Props {
  id: number;
  name: string;
}

const ClubActionCell: FC<Props> = ({ id, name }) => {
  const { itemIdForUpdate, setItemIdForUpdate } = useListView();
  const queryClient = useQueryClient();

  const { data, error, isLoading } = useQuery({
    queryKey: [QUERIES.ClubList, id],
    queryFn: () => {
      return ClubQueryByIdInstance.getClubById(ClubUrlEnum.GetClubById, id);
    },
    onError: () => {
      console.error("Error submitting form:", error);
      CustomToast(`Failed to get Club data`, "error");
      setItemIdForUpdate(undefined);
    },
    enabled: itemIdForUpdate === id,
  });

  const { mutate: deleteClub } = useMutation(
    async (id: number) => {
      const data = await ClubCommandInstance.deleteClub(
        ClubUrlEnum.DeleteClub,
        id
      );
      return data;
    },
    {
      onSuccess: async (res: IClubData | number) => {
        if (res === -1) {
          const confirmForceDelete = await showConfirmationAlert(
            "This Item has Related entities"
          );
          if (confirmForceDelete) {
            await ClubCommandInstance.deleteClub(
              ClubUrlEnum.DeleteClub + `forceDelete=true&`,
              id
            );
            CustomToast(`Deleted successfully`, "success");
            showDeletedAlert(name);
            queryClient.invalidateQueries({
              queryKey: [QUERIES.ClubList],
            });
          }
        } else {
          CustomToast(`Deleted successfully`, "success");
          showDeletedAlert(name);
          queryClient.invalidateQueries({
            queryKey: [QUERIES.ClubList],
          });
        }
      },
      onError: (error) => {
        console.error("Error when delete Club", error);
        CustomToast(`Failed to delete Club`, "error");
      },
    }
  );

  const handleDelete = async () => {
    const confirm = await showConfirmationAlert(name);
    if (confirm) {
      deleteClub(id);
    }
  };
  const checkSuperEditPermission = useCheckPermission("Access Super Edit");
  const checkSuperDeletePermission = useCheckPermission("Access Super Delete");
  return (
    <>
      <CustomActionsCell
        id={id}
        editBtn={checkSuperEditPermission}
        editBtnOnClick={() => {
          setItemIdForUpdate(id);
        }}
        deleteBtn={checkSuperDeletePermission}
        deletBtnOnClick={() => handleDelete()}
      />
      {itemIdForUpdate === id && (
        <CustomModal
          modalSize="xl"
          modalTitle="CLUB-UPDATE-MODAL"
          onClick={() => {
            setItemIdForUpdate(undefined);
          }}
        >
          {data && (
            <UpdateClubModalForm ClubData={data} isLoading={isLoading} />
          )}
        </CustomModal>
      )}
    </>
  );
};

export { ClubActionCell };

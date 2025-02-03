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
import { IAddUsersData } from "@domain/entities/general/AddUsers/AddUsers";
import { AddUsersUrlEnum } from "@domain/enums/URL/General/GeneralEnum/AddUsers";
import {
  AddUsersCommandInstance,
  AddUsersQueryByIdInstance,
} from "@app/useCases/general/addUsers";

interface Props {
  id: number;
  name?: string;
}

const PlaysonicUsersActionCell: FC<Props> = ({ id, name }) => {
  const { itemIdForUpdate, setItemIdForUpdate } = useListView();
  const queryClient = useQueryClient();

  const { data, error, isLoading } = useQuery({
    queryKey: [QUERIES.AdminUsersList, id],
    queryFn: () => {
      return AddUsersQueryByIdInstance.getAddUsersById(
        AddUsersUrlEnum.GetUserById,
        id
      );
    },
    onError: () => {
      console.error("Error submitting form:", error);
      CustomToast(`Failed to get AddUsers data`, "error");
      setItemIdForUpdate(undefined);
    },
    enabled: itemIdForUpdate === id,
  });

  const { mutate: deleteAddUsers } = useMutation(
    async (id: number) => {
      const data = await AddUsersCommandInstance.deleteAddUsers(
        AddUsersUrlEnum.DeleteUser,
        id
      );
      return data;
    },
    {
      onSuccess: async (res: IAddUsersData | number) => {
        if (res === -1) {
          const confirmForceDelete = await showConfirmationAlert(
            "This Item has Related entities"
          );
          if (confirmForceDelete) {
            await AddUsersCommandInstance.deleteAddUsers(
              AddUsersUrlEnum.DeleteUser + `forceDelete=true&`,
              id
            );
            CustomToast(`Deleted successfully`, "success");
            showDeletedAlert(name);
            queryClient.invalidateQueries({
              queryKey: [QUERIES.AdminUsersList],
            });
          }
        } else {
          CustomToast(`Deleted successfully`, "success");
          showDeletedAlert(name);
          queryClient.invalidateQueries({
            queryKey: [QUERIES.AdminUsersList],
          });
        }
      },
      onError: (error) => {
        console.error("Error when delete AddUsers", error);
        CustomToast(`Failed to delete AddUsers`, "error");
      },
    }
  );

  const handleDelete = async () => {
    const confirm = await showConfirmationAlert(name);
    if (confirm) {
      deleteAddUsers(id);
    }
  };

  return (
    <>
      {/* <CustomActionsCell
        id={id}
        editBtnOnClick={() => {
          setItemIdForUpdate(id);
        }}
        deleteBtn={false}
        deletBtnOnClick={() => handleDelete()}
      /> */}
      {itemIdForUpdate === id && (
        <CustomModal
          modalSize="xl"
          modalTitle="UPDATE-User"
          onClick={() => {
            setItemIdForUpdate(undefined);
          }}
        >
          {/* {data && <UpdateAdminUsers AdminUsersData={data} isLoading={isLoading} />} */}
        </CustomModal>
      )}
    </>
  );
};

export { PlaysonicUsersActionCell };

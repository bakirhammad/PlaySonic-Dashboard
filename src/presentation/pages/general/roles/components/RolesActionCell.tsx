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
import UpdateRoles from "./UpdateRoles";
import { RolesCommandInstance, RolesQueryByIdInstance } from "@app/useCases/general/roles";
import { RoleUrlEnum } from "@domain/enums/URL/General/GeneralEnum/RolesEnum";
import { IRolesData } from "@domain/entities/general/Roles/Roles";
import useCheckPermission from "@presentation/helpers/useCheckPermission";

interface Props {
  id: number;
  name?: string;
}

const RolesActionCell: FC<Props> = ({ id, name }) => {
  const { itemIdForUpdate, setItemIdForUpdate } = useListView();
  const queryClient = useQueryClient();

  const { data, error, isLoading } = useQuery({
    queryKey: [QUERIES.RolesList, id],
    queryFn: () => {
      return RolesQueryByIdInstance.getRolesById(RoleUrlEnum.GetRoleById, id);
    },
    onError: () => {
      console.error("Error submitting form:", error);
      CustomToast(`Failed to get Roles data`, "error");
      setItemIdForUpdate(undefined);
    },
    enabled: itemIdForUpdate === id,
  });

  const { mutate: deleteRoles } = useMutation(
    async (id: number) => {
      const data = await RolesCommandInstance.deleteRoles(
        RoleUrlEnum.DeleteRole,
        id
      );
      return data;
    },
    {
      onSuccess: async (res: IRolesData | number) => {
        if (res === -1) {
          const confirmForceDelete = await showConfirmationAlert(
            "This Item has Related entities"
          );
          if (confirmForceDelete) {
            await RolesCommandInstance.deleteRoles(
              RoleUrlEnum.DeleteRole + `forceDelete=true&`,
              id
            );
            CustomToast(`Deleted successfully`, "success");
            showDeletedAlert(name);
            queryClient.invalidateQueries({
              queryKey: [QUERIES.RolesList],
            });
          }
        } else {
          CustomToast(`Deleted successfully`, "success");
          showDeletedAlert(name);
          queryClient.invalidateQueries({
            queryKey: [QUERIES.RolesList],
          });
        }
      },
      onError: (error) => {
        console.error("Error when delete Roles", error);
        CustomToast(`Failed to delete Roles`, "error");
      },
    }
  );

  const handleDelete = async () => {
    const confirm = await showConfirmationAlert(name);
    if (confirm) {
      deleteRoles(id);
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
          modalTitle="Role-UPDATE-MODAL"
          onClick={() => {
            setItemIdForUpdate(undefined);
          }}
        >
          {data && <UpdateRoles RoleData={data} isLoading={isLoading} />}
        </CustomModal>
      )}
    </>
  );
};

export { RolesActionCell };

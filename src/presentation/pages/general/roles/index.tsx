import { CustomTable } from "@presentation/components/tables";
import { CustomKTCard } from "@presentation/helpers/index";
import { CustomTableToolbar } from "@presentation/components/subToolbar";
import { useEffect, useMemo } from "react";
import { QUERIES } from "@presentation/helpers";
import { CustomModal } from "@presentation/components/modal/CustomModal";
import { useQuery, useQueryClient } from "react-query";
import {
  ListViewProvider,
  QueryRequestProvider,
  useListView,
  useQueryRequest,
} from "@presentation/context/index";
import {
  CustomToast,
  showConfirmationAlert,
  showDeletedAlert,
} from "@presentation/components";
import { RolesListColumns } from "./components/RolesListColumns";
import { CreateRoles } from "./components/CreateRoles";
import { RoleUrlEnum } from "@domain/enums/URL/General/GeneralEnum/RolesEnum";
import { RolesCommandInstance, RolesQueryInstance } from "@app/useCases/general/roles";
import useCheckPermission from "@presentation/helpers/useCheckPermission";

const Roles = () => {
  const { updateData, query, setIsLoading, setError } = useQueryRequest();

  const columns = useMemo(() => RolesListColumns, []);
  const queryClient = useQueryClient();

  const { itemIdForUpdate, setItemIdForUpdate, selected, clearSelected } =
    useListView();
  const {
    data: RolesData,
    error,
    isLoading,
    isFetching,
  } = useQuery({
    queryKey: [QUERIES.RolesList, [query]],

    queryFn: () => {
      const searchQuery = query ? `&${query}` : "";
      return RolesQueryInstance.getRolesList(
        `${RoleUrlEnum.GetRoleList + searchQuery}`
      );
    },
  });

  useEffect(() => {
    updateData(RolesData);
    setIsLoading(isFetching || isLoading);
    setError(error as Error);
  }, [RolesData, isFetching, isLoading, error]);

  const tableData = useMemo(() => RolesData?.data, [RolesData]);

  const handleDeleteSelected = async () => {
    const confirm = await showConfirmationAlert(`${selected.length} item`);
    if (confirm) {
      try {
        const data = await RolesCommandInstance.multipleDeleteRoles(
          RoleUrlEnum.MultipleDeleteRole,
          selected
        );
        if (data) {
          showDeletedAlert(`${selected.length} item`);
          queryClient.invalidateQueries([QUERIES.RolesList]);
          clearSelected();
          CustomToast(`Deleted successfully`, "success");
        }
      } catch (error) {
        console.error("Error when delete Sightseeing Tour", error);
        CustomToast(`Failed to Delete Sightseeing  Tour `, "error");
      }
    }
  };
  const checkSuperCreatePermission = useCheckPermission("Access Super Create");
  return (
    <>
      <CustomKTCard>
        <CustomTableToolbar
          addBtnAction={() => {
            setItemIdForUpdate(null);
          }}
          searchPlaceholder="SEARCH"
          filterBtn={true}
          // FilterComponent={<RolesFilter></RolesFilter>}
          onDeleteSelectedAll={() => handleDeleteSelected()}
          addBtn={checkSuperCreatePermission}
          addName="ADD"
        />
        <CustomTable columns={columns} data={tableData || []} />
      </CustomKTCard>
      {itemIdForUpdate === null && (
        <CustomModal
          modalSize="xl"
          modalTitle="Create-Role"
          onClick={() => setItemIdForUpdate(undefined)}
        >
          <CreateRoles />
        </CustomModal>
      )}
    </>
  );
};

function RolesListWrapper() {
  return (
    <QueryRequestProvider>
      <ListViewProvider>
        <Roles />
      </ListViewProvider>
    </QueryRequestProvider>
  );
}
export default RolesListWrapper;


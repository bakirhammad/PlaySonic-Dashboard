import { CustomTable } from "@presentation/components/tables";
import { CustomKTCard } from "@presentation/helpers/index";
import { CustomTableToolbar } from "@presentation/components/subToolbar";
import { useEffect, useMemo } from "react";
import { QUERIES } from "@presentation/helpers";
import { CustomModal } from "@presentation/components/modal/CustomModal";
import { useQuery } from "react-query";
import {
  ListViewProvider,
  QueryRequestProvider,
  useListView,
  useQueryRequest,
} from "@presentation/context/index";
import { AddUsersQueryInstance } from "@app/useCases/general/addUsers";
import { AddUsersUrlEnum } from "@domain/enums/URL/General/GeneralEnum/AddUsers";
import { CreateAdminUsers } from "./components/CreateAdminUsers";
import { AdminUsersListColumns } from "./components/AdminUsersListColumns";

const AdminUsers = () => {
  const { updateData, query, setIsLoading, setError } = useQueryRequest();
  const columns = useMemo(() => AdminUsersListColumns, []);

  const { itemIdForUpdate, setItemIdForUpdate } = useListView();
  const {
    data: AdminUsersData,
    error,
    isLoading,
    isFetching,
  } = useQuery({
    queryKey: [QUERIES.AdminUsersList, [query]],
 // Need To update List Api To get only the Admin Users Not All Users >>>> 
    queryFn: () => {
      const searchQuery = query ? `&${query}` : "";
      return AddUsersQueryInstance.getAddUsersList(
        `${AddUsersUrlEnum.GetUserList + searchQuery}`
      );
    },
  });

  useEffect(() => {
    updateData(AdminUsersData);
    setIsLoading(isFetching || isLoading);
    setError(error as Error);
  }, [AdminUsersData, isFetching, isLoading, error]);

  const tableData = useMemo(() => AdminUsersData?.data, [AdminUsersData]);

  // const handleDeleteSelected = async () => {
  //   const confirm = await showConfirmationAlert(`${selected.length} item`);
  //   if (confirm) {
  //     try {
  //       const data = await AddUsersCommandInstance.multipleDeleteAddUsers(
  //         AddUsersUrlEnum,
  //         selected
  //       );
  //       if (data) {
  //         showDeletedAlert(`${selected.length} item`);
  //         queryClient.invalidateQueries([QUERIES.AdminUsersList]);
  //         clearSelected();
  //         CustomToast(`Deleted successfully`, "success");
  //       }
  //     } catch (error) {
  //       console.error("Error when delete Sightseeing Tour", error);
  //       CustomToast(`Failed to Delete Sightseeing  Tour `, "error");
  //     }
  //   }
  // };

  return (
    <>
      <CustomKTCard>
        <CustomTableToolbar
          addBtnAction={() => {
            setItemIdForUpdate(null);
          }}
          searchPlaceholder="SEARCH"
          filterBtn={true}
          // FilterComponent={<AdminUsersFilter></AdminUsersFilter>}
          // onDeleteSelectedAll={() => handleDeleteSelected()}
          addBtn={true}
          addName="ADD"
        />
        <CustomTable columns={columns} data={tableData || []} />
      </CustomKTCard>
      {itemIdForUpdate === null && (
        <CustomModal
          modalSize="xl"
          modalTitle="Add-User"
          onClick={() => setItemIdForUpdate(undefined)}
        >
          <CreateAdminUsers />
        </CustomModal>
      )}
    </>
  );
};

function AdminUsersListWrapper() {
  return (
    <QueryRequestProvider>
      <ListViewProvider>
        <AdminUsers />
      </ListViewProvider>
    </QueryRequestProvider>
  );
}
export default AdminUsersListWrapper;

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
import { ClubCommandInstance, ClubQueryInstance } from "@app/useCases/clubs";
import { ClubUrlEnum } from "@domain/enums/URL/Clubs/ClubUrls/Club";
import { ClubListColumns } from "./components/ClubListColumns";
import { ClubModalCreateForm } from "./components/ClubModalCreateForm";


const ClubList = () => {
  const { updateData, query, setIsLoading, setError } = useQueryRequest();

  const columns = useMemo(() => ClubListColumns, []);

  const queryClient = useQueryClient();

  const { itemIdForUpdate, setItemIdForUpdate, selected, clearSelected } =
    useListView();
  const {
    data: ClubData,
    error,
    isLoading,
    isFetching,
  } = useQuery({
    queryKey: [QUERIES.ClubList, [query]],

    queryFn: () => {
      const searchQuery = query ? `&${query}` : "";
      return ClubQueryInstance.getClubList(
        `${ClubUrlEnum.GetClubList + searchQuery}`
      );
    },
  });

  console.log(ClubData, "ddddddddddd")
  useEffect(() => {
    updateData(ClubData);
    setIsLoading(isFetching || isLoading);
    setError(error as Error);
  }, [ClubData, isFetching, isLoading, error]);

  const tableData = useMemo(
    () => ClubData?.data,
    [ClubData]
  );

  const handleDeleteSelected = async () => {
    const confirm = await showConfirmationAlert(`${selected.length} item`);
    if (confirm) {
      try {
        const data =
          await ClubCommandInstance.multipleDeleteClub(
            ClubUrlEnum.MultipleDeleteClub,
            selected
          );
        if (data) {
          showDeletedAlert(`${selected.length} item`);
          queryClient.invalidateQueries([QUERIES.ClubList]);
          clearSelected();
          CustomToast(`Deleted successfully`, "success");
        }
      } catch (error) {
        console.error("Error when delete Sightseeing Tour", error);
        CustomToast(`Failed to Delete Sightseeing  Tour `, "error");
      }
    }
  };

  return (
    <>
      <CustomKTCard>
        <CustomTableToolbar
          addBtnAction={() => {
            setItemIdForUpdate(null);
          }}
          searchPlaceholder="SEARCH-SIGHT-SEEING-TOUR"
          filterBtn={true}
          // FilterComponent={<ClubFilter></ClubFilter>}
          onDeleteSelectedAll={() => handleDeleteSelected()}
          addBtn={true}
          addName="ADD-SIGHT-SEEING-TOUR-BUTTON"
        />
        <CustomTable columns={columns} data={tableData || []} />
      </CustomKTCard>
      {itemIdForUpdate === null && (
        <CustomModal
          modalSize="xl"
          modalTitle="SIGHT-SEEING-TOUR-CREATE-MODAL-TITLE"
          onClick={() => setItemIdForUpdate(undefined)}
        >
          <ClubModalCreateForm />
        </CustomModal>
      )}
    </>
  );
};

function ClubListWrapper() {
  return (
    <QueryRequestProvider>
      <ListViewProvider>
        <ClubList />
      </ListViewProvider>
    </QueryRequestProvider>
  );
}
export default ClubListWrapper;

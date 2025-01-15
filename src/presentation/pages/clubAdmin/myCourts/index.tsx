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
import { CourtModalCreateForm } from "./components/CourtModalCreateForm";
import { CourtCommandInstance, CourtQueryInstance } from "@app/useCases/court";
import { CourtUrlEnum } from "@domain/enums/URL/Court/CourtUrls/Court";
import { CourtListColumns } from "./components/CourtListColumns";
import CustomTemplate from "@presentation/components/CustomTemplate";

const MyCourts = () => {
  const { updateData, query, setIsLoading, setError } = useQueryRequest();

  const columns = useMemo(() => CourtListColumns, []);

  const queryClient = useQueryClient();
  const clubId = 7;
  const { itemIdForUpdate, setItemIdForUpdate, selected, clearSelected } =
    useListView();
  const {
    data: CourtData,
    error,
    isLoading,
    isFetching,
  } = useQuery({
    queryKey: [QUERIES.CourtList, [query]],
    queryFn: () => {
      const searchQuery = query ? `&${query}` : "";
      return CourtQueryInstance.getCourtList(
        `${CourtUrlEnum.GetCourtList + `clubId=${clubId}` + searchQuery}`
      );
    },
  });


  useEffect(() => {
    updateData(CourtData);
    setIsLoading(isFetching || isLoading);
    setError(error as Error);
  }, [CourtData, isFetching, isLoading, error]);

  const tableData = useMemo(() => CourtData?.data, [CourtData]);
  const handleDeleteSelected = async () => {
    const confirm = await showConfirmationAlert(`${selected.length} item`);
    if (confirm) {
      try {
        const data = await CourtCommandInstance.multipleDeleteCourt(
          CourtUrlEnum.MultipleDeleteCourt,
          selected
        );
        if (data) {
          showDeletedAlert(`${selected.length} item`);
          queryClient.invalidateQueries([QUERIES.CourtList]);
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
      <CustomKTCard className="">
        <CustomTableToolbar
          addBtnAction={() => {
            setItemIdForUpdate(null);
          }}
          searchPlaceholder="SEARCH"
          filterBtn={true}
          // FilterComponent={<ClubFilter></ClubFilter>}
          onDeleteSelectedAll={() => handleDeleteSelected()}
          addBtn={true}
          addName="ADD"
          
        />
        <CustomTemplate courtData={tableData || []}/>
        {/* <CustomTable columns={columns} data={tableData || []} /> */}
      </CustomKTCard>
      {itemIdForUpdate === null && (
        <CustomModal
          modalSize="xl"
          modalTitle="Create-Club"
          onClick={() => setItemIdForUpdate(undefined)}
        >
          <CourtModalCreateForm id={clubId} />
        </CustomModal>
      )}
    </>
  );
};

function MyCourtsWrapper() {
  return (
    <QueryRequestProvider>
      <ListViewProvider>
        <MyCourts />
      </ListViewProvider>
    </QueryRequestProvider>
  );
}
export default MyCourtsWrapper;

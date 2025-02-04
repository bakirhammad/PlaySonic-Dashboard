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
import { CourtModalCreateForm } from "./components/CourtModalCreateForm";
import { CourtCommandInstance, CourtQueryInstance } from "@app/useCases/court";
import { CourtUrlEnum } from "@domain/enums/URL/Court/CourtUrls/Court";
import { CourtListColumns } from "./components/CourtListColumns";
import CourtFilter from "./components/CourtFilter";
import useCheckPermission from "@presentation/helpers/useCheckPermission";

const CourtList = () => {
  const { updateData, query, setIsLoading, setError } = useQueryRequest();

  const columns = useMemo(() => CourtListColumns, []);

  const queryClient = useQueryClient();

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
        `${CourtUrlEnum.GetCourtList + searchQuery}`
      );
    },
  });
  useEffect(() => {
    updateData(CourtData);
    setIsLoading(isFetching || isLoading);
    setError(error as Error);
  }, [CourtData, isFetching, isLoading, error]);

  console.log(CourtData, "ddddddddddd");
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
          FilterComponent={<CourtFilter />}
          onDeleteSelectedAll={() => handleDeleteSelected()}
          addBtn={checkSuperCreatePermission}
          addName="ADD"
        />
        <CustomTable columns={columns} data={tableData || []} />
      </CustomKTCard>
      {itemIdForUpdate === null && (
        <CustomModal
          modalSize="xl"
          modalTitle="Create-Court"
          onClick={() => setItemIdForUpdate(undefined)}
        >
          <CourtModalCreateForm />
        </CustomModal>
      )}
    </>
  );
};

function CourtListWrapper() {
  return (
    <QueryRequestProvider>
      <ListViewProvider>
        <CourtList />
      </ListViewProvider>
    </QueryRequestProvider>
  );
}
export default CourtListWrapper;

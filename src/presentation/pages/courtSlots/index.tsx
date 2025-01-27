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
import { CourtSlotsUrlEnum } from "@domain/enums/URL/courtSlots/courtSlotsUrls/CourtSlots";
import {
  CourtSlotsCommandInstance,
  CourtSlotsQueryInstance,
} from "@app/useCases/courtSlot";
import { CourtSlotsListColumns } from "./components/CourtSlotsListColumns";
import { CourtSlotsModalCreateForm } from "./components/CourtSlotsModalCreateForm";
import { useParams } from "react-router-dom";

const CourtSlots = () => {
  const { updateData, query, setIsLoading, setError } = useQueryRequest();

  const columns = useMemo(() => CourtSlotsListColumns, []);

  const { courtId } = useParams();

  const queryClient = useQueryClient();

  const { itemIdForUpdate, setItemIdForUpdate, selected, clearSelected } =
    useListView();
  const {
    data: CourtSlotsData,
    error,
    isLoading,
    isFetching,
  } = useQuery({
    queryKey: [QUERIES.CourtSlotsList, [query]],

    queryFn: () => {
      const searchQuery = query ? `&${query}` : "";
      return CourtSlotsQueryInstance.getCourtSlotsList(
        courtId
          ? `${CourtSlotsUrlEnum.GetCourtSlotsList}courtId=${courtId}${searchQuery}`
          : `${CourtSlotsUrlEnum.GetCourtSlotsList}${searchQuery}`
      );
    },
  });

  useEffect(() => {
    updateData(CourtSlotsData);
    setIsLoading(isFetching || isLoading);
    setError(error as Error);
  }, [CourtSlotsData, isFetching, isLoading, error]);

  const tableData = useMemo(() => CourtSlotsData?.data, [CourtSlotsData]);

  const handleDeleteSelected = async () => {
    const confirm = await showConfirmationAlert(`${selected.length} item`);
    if (confirm) {
      try {
        const data = await CourtSlotsCommandInstance.multipleDeleteCourtSlots(
          CourtSlotsUrlEnum.MultipleDeleteCourtSlots,
          selected
        );
        if (data) {
          showDeletedAlert(`${selected.length} item`);
          queryClient.invalidateQueries([QUERIES.CourtSlotsList]);
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
          searchPlaceholder="SEARCH"
          filterBtn={true}
          // FilterComponent={<CourtSlotsFilter></CourtSlotsFilter>}
          onDeleteSelectedAll={() => handleDeleteSelected()}
          addBtn={true}
          addName="ADD"
        />
        <CustomTable columns={columns} data={tableData || []} />
      </CustomKTCard>
      {itemIdForUpdate === null && (
        <CustomModal
          modalSize="xl"
          modalTitle="Create-Slot-Type"
          onClick={() => setItemIdForUpdate(undefined)}
        >
          <CourtSlotsModalCreateForm />
        </CustomModal>
      )}
    </>
  );
};

function CourtSlotsListWrapper() {
  return (
    <QueryRequestProvider>
      <ListViewProvider>
        <CourtSlots />
      </ListViewProvider>
    </QueryRequestProvider>
  );
}
export default CourtSlotsListWrapper;

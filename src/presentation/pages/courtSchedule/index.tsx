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
import { CourtScheduleListColumns } from "./components/CourtScheduleListColumns";
import {
  CourtScheduleCommandInstance,
  CourtScheduleQueryInstance,
} from "@app/useCases/courtSchedule";
import { CourtScheduleUrlEnum } from "@domain/enums/URL/CourtSchedule/CourtScheduleUrls/CourtSchedule";
import { CourtScheduleModalCreateForm } from "./components/CourtScheduleModalCreateForm";
import { useParams } from "react-router-dom";
import useCheckPermission from "@presentation/helpers/useCheckPermission";
import CourtScheduleFilter from "./components/CourtScheduleFilter";

const CourtSchedule = () => {
  const { updateData, query, setIsLoading, setError } = useQueryRequest();

  const columns = useMemo(() => CourtScheduleListColumns, []);
  const { courtId } = useParams();

  const queryClient = useQueryClient();

  const { itemIdForUpdate, setItemIdForUpdate, selected, clearSelected } =
    useListView();
  const {
    data: CourtScheduleData,
    error,
    isLoading,
    isFetching,
  } = useQuery({
    queryKey: [QUERIES.CourtScheduleList, [query]],

    queryFn: () => {
      const searchQuery = query ? `&${query}` : "";
      return CourtScheduleQueryInstance.getCourtScheduleList(
        courtId
          ? `${CourtScheduleUrlEnum.GetCourtScheduleList}courtId=${courtId}${searchQuery}`
          : `${CourtScheduleUrlEnum.GetCourtScheduleList + searchQuery}`
      );
    },
  });

  useEffect(() => {
    updateData(CourtScheduleData);
    setIsLoading(isFetching || isLoading);
    setError(error as Error);
  }, [CourtScheduleData, isFetching, isLoading, error]);

  const tableData = useMemo(() => CourtScheduleData?.data, [CourtScheduleData]);

  const handleDeleteSelected = async () => {
    const confirm = await showConfirmationAlert(`${selected.length} item`);
    if (confirm) {
      try {
        const data =
          await CourtScheduleCommandInstance.multipleDeleteCourtSchedule(
            CourtScheduleUrlEnum.MultipleDeleteCourtSchedule,
            selected
          );
        if (data) {
          showDeletedAlert(`${selected.length} item`);
          queryClient.invalidateQueries([QUERIES.CourtScheduleList]);
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
  const checkMyCourtPermission = useCheckPermission("Access Club Courts");

  return (
    <>
      <CustomKTCard>
        <CustomTableToolbar
          addBtnAction={() => {
            setItemIdForUpdate(null);
          }}
          searchPlaceholder="SEARCH"
          filterBtn={true}
          FilterComponent={!checkMyCourtPermission && <CourtScheduleFilter />}
          onDeleteSelectedAll={() => handleDeleteSelected()}
          addBtn={checkSuperCreatePermission}
          addName="ADD"
        />
        <CustomTable columns={columns} data={tableData || []} />
      </CustomKTCard>
      {itemIdForUpdate === null && (
        <CustomModal
          modalSize="xl"
          modalTitle="Create-Court-Schedule"
          onClick={() => setItemIdForUpdate(undefined)}
        >
          <CourtScheduleModalCreateForm />
        </CustomModal>
      )}
    </>
  );
};

function CourtScheduleListWrapper() {
  return (
    <QueryRequestProvider>
      <ListViewProvider>
        <CourtSchedule />
      </ListViewProvider>
    </QueryRequestProvider>
  );
}
export default CourtScheduleListWrapper;

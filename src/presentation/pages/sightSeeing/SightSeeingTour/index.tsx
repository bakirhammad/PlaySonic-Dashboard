import { CustomTable } from "@presentation/components/tables";
import { CustomKTCard } from "@presentation/helpers/index";
import { CustomTableToolbar } from "@presentation/components/subToolbar";
import { useEffect, useMemo } from "react";
import { QUERIES } from "@presentation/helpers";
import { CustomModal } from "@presentation/components/modal/CustomModal";
import {
  SightSeeingTourCommandInstance,
  SightSeeingTourQueryInstance,
} from "@app/index";

import { useQuery, useQueryClient } from "react-query";
import {
  ListViewProvider,
  QueryRequestProvider,
  useListView,
  useQueryRequest,
} from "@presentation/context/index";

import { SightSeeingTourListColumns } from "./components/CreateSightSeeingTourColumns";

import { CreateSightSeeingTourModalForm } from "./components/CreateSightSeeingTourModalForm";
import {
  CustomToast,
  showConfirmationAlert,
  showDeletedAlert,
} from "@presentation/components";
import { SightSeeingTourUrlEnum } from "@domain/enums";

import { SightSeeingTourFilter } from "./components/SightSeeingTourFilter";

const SightSeeingTourList = () => {
  const { updateData, query, setIsLoading, setError } = useQueryRequest();

  const columns = useMemo(() => SightSeeingTourListColumns, []);

  const queryClient = useQueryClient();

  const { itemIdForUpdate, setItemIdForUpdate, selected, clearSelected } =
    useListView();
  const {
    data: SightSeeingTourData,
    error,
    isLoading,
    isFetching,
  } = useQuery({
    queryKey: [QUERIES.SightSeeingTourList, [query]],

    queryFn: () => {
      const searchQuery = query ? `&${query}` : "";
      return SightSeeingTourQueryInstance.getSightSeeingTourList(
        `${SightSeeingTourUrlEnum.GetSightSeeingTourList + searchQuery}`
      );
    },
  });

  useEffect(() => {
    updateData(SightSeeingTourData);
    setIsLoading(isFetching || isLoading);
    setError(error as Error);
  }, [SightSeeingTourData, isFetching, isLoading, error]);

  const tableData = useMemo(
    () => SightSeeingTourData?.data,
    [SightSeeingTourData]
  );

  const handleDeleteSelected = async () => {
    const confirm = await showConfirmationAlert(`${selected.length} item`);
    if (confirm) {
      try {
        const data =
          await SightSeeingTourCommandInstance.multipleDeleteSightSeeingTour(
            SightSeeingTourUrlEnum.MultipleDeleteSightSeeingTour,
            selected
          );
        if (data) {
          showDeletedAlert(`${selected.length} item`);
          queryClient.invalidateQueries([QUERIES.SightSeeingTourList]);
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
          FilterComponent={<SightSeeingTourFilter></SightSeeingTourFilter>}
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
          <CreateSightSeeingTourModalForm />
        </CustomModal>
      )}
    </>
  );
};

function SightSeeingTourListWrapper() {
  return (
    <QueryRequestProvider>
      <ListViewProvider>
        <SightSeeingTourList />
      </ListViewProvider>
    </QueryRequestProvider>
  );
}
export default SightSeeingTourListWrapper;

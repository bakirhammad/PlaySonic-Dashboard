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
import { SlotTypeCommandInstance, SlotTypeQueryInstance } from "@app/useCases/slotType";
import { SlotTypeUrlEnum } from "@domain/enums/URL/SlotType/SlotTyeUrls/SlotType";
import { SlotTypeListColumns } from "./components/SlotTypeListColumns";
import { SlotTypeModalCreateForm } from "./components/SlotTypeModalCreateForm";

const SlotType = () => {
  const { updateData, query, setIsLoading, setError } = useQueryRequest();

  const columns = useMemo(() => SlotTypeListColumns, []);

  const queryClient = useQueryClient();

  const { itemIdForUpdate, setItemIdForUpdate, selected, clearSelected } =
    useListView();
  const {
    data: SlotTypeData,
    error,
    isLoading,
    isFetching,
  } = useQuery({
    queryKey: [QUERIES.SlotTypeList, [query]],

    queryFn: () => {
      const searchQuery = query ? `&${query}` : "";
      return SlotTypeQueryInstance.getSlotTypeList(
        `${SlotTypeUrlEnum.GetSlotTypeList + searchQuery}`
      );
    },
  });

  useEffect(() => {
    updateData(SlotTypeData);
    setIsLoading(isFetching || isLoading);
    setError(error as Error);
  }, [SlotTypeData, isFetching, isLoading, error]);

  const tableData = useMemo(() => SlotTypeData?.data, [SlotTypeData]);

  const handleDeleteSelected = async () => {
    const confirm = await showConfirmationAlert(`${selected.length} item`);
    if (confirm) {
      try {
        const data =
          await SlotTypeCommandInstance.multipleDeleteSlotType(
            SlotTypeUrlEnum.MultipleDeleteSlotType,
            selected
          );
        if (data) {
          showDeletedAlert(`${selected.length} item`);
          queryClient.invalidateQueries([QUERIES.SlotTypeList]);
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
          // FilterComponent={<SlotTypeFilter></SlotTypeFilter>}
          onDeleteSelectedAll={() => handleDeleteSelected()}
          addBtn={true}
          addName="ADD"
        />
        <CustomTable columns={columns} data={tableData || []} />
      </CustomKTCard>
      {itemIdForUpdate === null && (
        <CustomModal
          modalSize="lg"
          modalTitle="Create-Slot-Types"
          onClick={() => setItemIdForUpdate(undefined)}
        >
          <SlotTypeModalCreateForm />
        </CustomModal>
      )}
    </>
  );
};

function SlotTypeListWrapper() {
  return (
    <QueryRequestProvider>
      <ListViewProvider>
        <SlotType />
      </ListViewProvider>
    </QueryRequestProvider>
  );
}
export default SlotTypeListWrapper;

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
import { AreaQueryInstance } from "@app/useCases/general/area/query/AreaQuery";
import { AreaUrlEnum } from "@domain/enums/URL/General/GeneralEnum/AreaEnum";
import { AreaCommandInstance } from "@app/useCases/general/area/command/AreaCommand";
import { CreateArea } from "./components/CreateArea";
import { AreaListColumns } from "./components/AreaListColumns";
import useCheckPermission from "@presentation/helpers/useCheckPermission";

const AreaList = () => {
  const { updateData, query, setIsLoading, setError } = useQueryRequest();

  const columns = useMemo(() => AreaListColumns, []);

  const queryClient = useQueryClient();

  const { itemIdForUpdate, setItemIdForUpdate, selected, clearSelected } =
    useListView();
  const {
    data: AreaData,
    error,
    isLoading,
    isFetching,
  } = useQuery({
    queryKey: [QUERIES.AreaList, [query]],

    queryFn: () => {
      const searchQuery = query ? `&${query}` : "";
      return AreaQueryInstance.getAreaList(
        `${AreaUrlEnum.GetAreaList + searchQuery}`
      );
    },
  });

  useEffect(() => {
    updateData(AreaData);
    setIsLoading(isFetching || isLoading);
    setError(error as Error);
  }, [AreaData, isFetching, isLoading, error]);

  const tableData = useMemo(() => AreaData?.data, [AreaData]);
console.log(AreaData, "dafadfsdf")
  const handleDeleteSelected = async () => {
    const confirm = await showConfirmationAlert(`${selected.length} item`);
    if (confirm) {
      try {
        const data = await AreaCommandInstance.multipleDeleteArea(
          AreaUrlEnum.MultipleDeleteArea,
          selected
        );
        if (data) {
          showDeletedAlert(`${selected.length} item`);
          queryClient.invalidateQueries([QUERIES.AreaList]);
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
          // FilterComponent={<AreaFilter></AreaFilter>}
          onDeleteSelectedAll={() => handleDeleteSelected()}
          addBtn={checkSuperCreatePermission}
          addName="ADD"
        />
        <CustomTable columns={columns} data={tableData || []} />
      </CustomKTCard>
      {itemIdForUpdate === null && (
        <CustomModal
          modalSize="Default"
          modalTitle="Create-Area"
          onClick={() => setItemIdForUpdate(undefined)}
        >
          <CreateArea />
        </CustomModal>
      )}
    </>
  );
};

function AreaListWrapper() {
  return (
    <QueryRequestProvider>
      <ListViewProvider>
        <AreaList />
      </ListViewProvider>
    </QueryRequestProvider>
  );
}
export default AreaListWrapper;

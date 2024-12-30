import { CustomTable } from "@presentation/components/tables";
import { CustomKTCard } from "@presentation/helpers/index";
import { CustomTableToolbar } from "@presentation/components/subToolbar";
import { useEffect, useMemo } from "react";
import { QUERIES } from "@presentation/helpers";
import { CustomModal } from "@presentation/components/modal/CustomModal";
import {
  SightSeeingCategoryCommandInstance,
  SightSeeingCategoryQueryInstance,
} from "@app/index";

import { useQuery, useQueryClient } from "react-query";
import {
  ListViewProvider,
  QueryRequestProvider,
  useListView,
  useQueryRequest,
} from "@presentation/context/index";

import { SightSeeingCategoryListColumns } from "./components/CreateSightSeeingCategoryColumns";

import { CreateSightSeeingCategoryModalForm } from "./components/CreateSightSeeingCategoryModalForm";
import {
  CustomToast,
  showConfirmationAlert,
  showDeletedAlert,
} from "@presentation/components";
import { SightSeeingCategoryUrlEnum } from "@domain/enums";

import { SightSeeingCategoryFilter } from "./components/SightSeeingCategoryFilter";

const SightSeeingCategoryList = () => {
  const { updateData, query, setIsLoading, setError } = useQueryRequest();

  const columns = useMemo(() => SightSeeingCategoryListColumns, []);

  const queryClient = useQueryClient();

  const { itemIdForUpdate, setItemIdForUpdate, selected, clearSelected } =
    useListView();
  const {
    data: SightSeeingCategoryData,
    error,
    isLoading,
    isFetching,
  } = useQuery({
    queryKey: [QUERIES.SightSeeingCategoryList, [query]],

    queryFn: () => {
      const searchQuery = query ? `&${query}` : "";
      return SightSeeingCategoryQueryInstance.getSightSeeingCategoryList(
        `${SightSeeingCategoryUrlEnum.GetSightSeeingCategoryList + searchQuery}`
      );
    },
  });

  useEffect(() => {
    updateData(SightSeeingCategoryData);
    setIsLoading(isFetching || isLoading);
    setError(error as Error);
  }, [SightSeeingCategoryData, isFetching, isLoading, error]);

  const tableData = useMemo(
    () => SightSeeingCategoryData?.data,
    [SightSeeingCategoryData]
  );

  const handleDeleteSelected = async () => {
    const confirm = await showConfirmationAlert(`${selected.length} item`);
    if (confirm) {
      try {
        const data =
          await SightSeeingCategoryCommandInstance.multipleDeleteSightSeeingCategory(
            SightSeeingCategoryUrlEnum.MultipleDeleteSightSeeingCategory,
            selected
          );
        if (data) {
          showDeletedAlert(`${selected.length} item`);
          queryClient.invalidateQueries([QUERIES.SightSeeingCategoryList]);
          clearSelected();
          CustomToast(`Deleted successfully`, "success");
        }
      } catch (error) {
        console.error("Error when delete Sightseeing Categories", error);
        CustomToast(`Failed to Delete Sightseeing  Categories `, "error");
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
          searchPlaceholder="SEARCH-SIGHT-SEEING-CATEGORY"
          filterBtn={true}
          FilterComponent={
            <SightSeeingCategoryFilter></SightSeeingCategoryFilter>
          }
          onDeleteSelectedAll={() => handleDeleteSelected()}
          addBtn={true}
          addName="ADD-SIGHT-SEEING-BUTTON"
        />
        <CustomTable columns={columns} data={tableData || []} />
      </CustomKTCard>
      {itemIdForUpdate === null && (
        <CustomModal
          modalSize="lg"
          modalTitle="SIGHT-SEEING-CATEGORY-CREATE-MODAL-TITLE"
          onClick={() => setItemIdForUpdate(undefined)}
        >
          <CreateSightSeeingCategoryModalForm />
        </CustomModal>
      )}
    </>
  );
};

function SightSeeingCategoryListWrapper() {
  return (
    <QueryRequestProvider>
      <ListViewProvider>
        <SightSeeingCategoryList />
      </ListViewProvider>
    </QueryRequestProvider>
  );
}
export default SightSeeingCategoryListWrapper;

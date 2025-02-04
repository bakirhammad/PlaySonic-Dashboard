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
import {
  ImageBannerCommandInstance,
  ImageBannerQueryInstance,
} from "@app/useCases/general/imageBanner";
import { ImageBannerUrlEnum } from "@domain/enums/URL/General/GeneralEnum/ImageBannerEnum";
import { CreateImageBanner } from "./components/CreateImageBanner";
import { ImageBannerListColumns } from "./components/ImageBannerListColumns";
import useCheckPermission from "@presentation/helpers/useCheckPermission";

const ImageBanner = () => {
  const { updateData, query, setIsLoading, setError } = useQueryRequest();

  const columns = useMemo(() => ImageBannerListColumns, []);
  const queryClient = useQueryClient();

  const { itemIdForUpdate, setItemIdForUpdate, selected, clearSelected } =
    useListView();
  const {
    data: ImageBannerData,
    error,
    isLoading,
    isFetching,
  } = useQuery({
    queryKey: [QUERIES.ImageBannerList, [query]],

    queryFn: () => {
      const searchQuery = query ? `&${query}` : "";
      return ImageBannerQueryInstance.getImageBannerList(
        `${ImageBannerUrlEnum.GetImageBannerList + searchQuery}`
      );
    },
  });

  useEffect(() => {
    updateData(ImageBannerData);
    setIsLoading(isFetching || isLoading);
    setError(error as Error);
  }, [ImageBannerData, isFetching, isLoading, error]);

  const tableData = useMemo(() => ImageBannerData?.data, [ImageBannerData]);

  const handleDeleteSelected = async () => {
    const confirm = await showConfirmationAlert(`${selected.length} item`);
    if (confirm) {
      try {
        const data = await ImageBannerCommandInstance.multipleDeleteImageBanner(
          ImageBannerUrlEnum.MultipleDeleteImageBanner,
          selected
        );
        if (data) {
          showDeletedAlert(`${selected.length} item`);
          queryClient.invalidateQueries([QUERIES.ImageBannerList]);
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
          // FilterComponent={<ImageBannerFilter></ImageBannerFilter>}
          onDeleteSelectedAll={() => handleDeleteSelected()}
          addBtn={checkSuperCreatePermission}
          addName="ADD"
        />
        <CustomTable columns={columns} data={tableData || []} />
      </CustomKTCard>
      {itemIdForUpdate === null && (
        <CustomModal
          modalSize="xl"
          modalTitle="Create-ImageBanner"
          onClick={() => setItemIdForUpdate(undefined)}
        >
          <CreateImageBanner />
        </CustomModal>
      )}
    </>
  );
};

function ImageBannerListWrapper() {
  return (
    <QueryRequestProvider>
      <ListViewProvider>
        <ImageBanner />
      </ListViewProvider>
    </QueryRequestProvider>
  );
}
export default ImageBannerListWrapper;

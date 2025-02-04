import {
  CustomActionsCell,
  CustomModal,
  showConfirmationAlert,
  showDeletedAlert,
} from "@presentation/components";
import { CustomToast } from "@presentation/components/alerts/CustomToast";
import { FC } from "react";
import { useQueryClient, useMutation, useQuery } from "react-query";
import { QUERIES } from "@presentation/helpers";
import { useListView } from "@presentation/context/index";
import { ImageBannerUrlEnum } from "@domain/enums/URL/General/GeneralEnum/ImageBannerEnum";
import { IImageBannerData } from "@domain/entities/general/ImageBanner/ImageBanner";
import { ImageBannerCommandInstance, ImageBannerQueryByIdInstance } from "@app/useCases/general/imageBanner";
import UpdateImageBanner from "./UpdateImageBanner";
import useCheckPermission from "@presentation/helpers/useCheckPermission";

interface Props {
  id: number;
  name?: string;
}

const ImageBannerActionCell: FC<Props> = ({ id, name }) => {
  const { itemIdForUpdate, setItemIdForUpdate } = useListView();
  const queryClient = useQueryClient();

  const { data, error, isLoading } = useQuery({
    queryKey: [QUERIES.ImageBannerList, id],
    queryFn: () => {
      return ImageBannerQueryByIdInstance.getImageBannerById(ImageBannerUrlEnum.GetImageBannerById, id);
    },
    onError: () => {
      console.error("Error submitting form:", error);
      CustomToast(`Failed to get ImageBanner data`, "error");
      setItemIdForUpdate(undefined);
    },
    enabled: itemIdForUpdate === id,
  });

  const { mutate: deleteImageBanner } = useMutation(
    async (id: number) => {
      const data = await ImageBannerCommandInstance.deleteImageBanner(
        ImageBannerUrlEnum.DeleteImageBanner,
        id
      );
      return data;
    },
    {
      onSuccess: async (res: IImageBannerData | number) => {
        if (res === -1) {
          const confirmForceDelete = await showConfirmationAlert(
            "This Item has Related entities"
          );
          if (confirmForceDelete) {
            await ImageBannerCommandInstance.deleteImageBanner(
              ImageBannerUrlEnum.DeleteImageBanner + `forceDelete=true&`,
              id
            );
            CustomToast(`Deleted successfully`, "success");
            showDeletedAlert(name);
            queryClient.invalidateQueries({
              queryKey: [QUERIES.ImageBannerList],
            });
          }
        } else {
          CustomToast(`Deleted successfully`, "success");
          showDeletedAlert(name);
          queryClient.invalidateQueries({
            queryKey: [QUERIES.ImageBannerList],
          });
        }
      },
      onError: (error) => {
        console.error("Error when delete ImageBanner", error);
        CustomToast(`Failed to delete ImageBanner`, "error");
      },
    }
  );

  const handleDelete = async () => {
    const confirm = await showConfirmationAlert(name);
    if (confirm) {
      deleteImageBanner(id);
    }
  };
  const checkSuperEditPermission = useCheckPermission("Access Super Edit");
  const checkSuperDeletePermission = useCheckPermission("Access Super Delete");
  return (
    <>
      <CustomActionsCell
        id={id}
        editBtn={checkSuperEditPermission}
        editBtnOnClick={() => {
          setItemIdForUpdate(id);
        }}
        deleteBtn={checkSuperDeletePermission}
        deletBtnOnClick={() => handleDelete()}
      />
      {itemIdForUpdate === id && (
        <CustomModal
          modalSize="xl"
          modalTitle="ImageBanner-UPDATE-MODAL"
          onClick={() => {
            setItemIdForUpdate(undefined);
          }}
        >
          {data && <UpdateImageBanner ImageBannerData={data} isLoading={isLoading} />}
        </CustomModal>
      )}
    </>
  );
};

export { ImageBannerActionCell };

import {
  CustomActionsCell,
  CustomModal,
  showConfirmationAlert,
  showDeletedAlert,
} from "@presentation/components";
import { CustomToast } from "@presentation/components/alerts/CustomToast";

import { FC, useState } from "react";
import { useQueryClient, useMutation } from "react-query";
import { QUERIES } from "@presentation/helpers";

import { useListView } from "@presentation/context/index";
import { ISightSeeingCategoryData } from "@domain/entities";
import { SightSeeingCategoryCommandInstance } from "@app/index";
import { SightSeeingCategoryQueryByIdInstance } from "@app/index";
import { UpdateSightSeeingCategoryModalForm } from "./UpdateSightSeeingCategoryModalForm";
import { SightSeeingCategoryUrlEnum } from "@domain/enums";

interface Props {
  id: number;
  name: string;
}

const SightSeeingCategoryActionCell: FC<Props> = ({ id, name }) => {
  const { itemIdForUpdate, setItemIdForUpdate } = useListView();
  const queryClient = useQueryClient();
  const [data, setData] = useState<ISightSeeingCategoryData>();
  const [isLoading, setIsLoading] = useState(true);

  const openUpdateSightSeeingCategoryModal = async (id: number) => {
    try {
      setIsLoading(true);
      setItemIdForUpdate(id);
      const data =
        await SightSeeingCategoryQueryByIdInstance.getSightSeeingCategoryById(
          SightSeeingCategoryUrlEnum.GetSightSeeingCategoryById,
          id
        );
      setData(data);
    } catch (error) {
      console.error("Error submitting form:", error);
      CustomToast(`Failed to get Sightseeing Category data`, "error");
      // setItemIdForUpdate(undefined);
    } finally {
      setIsLoading(false);
    }
  };
  const { mutate: deleteSightSeeingCategory } = useMutation(
    async (id: number) => {
      const data =
        await SightSeeingCategoryCommandInstance.deleteSightSeeingCategory(
          SightSeeingCategoryUrlEnum.DeleteSightSeeingCategory,
          id
        );
      return data;
    },
    {
      onSuccess: async (res: ISightSeeingCategoryData | number) => {
        if (res === -1) {
          const confirmForceDelete = await showConfirmationAlert(
            "This Item has Related entities"
          );
          if (confirmForceDelete) {
            await SightSeeingCategoryCommandInstance.deleteSightSeeingCategory(
              SightSeeingCategoryUrlEnum.DeleteSightSeeingCategory +
                `forceDelete=true&`,
              id
            );
            CustomToast(`Deleted successfully`, "success");
            showDeletedAlert(name);
            queryClient.invalidateQueries({
              queryKey: [QUERIES.SightSeeingCategoryList],
            });
          }
        } else {
          CustomToast(`Deleted successfully`, "success");
          showDeletedAlert(name);
          queryClient.invalidateQueries({
            queryKey: [QUERIES.SightSeeingCategoryList],
          });
        }
      },
      onError: (error) => {
        console.error("Error when delete Sightseeing Category ", error);
        CustomToast(`Failed to delete Sightseeing Category `, "error");
      },
    }
  );

  const handleDelete = async () => {
    const confirm = await showConfirmationAlert(name);
    if (confirm) {
      deleteSightSeeingCategory(id);
    }
  };

  return (
    <>
      <CustomActionsCell
        id={id}
        editBtnOnClick={() => {
          openUpdateSightSeeingCategoryModal(id);
        }}
        deletBtnOnClick={() => handleDelete()}
      />
      {itemIdForUpdate === id && (
        <CustomModal
          modalSize="lg"
          modalTitle="HOTEL-HOTEL-SIGHT-SEEING-CATEGORY-UPDATE-MODAL-TITLE"
          onClick={() => {
            setItemIdForUpdate(undefined);
          }}
        >
          {data && (
            <UpdateSightSeeingCategoryModalForm
              SightSeeingCategoryData={data}
              isLoading={isLoading}
              openUpdateSightSeeingCategoryModal={
                openUpdateSightSeeingCategoryModal
              }
            />
          )}
        </CustomModal>
      )}
    </>
  );
};

export { SightSeeingCategoryActionCell };

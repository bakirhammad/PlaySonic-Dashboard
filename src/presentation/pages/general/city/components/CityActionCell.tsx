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
import { CityQueryByIdInstance } from "@app/useCases/general/city/query/CityQueryById";
import { CityUrlEnum } from "@domain/enums/URL/General/GeneralEnum/CityEnum";
import { CityCommandInstance } from "@app/useCases/general/city/commands/CityCommand";
import { ICityData } from "@domain/entities/general/city/City";
import UpdateCity from "./UpdateCity";

interface Props {
  id: number;
  name?: string;
}

const CityActionCell: FC<Props> = ({ id, name }) => {
  const { itemIdForUpdate, setItemIdForUpdate } = useListView();
  const queryClient = useQueryClient();

  const { data, error, isLoading } = useQuery({
    queryKey: [QUERIES.CityList, id],
    queryFn: () => {
      return CityQueryByIdInstance.getCityById(CityUrlEnum.GetCityById, id);
    },
    onError: () => {
      console.error("Error submitting form:", error);
      CustomToast(`Failed to get City data`, "error");
      setItemIdForUpdate(undefined);
    },
    enabled: itemIdForUpdate === id,
  });

  const { mutate: deleteCity } = useMutation(
    async (id: number) => {
      const data = await CityCommandInstance.deleteCity(
        CityUrlEnum.DeleteCity,
        id
      );
      return data;
    },
    {
      onSuccess: async (res: ICityData | number) => {
        if (res === -1) {
          const confirmForceDelete = await showConfirmationAlert(
            "This Item has Related entities"
          );
          if (confirmForceDelete) {
            await CityCommandInstance.deleteCity(
              CityUrlEnum.DeleteCity + `forceDelete=true&`,
              id
            );
            CustomToast(`Deleted successfully`, "success");
            showDeletedAlert(name);
            queryClient.invalidateQueries({
              queryKey: [QUERIES.CityList],
            });
          }
        } else {
          CustomToast(`Deleted successfully`, "success");
          showDeletedAlert(name);
          queryClient.invalidateQueries({
            queryKey: [QUERIES.CityList],
          });
        }
      },
      onError: (error) => {
        console.error("Error when delete City", error);
        CustomToast(`Failed to delete City`, "error");
      },
    }
  );

  const handleDelete = async () => {
    const confirm = await showConfirmationAlert(name);
    if (confirm) {
      deleteCity(id);
    }
  };

  return (
    <>
      <CustomActionsCell
        id={id}
        editBtnOnClick={() => {
          setItemIdForUpdate(id);
        }}
        deletBtnOnClick={() => handleDelete()}
      />
      {itemIdForUpdate === id && (
        <CustomModal
          modalSize="xl"
          modalTitle="City-UPDATE-MODAL"
          onClick={() => {
            setItemIdForUpdate(undefined);
          }}
        >
          {data && (
            <UpdateCity CityData={data} isLoading={isLoading} />
          )}
        </CustomModal>
      )}
    </>
  );
};

export { CityActionCell };

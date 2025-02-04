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
import { CountryQueryByIdInstance } from "@app/useCases/general/country/query/CountryQueryById";
import { CountryUrlEnum } from "@domain/enums";
import { CountryCommandInstance } from "@app/useCases/general/country/commands/CountryCommand";
import { ICountryBody } from "@domain/entities";
import UpdateCountry from "./UpdateCountry";
import useCheckPermission from "@presentation/helpers/useCheckPermission";

interface Props {
  id: number;
  name?: string;
}

const CountryActionCell: FC<Props> = ({ id, name }) => {
  const { itemIdForUpdate, setItemIdForUpdate } = useListView();
  const queryClient = useQueryClient();

  const { data, error, isLoading } = useQuery({
    queryKey: [QUERIES.CountryList, id],
    queryFn: () => {
      return CountryQueryByIdInstance.getCountryById(
        CountryUrlEnum.GetCountryById,
        id
      );
    },
    onError: () => {
      console.error("Error submitting form:", error);
      CustomToast(`Failed to get Country data`, "error");
      setItemIdForUpdate(undefined);
    },
    enabled: itemIdForUpdate === id,
  });

  const { mutate: deleteCountry } = useMutation(
    async (id: number) => {
      const data = await CountryCommandInstance.deleteCountry(
        CountryUrlEnum.DeleteCountry,
        id
      );
      return data;
    },
    {
      onSuccess: async (res: ICountryBody | number) => {
        if (res === -1) {
          const confirmForceDelete = await showConfirmationAlert(
            "This Item has Related entities"
          );
          if (confirmForceDelete) {
            await CountryCommandInstance.deleteCountry(
              CountryUrlEnum.DeleteCountry + `forceDelete=true&`,
              id
            );
            CustomToast(`Deleted successfully`, "success");
            showDeletedAlert(name);
            queryClient.invalidateQueries({
              queryKey: [QUERIES.CountryList],
            });
          }
        } else {
          CustomToast(`Deleted successfully`, "success");
          showDeletedAlert(name);
          queryClient.invalidateQueries({
            queryKey: [QUERIES.CountryList],
          });
        }
      },
      onError: (error) => {
        console.error("Error when delete Country", error);
        CustomToast(`Failed to delete Country`, "error");
      },
    }
  );

  const handleDelete = async () => {
    const confirm = await showConfirmationAlert(name);
    if (confirm) {
      deleteCountry(id);
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
          modalSize="Default"
          modalTitle="Country-UPDATE-MODAL"
          onClick={() => {
            setItemIdForUpdate(undefined);
          }}
        >
          {data && <UpdateCountry CountryData={data} isLoading={isLoading} />}
        </CustomModal>
      )}
    </>
  );
};

export { CountryActionCell };

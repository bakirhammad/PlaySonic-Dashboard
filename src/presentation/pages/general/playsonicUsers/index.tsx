import { CustomTable } from "@presentation/components/tables";
import { CustomKTCard } from "@presentation/helpers/index";
import { CustomTableToolbar } from "@presentation/components/subToolbar";
import { useEffect, useMemo } from "react";
import { QUERIES } from "@presentation/helpers";
import { useQuery } from "react-query";
import {
  ListViewProvider,
  QueryRequestProvider,
  useListView,
  useQueryRequest,
} from "@presentation/context/index";
import { PlaysonicUsersListColumns } from "./components/PlaysonicUsersListColumns";
import { PlaysonicUsersUrlEnum } from "@domain/enums/URL/General/GeneralEnum/PlaysonicUsers";
import { PlaysonicUsersQueryInstance } from "@app/useCases/general/playsonicUsers/query/PlaysonicUsersQuery";
import useCheckPermission from "@presentation/helpers/useCheckPermission";

const PlaysonicUsers = () => {
  const { updateData, query, setIsLoading, setError } = useQueryRequest();
  const columns = useMemo(() => PlaysonicUsersListColumns, []);

  const { itemIdForUpdate, setItemIdForUpdate } = useListView();
  const {
    data: PlaysonicUsersData,
    error,
    isLoading,
    isFetching,
  } = useQuery({
    queryKey: [QUERIES.PlaysonicUsersList, [query]],
    queryFn: () => {
      const searchQuery = query ? `&${query}` : "";
      return PlaysonicUsersQueryInstance.getPlaysonicUsersList(
        `${PlaysonicUsersUrlEnum.GetPlaysonicUsersList + searchQuery}`
      );
    },
  });

  useEffect(() => {
    updateData(PlaysonicUsersData);
    setIsLoading(isFetching || isLoading);
    setError(error as Error);
  }, [PlaysonicUsersData, isFetching, isLoading, error]);

  const tableData = useMemo(
    () => PlaysonicUsersData?.data,
    [PlaysonicUsersData]
  );
  // const checkSuperCreatePermission = useCheckPermission("Access Super Create");
  return (
    <>
      <CustomKTCard>
        <CustomTableToolbar
          addBtnAction={() => {
            setItemIdForUpdate(null);
          }}
          searchPlaceholder="SEARCH"
          filterBtn={true}
          // FilterComponent={<PlaysonicUsersFilter></PlaysonicUsersFilter>}
          addBtn={false}
          addName="ADD"
        />
        <CustomTable columns={columns} data={tableData || []} />
      </CustomKTCard>
    </>
  );
};

function PlaysonicUsersListWrapper() {
  return (
    <QueryRequestProvider>
      <ListViewProvider>
        <PlaysonicUsers />
      </ListViewProvider>
    </QueryRequestProvider>
  );
}
export default PlaysonicUsersListWrapper;

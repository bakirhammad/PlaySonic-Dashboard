/* eslint-disable react-refresh/only-export-components */
import { FC, useState, createContext, useContext, useMemo } from "react";
import {
  ListViewContextProps,
  ID,
  WithChildren,
  calculateIsAllDataSelected,
  calculatedGroupingIsDisabled,
  groupingOnSelect,
  groupingOnSelectAll,
  initialListView,
} from "../../helpers";

import { useQueryRequest } from "../queryRequestContext/QueryRequestProvider";
const ListViewContext = createContext<ListViewContextProps>(initialListView);

const ListViewProvider: FC<WithChildren> = ({ children }) => {
  const [selected, setSelected] = useState<Array<number>>(
    initialListView.selected
  );

  const [itemIdForUpdate, setItemIdForUpdate] = useState<ID | string>(
    initialListView.itemIdForUpdate
  );

  const { data, isLoading } = useQueryRequest();
  const responseData = data?.data;
  const disabled = useMemo(
    () => calculatedGroupingIsDisabled(isLoading, responseData),
    [isLoading, responseData]
  );
  const isAllSelected = useMemo(
    () => calculateIsAllDataSelected(responseData, selected),
    [responseData, selected]
  );
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <ListViewContext.Provider
      value={{
        selected,
        itemIdForUpdate,
        setItemIdForUpdate,
        disabled,
        isAllSelected,
        onSelect: (id: number) => {
          groupingOnSelect(id, selected, setSelected);
        },
        onSelectAll: () => {
          groupingOnSelectAll(isAllSelected, setSelected, responseData);
        },
        clearSelected: () => {
          setSelected([]);
        },
        isModalOpen,
        setIsModalOpen,
      }}
    >
      {children}
    </ListViewContext.Provider>
  );
};

const useListView = () => useContext(ListViewContext);

export { ListViewProvider, useListView };

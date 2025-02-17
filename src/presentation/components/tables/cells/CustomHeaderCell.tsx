/* eslint-disable @typescript-eslint/no-explicit-any */
import clsx from "clsx";
import { FC, PropsWithChildren, useMemo } from "react";
import { HeaderProps } from "react-table";
import { initialQueryState } from "../../../helpers";
import { useQueryRequest } from "../../../context/queryRequestContext/QueryRequestProvider";
import { useLocaleFormate } from "../../../hooks/localization/useLocaleFormate";

type Props = {
  className?: string;
  title: string;
  tableProps?: PropsWithChildren<HeaderProps<any>> | any;
  enableSorting?: boolean;
};
const CustomHeaderCell: FC<Props> = ({
  className,
  title,
  tableProps,
  enableSorting = true,
}) => {
  const id =
    tableProps?.column.id === "approval" ? "status" : tableProps?.column.id;
  const { state, updateState } = useQueryRequest();

  const isSelectedForSorting = useMemo(() => {
    return state.orderBy && state.orderBy === id;
  }, [state, id]);

  const orderDirection: "asc" | "desc" | undefined = useMemo(
    () => (state.orderDirection ? "asc" : "desc"),
    [state]
  );

  const orderByColumn = () => {
    // avoid orderBying for these columns
    if (id === "actions" || id === "selection") {
      return;
    }

    if (!isSelectedForSorting) {
      // enable orderBy asc
      updateState({ orderBy: id, orderDirection: true, ...initialQueryState });
      return;
    }

    if (isSelectedForSorting && orderDirection !== undefined) {
      if (orderDirection === "asc") {
        // enable orderBy desc
        updateState({
          orderBy: id,
          orderDirection: false,
          ...initialQueryState,
        });
        return;
      }

      // disable orderBy
      updateState({
        orderBy: undefined,
        orderDirection: undefined,
        ...initialQueryState,
      });
    }
  };

  const { key, ...restProps } = tableProps?.column.getHeaderProps() || {};
  return (
    <div
      {...restProps}
      key={key}
      className={clsx(
        "min-w-100px text-start position-relative tw-justify-center",
        id === "actions" ? "text-center" : "",
        enableSorting && id !== "actions" && id !== "selection"
          ? isSelectedForSorting && orderDirection != undefined
            ? `table-sort-${orderDirection}`
            : "table-sort-both"
          : "",
        className
      )}
      style={{ cursor: "pointer", marginRight: "10px" }}
      onClick={enableSorting ? orderByColumn : () => {}}
    >
      {useLocaleFormate(title)}
    </div>
  );
};

export { CustomHeaderCell };

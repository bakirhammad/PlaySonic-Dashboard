/* eslint-disable @typescript-eslint/no-explicit-any */
import { FC, useMemo } from "react";
import { useTable, useExpanded, Row, useGroupBy } from "react-table";

import {
  CustomKTCardBody,
  CustomTablePagination,
  CustomErrorMessage,
} from "@presentation/components";
import { useIntl } from "react-intl";
import { WithChildren } from "@presentation/helpers/react18MigrationHelpers";
import { useQueryRequest } from "@presentation/context";
import PleaseWaitTxt from "@presentation/helpers/loading/PleaseWaitTxt";
import React from "react";

interface TableProps {
  columns: any;
  data: any;
  withPagination?: boolean;
  ExpandingComponent?: FC<{ data: any; row: Row }>;
}

const CustomTablerrr: FC<TableProps & WithChildren> = ({
  columns,
  data,
  withPagination = true,
  ExpandingComponent,
}) => {
  const intl = useIntl();
  const { isLoading, error } = useQueryRequest();
  function useControlledState(state) {
    return React.useMemo(() => {
      if (state.groupBy.length) {
        return {
          ...state,
          hiddenColumns: [...state.hiddenColumns, ...state.groupBy].filter(
            (d, i, all) => all.indexOf(d) === i
          ),
        };
      }
      return state;
    }, [state]);
  }
  const { getTableProps, getTableBodyProps, headerGroups, rows, prepareRow } =
    useTable(
      {
        columns,

        data,
      },
      useGroupBy,
      useExpanded,
      (hooks) => {
        hooks.useControlledState.push(useControlledState);
        hooks.visibleColumns.push((columns, { instance }) => {
          if (!instance.state.groupBy.length) {
            return columns;
          }

          return [
            {
              id: "expander",
              Header: ({ allColumns, state: { groupBy } }) => {
                return groupBy.map((columnId) => {
                  const column = allColumns.find((d) => d.id === columnId);

                  return (
                    <span {...column.getHeaderProps()}>
                      {column.canGroupBy ? (
                        // If the column can be grouped, let's add a toggle
                        <span {...column.getGroupByToggleProps()}>
                          {column.isGrouped ? "🛑 " : "👊 "}
                        </span>
                      ) : null}
                      {column.render("Header")}
                    </span>
                  );
                });
              },
              Cell: ({ row }) => {
                if (row.canExpand) {
                  const groupedCell = row.allCells.find((d) => d.isGrouped);

                  return (
                    <span
                      {...row.getToggleRowExpandedProps({
                        style: {
                          paddingLeft: `${row.depth * 2}rem`,
                        },
                      })}
                    >
                      {row.isExpanded ? "👇" : "👉"}{" "}
                      {groupedCell.render("Cell")} ({row.subRows.length})
                    </span>
                  );
                }

                return null;
              },
            },
            ...columns,
          ];
        });
      }
    );

  const newRows = useMemo(() => rows, [columns, rows]);

  if (isLoading) {
    return (
      <div className="d-flex text-center w-200 align-content-center justify-content-center">
        <PleaseWaitTxt />
      </div>
    );
  }

  if (error) {
    return (
      <div className="d-flex text-center w-100 align-content-center justify-content-center">
        <CustomErrorMessage
          error={error?.message}
          additionalClassName="text-center m-auto"
        />
      </div>
    );
  }

  return (
    <CustomKTCardBody className="py-4">
      <div className="table-responsive mb-12">
        <table
          {...getTableProps()}
          id="kt_table_users"
          className="table align-middle table-row-dashed fs-6 gy-5 dataTable no-footer"
        >
          <thead {...getTableProps()}>
            {headerGroups.map((headerGroup) => (
              <tr
                className="text-start text-muted fw-bolder fs-7 text-uppercase gs-0"
                {...headerGroup.getHeaderGroupProps()}
              >
                {headerGroup.headers.map((column, index) => (
                  <th className="" {...column.getHeaderProps()}>
                    {column.canGroupBy && index > 6 ? "             " : null}
                    {column.render("Header")}
                  </th>
                ))}
              </tr>
            ))}
          </thead>
          <tbody className="text-gray-600 fw-bold" {...getTableBodyProps()}>
            {newRows.map((row, i) => {
              prepareRow(row);
              return (
                <tr {...row.getRowProps()}>
                  {row.cells.map((cell) => {
                    return (
                      <td
                        // For educational purposes, let's color the
                        // cell depending on what type it is given
                        // from the useGroupBy hook
                        {...cell.getCellProps()}
                        style={{
                          background: cell.isGrouped
                            ? "#0aff0082"
                            : cell.isAggregated
                            ? "#ffa50078"
                            : cell.isPlaceholder
                            ? "#ff000042"
                            : "white",
                        }}
                      >
                        {cell.isAggregated
                          ? // If the cell is aggregated, use the Aggregated
                            // renderer for cell
                            cell.render("Aggregated")
                          : cell.isPlaceholder
                          ? null // For cells with repeated values, render null
                          : // Otherwise, just render the regular cell
                            cell.render("Cell")}
                      </td>
                    );
                  })}
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {withPagination && <CustomTablePagination />}
    </CustomKTCardBody>
  );
};

export { CustomTablerrr };

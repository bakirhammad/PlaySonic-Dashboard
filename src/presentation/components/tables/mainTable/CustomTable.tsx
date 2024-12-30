/* eslint-disable @typescript-eslint/no-explicit-any */
import { FC, useMemo, useRef } from "react";
import { useTable, useExpanded, Row, UseExpandedRowProps } from "react-table";
import { CustomHeaderRow } from "./CustomHeaderRow";
import { CustomRow } from "./CustomRow";
import { CustomTablePagination } from "../../pagination/CustomTablePagination";
import { useIntl } from "react-intl";
import { CustomErrorMessage, CustomKTCardBody } from "../..";
import { WithChildren } from "@presentation/helpers/react18MigrationHelpers";
import { useQueryRequest } from "@presentation/context";
import PleaseWaitTxt from "@presentation/helpers/loading/PleaseWaitTxt";
import React from "react";
import clsx from "clsx";

interface TableProps {
  columns: any;
  data: any;
  withPagination?: boolean;
  stripedTable?: boolean;
  ExpandingComponent?: FC<{ data: any; row: Row }>;
}

const CustomTable: FC<TableProps & WithChildren> = ({
  columns,
  data,
  withPagination = true,
  stripedTable = true,
  ExpandingComponent,
}) => {
  const intl = useIntl();
  const { isLoading, error } = useQueryRequest();
  const actionCellsElement = useRef<HTMLTableCellElement[]>([]);
  const { getTableProps, getTableBodyProps, headerGroups, rows, prepareRow } =
    useTable(
      {
        columns,
        data,
      },
      useExpanded
    );

  const newRows = useMemo(() => rows, [rows]);

  if (isLoading) {
    return (
      <div className="d-flex text-center w-100 align-content-center justify-content-center">
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
          id="kt_table_users"
          className={clsx(
            "table  align-middle table-row-dashed fs-6 gy-5 dataTable no-footer",
            { "table-striped table-hover": stripedTable }
          )}
          {...getTableProps()}
        >
          {/* Table Header */}
          <thead>
            {headerGroups.map((headerGroup, idx) => (
              <tr
                className="text-start text-muted fw-bolder fs-7 text-uppercase gs-0"
                {...headerGroup.getHeaderGroupProps()}
                key={idx}
              >
                {headerGroup.headers.map((column) => (
                  <CustomHeaderRow key={column.id} column={column} />
                ))}
              </tr>
            ))}
          </thead>

          {/* Table Body */}
          <tbody className="text-gray-600 fw-bold" {...getTableBodyProps()}>
            {newRows.length > 0 ? (
              newRows.map((row: Row<UseExpandedRowProps>, i) => {
                prepareRow(row);

                return (
                  <React.Fragment key={`row-${i}-${row.id}`}>
                    <CustomRow
                      ref={actionCellsElement.current}
                      row={row}
                      disabled={row.original.isDisabled}
                    />

                    {row.isExpanded && ExpandingComponent && (
                      <tr>
                        <td colSpan={columns.length}>
                          <ExpandingComponent data={row.original} row={row} />
                        </td>
                      </tr>
                    )}
                  </React.Fragment>
                );
              })
            ) : (
              <tr>
                <td colSpan={columns.length}>
                  <div className="d-flex text-center w-100 align-content-center justify-content-center">
                    {intl.formatMessage({ id: "NO_MATCHING_RECORDS_FOUND" })}
                  </div>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {withPagination && data.length ? <CustomTablePagination /> : <></>}
    </CustomKTCardBody>
  );
};

export { CustomTable };

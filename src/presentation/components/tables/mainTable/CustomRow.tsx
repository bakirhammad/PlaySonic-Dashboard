import clsx from "clsx";
import React, { FC, forwardRef } from "react";
import { Row } from "react-table";

type Props = {
  row: Row;
  disabled?: boolean;
};

type RefType = HTMLTableCellElement[];

const CustomRows: FC<Props> = forwardRef<RefType, Props>(
  ({ row, disabled }, ref) => {
    const { key, ...restProps } = row.getRowProps();

    const handleCellClick = (index: number) => {
      if (ref && Array.isArray(ref)) {
        ref.forEach((ele, idx) => {
          if (ele) {
            ele.style.zIndex = idx === index ? "110" : "1";
          }
        });
      }
    };
    return (
      <tr
        {...restProps}
        key={key}
        className={clsx({ "bg-gray-200 px-5": disabled })}
        style={{ opacity: disabled ? 0.5 : 1 }}
      >
        {row.cells.map((cell, cellIdx) => {
          const { key: cellKey, ...cellRestProps } = cell.getCellProps();
          const cellId = `${row.index}-${cellIdx}`;

          return (
            <td
              key={cellKey}
              id={cellId}
              {...cellRestProps}
              style={
                cell.column.id === "actions"
                  ? {
                      // display: "flex",
                      justifyContent: "center",
                      // width: "100%",
                      position: "sticky",
                      right: 0,
                      backgroundColor: "white",
                      cursor: "pointer",
                      borderLeft: "2px solid #dbdfe9",
                    }
                  : {}
              }
              ref={(el) => {
                if (ref && Array.isArray(ref) && cell.column.id === "actions") {
                  ref[row.index] = el;
                }
              }}
              onClick={() => handleCellClick(row.index)}
            >
              {cell.render("Cell", { key: cellKey })}
            </td>
          );
        })}
      </tr>
    );
  }
);

const CustomRow = React.memo(CustomRows);

export { CustomRow };

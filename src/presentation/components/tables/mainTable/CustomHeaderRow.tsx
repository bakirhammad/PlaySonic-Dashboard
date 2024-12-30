import React from "react";
import { FC } from "react";
import { ColumnInstance } from "react-table";

type Props = {
  column: ColumnInstance<object>;
};

const CustomHeaderRow: FC<Props> = ({ column }) => {
  const renderHeader = (col: ColumnInstance<object>) => {
    const { key, ...restProps } = col.getHeaderProps();
    return (
      <th
        key={key}
        {...restProps}
        style={
          col.id === "actions"
            ? {
                position: "sticky",
                right: 0,
                backgroundColor: "white",
                zIndex: 1,
                // display: "flex",
                justifyContent: "center",
                borderLeft: "2px solid #dbdfe9",
                marginLeft: 1,
              }
            : {}
        }
      >
        {col.render("Header")}
      </th>
    );
  };

  return (
    <>
      {column.columns
        ? column.columns.map((col) => (
            <React.Fragment key={col.id}>{renderHeader(col)}</React.Fragment>
          ))
        : renderHeader(column)}
    </>
  );
};

export { CustomHeaderRow };

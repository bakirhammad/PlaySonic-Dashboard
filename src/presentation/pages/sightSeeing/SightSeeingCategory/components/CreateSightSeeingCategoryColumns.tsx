import { Column } from "react-table";
import { ISightSeeingCategoryData } from "@domain/entities";
import {
  CustomCell,
  CustomHeaderCell,
  CustomSelectAll,
  CustomSelectionCell,
  CustomStatusCell,
} from "@presentation/components/tables";
import { SightSeeingCategoryActionCell } from "./CustomSightSeeingCategoryActionCell";

const SightSeeingCategoryListColumns: ReadonlyArray<
  Column<ISightSeeingCategoryData>
> = [
  {
    Header: (props) => <CustomSelectAll tableProps={props} />,
    id: "selection",
    Cell: ({ ...props }) => (
      <CustomSelectionCell id={props.data[props.row.index]?.id} />
    ),
  },
  {
    Header: (props) => (
      <CustomHeaderCell
        tableProps={props}
        title="SIGHT-SEEING-CATEGORY-NAME-COLUMN"
        enableSorting={false}
        className="min-w-125px"
      />
    ),
    id: "name",
    Cell: ({ ...props }) => (
      <CustomCell
        data={String(
          props.data[props.row.index]?.translations
            ? props.data[props.row.index]?.translations[0]?.name
            : "no name"
        )}
      />
    ),
  },
  {
    Header: (props) => (
      <CustomHeaderCell
        tableProps={props}
        title="SIGHT-SEEING-CATEGORY-CODE-COLUMN"
        enableSorting={false}
        className="min-w-125px"
      />
    ),
    id: "code",
    Cell: ({ ...props }) => (
      <CustomCell data={props.data[props.row.index]?.code} />
    ),
  },
  {
    Header: (props) => (
      <CustomHeaderCell
        tableProps={props}
        title="SIGHT-SEEING-CATEGORY-STATUS-COLUMN"
        className="min-w-125px"
      />
    ),
    id: "status",
    Cell: ({ ...props }) => (
      <>
        <CustomStatusCell
          status={props.data[props.row.index].status ? "success" : "danger"}
          title={props.data[props.row.index].status ? "Active" : "InActive"}
        />
      </>
    ),
  },
  {
    Header: (props) => (
      <CustomHeaderCell
        tableProps={props}
        title="ACTION"
        className=" min-w-100px"
      />
    ),
    id: "actions",
    Cell: ({ ...props }) => (
      <SightSeeingCategoryActionCell
        id={props.data[props.row.index].id}
        name={props.data[props.row.index]?.translations[0]?.name}
      />
    ),
  },
];

export { SightSeeingCategoryListColumns };

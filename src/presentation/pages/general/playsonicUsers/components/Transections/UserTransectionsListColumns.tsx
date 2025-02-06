import { Column } from "react-table";
import {
  CustomCell,
  CustomHeaderCell,
  CustomSelectAll,
  CustomSelectionCell,
} from "@presentation/components/tables";
import { ICommerceData } from "@domain/entities/Commerce/Commerce";
import { TransectionTypeCell } from "@presentation/helpers/cells/TransectionTypeCell";

const UserTransectionsListColumns: ReadonlyArray<Column<ICommerceData>> = [
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
        title="NAME"
        enableSorting={false}
        className="min-w-125px"
      />
    ),
    id: "name",
    Cell: ({ ...props }) => {
      return <CustomCell data={props.data[props.row.index]?.userName} />;
    },
  },
  {
    Header: (props) => (
      <CustomHeaderCell
        tableProps={props}
        title="Amount"
        enableSorting={false}
        className="min-w-125px"
      />
    ),
    id: "amount",
    Cell: ({ ...props }) => {
      return <CustomCell data={props.data[props.row.index]?.amount} />;
    },
  },
  {
    Header: (props) => (
      <CustomHeaderCell
        tableProps={props}
        title="Transection-Type"
        enableSorting={false}
        className="min-w-125px"
      />
    ),
    id: "type",
    Cell: ({ ...props }) => {
      return (
        <TransectionTypeCell
          type={props.data[props.row.index]?.transactionType}
        />
      );
    },
  },
  {
    Header: (props) => (
      <CustomHeaderCell
        tableProps={props}
        title="Note"
        enableSorting={false}
        className="min-w-125px"
      />
    ),
    id: "notes",
    Cell: ({ ...props }) => {
      return <CustomCell data={props.data[props.row.index]?.notes} />;
    },
  },
  {
    Header: (props) => (
      <CustomHeaderCell
        tableProps={props}
        title="AddedDate"
        enableSorting={false}
        className="min-w-125px"
      />
    ),
    id: "date",
    Cell: ({ ...props }) => {
      return <CustomCell data={props.data[props.row.index]?.dateAdded} />;
    },
  },
];

export { UserTransectionsListColumns };

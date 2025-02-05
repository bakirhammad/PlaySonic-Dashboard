import { Column } from "react-table";
import {
  CustomCell,
  CustomHeaderCell,
  CustomSelectAll,
  CustomSelectionCell,
} from "@presentation/components/tables";

import { IMyUsersData } from "@domain/entities/MyUsers/MyUsers";

const MyUsersListColumns: ReadonlyArray<Column<IMyUsersData>> = [
  {
    Header: (props) => <CustomSelectAll tableProps={props} />,
    id: "selection",
    Cell: ({ ...props }) => (
      <CustomSelectionCell id={props.data[props.row.index]?.id} />
    ),
  },
  // {
  //   Header: (props) => (
  //     <CustomHeaderCell
  //       tableProps={props}
  //       title="SIDEBAR-ROLE-ID"
  //       enableSorting={false}
  //       className="min-w-125px"
  //     />
  //   ),
  //   id: "id",
  //   Cell: ({ ...props }) => (
  //     <CustomCell data={props.data[props.row.index]?.id} />
  //   ),
  // },
  {
    Header: (props) => (
      <CustomHeaderCell
        tableProps={props}
        title="ROLE-NAME"
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
        title="Email"
        enableSorting={false}
        className="min-w-125px"
      />
    ),
    id: "email",
    Cell: ({ ...props }) => {
      return <CustomCell data={props.data[props.row.index]?.email} />;
    },
  },
  {
    Header: (props) => (
      <CustomHeaderCell
        tableProps={props}
        title="PhoneNumber"
        enableSorting={false}
        className="min-w-125px"
      />
    ),
    id: "phoneNumber",
    Cell: ({ ...props }) => {
      return <CustomCell data={props.data[props.row.index]?.phoneNo} />;
    },
  },
  {
    Header: (props) => (
      <CustomHeaderCell
        tableProps={props}
        title="Transection "
        className="min-w-100px"
      />
    ),
    id: "actions",
    Cell: ({ ...props }) => (
     <></>
    ),
  },
];

export { MyUsersListColumns };

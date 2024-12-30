import {
  CustomCell,
  CustomHeaderCell,
  CustomSelectAll,
  CustomSelectionCell,
  CustomStatusCell,
} from "@presentation/components";
import { CardChargeActionCell } from "@presentation/pages/admin/cardChargesList/comopnents/CustomCardChargesActionsCell";
import { User } from "@presentation/services/index";
import { Column } from "react-table";

const ManageClientsColumns: ReadonlyArray<Column<User>> = [
  {
    Header: (props) => <CustomSelectAll tableProps={props} />,
    id: "selection",
    Cell: ({ ...props }) => (
      <CustomSelectionCell id={props.data[props.row.index].id} />
    ),
  },
  {
    Header: (props) => (
      <CustomHeaderCell
        tableProps={props}
        title="MANAGE-CLIENTS-USER-NAME"
        className="min-w-125px"
      />
    ),
    id: "usename",
    Cell: ({}) => <CustomCell data={""} />,
  },
  {
    Header: (props) => (
      <CustomHeaderCell
        tableProps={props}
        title="MANAGE-CLIENTS-CITY"
        className="min-w-125px"
      />
    ),
    id: "city",
    Cell: ({}) => <CustomCell data={""} />,
  },
  {
    Header: (props) => (
      <CustomHeaderCell
        tableProps={props}
        title="MANAGE-CLIENTS-EAMIL"
        className="min-w-125px"
      />
    ),
    id: "email",
    Cell: ({}) => <CustomCell data={""} />,
  },
  {
    Header: (props) => (
      <CustomHeaderCell
        tableProps={props}
        title="MANAGE-CLIENTS-PHONE-NO"
        className="min-w-125px"
      />
    ),
    id: "phoneno",
    Cell: ({}) => <CustomCell data={""} />,
  },
  {
    Header: (props) => (
      <CustomHeaderCell
        tableProps={props}
        title="MANAGE-CLIENTS-CREATED-ON"
        className="min-w-125px"
      />
    ),
    id: "createdon",
    Cell: ({}) => <CustomCell data={""} />,
  },
  {
    Header: (props) => (
      <CustomHeaderCell
        tableProps={props}
        title="CARD-CHARGES-STATUS"
        className="text-end min-w-100px"
        enableSorting={false}
      />
    ),
    id: "isActive",
    Cell: ({ ...props }) => (
      <CustomStatusCell
        status={props.data[props.row.index].isActive ? "success" : "danger"}
        title={props.data[props.row.index].isActive ? "Active" : "inActive"}
      />
    ),
  },
  {
    Header: (props) => (
      <CustomHeaderCell
        tableProps={props}
        title="ACTION"
        className="text-start min-w-100px"
      />
    ),
    id: "actions",
    Cell: ({}) => (
      <CardChargeActionCell
        id={0}
        name={0}
        //  id={props.data[props.row.index].id}
        // name={props.data[props.row.index].id}
      />
    ),
  },
];

export default ManageClientsColumns;

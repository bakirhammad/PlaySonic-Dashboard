import { Column } from "react-table";
import {
  CustomCell,
  CustomHeaderCell,
  CustomSelectAll,
  CustomSelectionCell,
} from "@presentation/components/tables";
import { RolesActionCell } from "./RolesActionCell";
import { IRolesData } from "@domain/entities/general/Roles/Roles";
import { PermissionsCell } from "@presentation/helpers/cells/PermissionsCell";
import { RoleTypeCell } from "@presentation/helpers/cells/RoleTypeCell";

const RolesListColumns: ReadonlyArray<Column<IRolesData>> = [
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
        title="SIDEBAR-ROLE-ID"
        enableSorting={false}
        className="min-w-125px"
      />
    ),
    id: "id",
    Cell: ({ ...props }) => (
      <CustomCell data={props.data[props.row.index]?.id} />
    ),
  },
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
      return <CustomCell data={props.data[props.row.index]?.name} />;
    },
  },
  {
    Header: (props) => (
      <CustomHeaderCell
        tableProps={props}
        title="ROLE-TYPE"
        enableSorting={false}
        className="min-w-125px"
      />
    ),
    id: "type",
    Cell: ({ ...props }) => {
      return <RoleTypeCell type={props.data[props.row.index]?.type} />;
    },
  },
  {
    Header: (props) => (
      <CustomHeaderCell
        tableProps={props}
        title="ROLE-PERRMISSIONS"
        enableSorting={false}
        className="min-w-125px"
      />
    ),
    id: "permissions",
    Cell: ({ ...props }) => {
      return (
        <PermissionsCell
          permission={props.data[props.row.index]?.permissions}
        />
      );
    },
  },
  {
    Header: (props) => (
      <CustomHeaderCell
        tableProps={props}
        title="ACTION"
        className="min-w-100px"
      />
    ),
    id: "actions",
    Cell: ({ ...props }) => (
      <RolesActionCell id={props.data[props.row.index].id} />
    ),
  },
];

export { RolesListColumns };

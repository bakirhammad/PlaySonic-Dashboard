import { Column } from "react-table";
import {
  CustomCell,
  CustomHeaderCell,
  CustomSelectAll,
  CustomSelectionCell,
} from "@presentation/components/tables";
import { IAreaData } from "@domain/entities/general/area/Area";
import { AreaActionCell } from "./AreaActionCell";
import CityNameCell from "@presentation/helpers/cells/CityNameCell";

const AreaListColumns: ReadonlyArray<Column<IAreaData>> = [
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
        title="SIDEBAR-CLUB-ID"
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
        title="SIDEBAR-Area-NAME"
        enableSorting={false}
        className="min-w-125px"
      />
    ),
    id: "name",
    Cell: ({ ...props }) => (
      <CustomCell data={props.data[props.row.index]?.translations[0]?.name} />
    ),
  },
  {
    Header: (props) => (
      <CustomHeaderCell
        tableProps={props}
        title="SIDEBAR-CITYYNAME"
        enableSorting={false}
        className="min-w-125px"
      />
    ),
    id: "countryname",
    Cell: ({ ...props }) => (
      <CityNameCell cityId={props.data[props.row.index]?.cityId} />
    ),
  },
  {
    Header: (props) => (
      <CustomHeaderCell
        tableProps={props}
        title="SIDEBAR-CLUB-PAYLOAD"
        enableSorting={false}
        className="min-w-125px"
      />
    ),
    id: "payload",
    Cell: ({ ...props }) => (
      <CustomCell data={props.data[props.row.index]?.payload} />
    ),
  },
  {
    Header: (props) => (
      <CustomHeaderCell
        tableProps={props}
        title="SIDEBAR-COUNTRY-RANK"
        enableSorting={false}
        className="min-w-125px"
      />
    ),
    id: "rank",
    Cell: ({ ...props }) => (
      <CustomCell data={props.data[props.row.index]?.rank} />
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
      <AreaActionCell id={props.data[props.row.index].id} />
    ),
  },
];

export { AreaListColumns };

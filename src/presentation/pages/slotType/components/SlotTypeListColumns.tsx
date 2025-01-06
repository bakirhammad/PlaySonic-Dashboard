import { Column } from "react-table";
import {
  CustomCell,
  CustomHeaderCell,
  CustomSelectAll,
  CustomSelectionCell,
} from "@presentation/components/tables";
import { SlotTypeActionCell } from "./SlotTypeActionCell";
import { ISlotTypeData } from "@domain/entities/SlotType/SlotType";

const SlotTypeListColumns: ReadonlyArray<Column<ISlotTypeData>> = [
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
        title="Duration"
        enableSorting={false}
        className="min-w-125px"
      />
    ),
    id: "duration",
    Cell: ({ ...props }) => {
      return <CustomCell data={props.data[props.row.index]?.duration} />;
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
      <SlotTypeActionCell id={props.data[props.row.index].id} />
    ),
  },
];

export { SlotTypeListColumns };

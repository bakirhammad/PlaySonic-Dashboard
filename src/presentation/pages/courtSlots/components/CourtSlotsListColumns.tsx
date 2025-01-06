import { Column } from "react-table";
import {
  CustomCell,
  CustomHeaderCell,
  CustomSelectAll,
  CustomSelectionCell,
} from "@presentation/components/tables";
import { CourtSlotsActionCell } from "./CourtSlotsActionCell";
import { ICourtSlotsData } from "@domain/entities/CourtSlot/CourtSlot";
import CourtNameCell from "@presentation/helpers/cells/CourtNameCell";
import SlotTypeNameCell from "@presentation/helpers/cells/SlotTypeNameCell";

const CourtSlotsListColumns: ReadonlyArray<Column<ICourtSlotsData>> = [
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
        title="COURT-NAME"
        enableSorting={false}
        className="min-w-125px"
      />
    ),
    id: "courtId",
    Cell: ({ ...props }) => {
      return <CourtNameCell courtId={props.data[props.row.index]?.courtId} />;
    },
  },
  {
    Header: (props) => (
      <CustomHeaderCell
        tableProps={props}
        title="SLOT-TYPE-ID"
        enableSorting={false}
        className="min-w-125px"
      />
    ),
    id: "slottype",
    Cell: ({ ...props }) => {
      return (
        <SlotTypeNameCell
          slotTypeId={props.data[props.row.index]?.slotTypeId}
        />
      );
    },
  },
  {
    Header: (props) => (
      <CustomHeaderCell
        tableProps={props}
        title="FULL-PRICE"
        enableSorting={false}
        className="min-w-125px"
      />
    ),
    id: "fullprice",
    Cell: ({ ...props }) => {
      return <CustomCell data={props.data[props.row.index]?.fullPrice} />;
    },
  },
  {
    Header: (props) => (
      <CustomHeaderCell
        tableProps={props}
        title="SINGLE-PRICE"
        enableSorting={false}
        className="min-w-125px"
      />
    ),
    id: "singleprice",
    Cell: ({ ...props }) => {
      return <CustomCell data={props.data[props.row.index]?.singlePrice} />;
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
      <CourtSlotsActionCell id={props.data[props.row.index].id} />
    ),
  },
];

export { CourtSlotsListColumns };

import { Column } from "react-table";
import { ISightSeeingTourRateData } from "@domain/entities";
import {
  CustomCell,
  CustomHeaderCell,
  CustomSelectAll,
  CustomSelectionCell,
  CustomUTCDateCell,
} from "@presentation/components/tables";
import { SightSeeingTourRateCostCell } from "./SightSeeingTourRateCostCell";
import { CustomDescriptionCell } from "@presentation/components/tables/cells/CustomDescriptionCell";
import { MarketsCell } from "./MarketCell";

const SightSeeingTourRateListColumns: ReadonlyArray<
  Column<ISightSeeingTourRateData>
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
        title="SIGHT-SEEING-TOUR-RATE-NAME-COLUMN"
        enableSorting={false}
        className="min-w-125px "
      />
    ),
    id: "rateName",
    Cell: ({ row }) => (
      <CustomCell data={row.original?.translations[0]?.name} />
    ),
  },
  {
    Header: (props) => (
      <CustomHeaderCell
        tableProps={props}
        title="SIGHT-SEEING-TOUR-RATE-MARKET-NAME-COLUMN"
        enableSorting={false}
        className="min-w-125px"
      />
    ),
    id: "marketName",
    Cell: ({ row }) => <MarketsCell Markets={row.original?.marketResponses} />,
  },
  // {
  //   Header: (props) => (
  //     <CustomHeaderCell
  //       tableProps={props}
  //       title="SIGHT-SEEING-TOUR-RATE-CURRENCY-NAME-COLUMN"
  //       enableSorting={false}
  //       className="min-w-125px"
  //     />
  //   ),
  //   id: "currency",
  //   Cell: ({ row }) => <CustomCell data={row.original?.currencyName} />,
  // },
  {
    Header: (props) => (
      <CustomHeaderCell
        tableProps={props}
        title="SIGHT-SEEING-TOUR-RATE-DATE-FROM-NAME-COLUMN"
        enableSorting={false}
        className="min-w-125px"
      />
    ),
    id: "fromDate",
    Cell: ({ row }) => (
      <CustomUTCDateCell utcDate={row.original.fromDate} fullDate={true} />
    ),
  },
  {
    Header: (props) => (
      <CustomHeaderCell
        tableProps={props}
        title="SIGHT-SEEING-TOUR-RATE-DATE-TO-COLUMN"
        enableSorting={false}
        className="min-w-125px"
      />
    ),
    id: "toDate",
    Cell: ({ row }) => (
      <CustomUTCDateCell utcDate={row.original.toDate} fullDate={true} />
    ),
  },

  {
    Header: (props) => (
      <CustomHeaderCell
        tableProps={props}
        title="SIGHT-SEEING-TOUR-RATE-ADULT-COLUMN"
        enableSorting={false}
        className="min-w-125px"
      />
    ),
    id: "adultCost",
    Cell: ({ ...props }) => (
      <SightSeeingTourRateCostCell index={props.row.index} />
    ),
  },

  {
    Header: (props) => (
      <CustomHeaderCell
        tableProps={props}
        title="SIGHT-SEEING-TOUR-RATE-NOTE"
        enableSorting={false}
        className="min-w-125px"
      />
    ),
    id: "note",
    Cell: ({ row }) => (
      <CustomDescriptionCell data={row.original?.translations[0]?.note} />
    ),
  },
  {
    Header: (props) => (
      <CustomHeaderCell
        tableProps={props}
        title="CREATED-BY"
        className="min-w-125px"
        enableSorting={false}
      />
    ),
    id: "createdBy",
    Cell: ({ ...props }) => (
      <CustomCell data={props.data[props.row.index]?.createdByUserId} />
    ),
  },
  {
    Header: (props) => (
      <CustomHeaderCell
        tableProps={props}
        title="CREATED-ON"
        className="min-w-125px"
        enableSorting={false}
      />
    ),
    id: "createdOn",
    Cell: ({ ...props }) => (
      <CustomUTCDateCell
        utcDate={props.data[props.row.index]?.creationDateUtc}
        fullDate
      />
    ),
  },
  // {
  //   Header: (props) => (
  //     <CustomHeaderCell
  //       tableProps={props}
  //       title="ACTION"
  //       className=" min-w-100px"
  //     />
  //   ),
  //   id: "actions",
  //   Cell: ({ row }) => (
  //     <SightSeeingTourRateActionCell
  //       id={row.original.id}
  //       name={"Name :" + row.original.translations[0].name}
  //     />
  //   ),
  // },
];

export { SightSeeingTourRateListColumns };

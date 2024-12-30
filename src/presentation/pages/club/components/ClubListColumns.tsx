import { Column } from "react-table";
import {
  CustomCell,
  CustomHeaderCell,
  CustomImageCell,
  CustomSelectAll,
  CustomSelectionCell,
  CustomStatusCell,
} from "@presentation/components/tables";
import { SightSeeingTourActionCell } from "./CustomClubActionCell";
import DefaultImageCell from "@presentation/components/tables/cells/DefaultImageCell";
import { CustomDescriptionCell } from "@presentation/components/tables/cells/CustomDescriptionCell";
import { formatFromUtcToLocale } from "@presentation/helpers/DateFormater/formatDate";
import { IClubData } from "@domain/entities/Clubs/Clubs";

const ClubListColumns: ReadonlyArray<Column<IClubData>> = [
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
        title="SIGHT-SEEING-TOUR-NAME-COLUMN"
        enableSorting={false}
        className="min-w-125px"
      />
    ),
    id: "tourname",
    Cell: ({ ...props }) => (
      <CustomCell
        data={String(
          props.data[props.row.index]?.translationResponses
            ? props.data[props.row.index]?.translationResponses[0]?.name
            : "no name"
        )}
      />
    ),
  },
  {
    Header: (props) => (
      <CustomHeaderCell
        tableProps={props}
        title="SIDEBAR-SIGHTSEEING-CATEGORY"
        enableSorting={false}
        className="min-w-125px"
      />
    ),
    id: "categoryId",
    Cell: ({ ...props }) => (
      <CustomCell
        data={String(
          props.data[props.row.index]?.translationResponses
            ? props.data[props.row.index]?.translationResponses[0]?.name
            : "no name"
        )}
      />
    ),
  },
  {
    Header: (props) => (
      <CustomHeaderCell
        tableProps={props}
        title="SIGHTSEEING-TOUR-DESCRIPTION"
        enableSorting={false}
        className="min-w-125px"
      />
    ),
    id: "description",
    Cell: ({ ...props }) => (
      <CustomDescriptionCell
        data={
          props.data[props.row.index]?.translationResponses
            ? props.data[props.row.index]?.translationResponses[0]?.description
            : "no description"
        }
      />
    ),
  },
  {
    Header: (Props) => (
      <CustomHeaderCell
        tableProps={Props}
        title="SIGHTSEEING-TOUR-MAIN-IMAGE"
        className="min-w-125px"
        enableSorting={false}
      />
    ),
    id: "image",

    Cell: ({ ...props }) =>
      props.data[props.row.index]?.image ? (
        <CustomImageCell image={props.data[props.row.index]?.image} />
      ) : (
        <DefaultImageCell alt="sightseeing image" />
      ),
  },
  {
    Header: (props) => (
      <CustomHeaderCell
        tableProps={props}
        title="SIGHTSEEING-TOUR-DURATION"
        enableSorting={false}
        className="min-w-125px"
      />
    ),
    id: "tourDuration",
    Cell: ({ ...props }) => {
      const { durationDays, durationHours } = props.data[props.row.index];
      return (
        <CustomCell data={`${durationDays} Days ${durationHours} Hours`} />
      );
    },
  },
  {
    Header: (props) => (
      <CustomHeaderCell
        tableProps={props}
        title="SIGHT-SEEING-CATEGORY-PICK-UP-TIME-COLUMN"
        enableSorting={false}
        className="min-w-125px"
      />
    ),
    id: "pickUpTime",
    Cell: ({ ...props }) => (
      <CustomCell
        data={formatFromUtcToLocale(
          props.data[props.row.index]?.pickUpTime,
          "HH:mm"
        )}
      />
    ),
  },

  {
    Header: (props) => (
      <CustomHeaderCell
        tableProps={props}
        title="SIGHTSEEING-TOUR-MAX-NO-OF-SEATS"
        enableSorting={false}
        className="min-w-125px"
      />
    ),
    id: "maxNumberOfSeats",
    Cell: ({ ...props }) => (
      <CustomCell data={props.data[props.row.index]?.maxNumberOfSeats} />
    ),
  },

  {
    Header: (props) => (
      <CustomHeaderCell
        tableProps={props}
        title="SIGHTSEEING-TOUR-CLOSING-DATE"
        enableSorting={false}
        className="min-w-125px"
      />
    ),
    id: "closingDates",
    Cell: ({ ...props }) => (
      <CustomCell data={props.data[props.row.index]?.maxNumberOfSeats} />
    ),
  },
  {
    Header: (props) => (
      <CustomHeaderCell
        tableProps={props}
        title="SIGHTSEEING-TOUR-CLOSING-DAY"
        enableSorting={false}
        className="min-w-125px"
      />
    ),
    id: "closingDay",
    Cell: ({ ...props }) => (
      <CustomCell data={props.data[props.row.index]?.closingDay} />
    ),
  },
  {
    Header: (props) => (
      <CustomHeaderCell
        tableProps={props}
        title="SIGHTSEEING-TOUR-NOTE"
        enableSorting={false}
        className="min-w-125px"
      />
    ),
    id: "note",
    Cell: ({ ...props }) => (
      <CustomCell
        data={String(
          props.data[props.row.index]?.translationResponses
            ? props.data[props.row.index]?.translationResponses[0]?.note
            : "no note"
        )}
      />
    ),
  },
  {
    Header: (props) => (
      <CustomHeaderCell
        tableProps={props}
        title="STATUS"
        enableSorting={false}
        className="min-w-125px"
      />
    ),
    id: "status",
    Cell: ({ ...props }) => (
      <CustomStatusCell
        status={
          props.data[props.row.index]?.status == true
            ? "success"
            : props.data[props.row.index]?.status == false
            ? "danger"
            : "warning"
        }
        title={
          props.data[props.row.index]?.status == true
            ? "ACTIVE"
            : props.data[props.row.index]?.status == false
            ? "INACTIVE"
            : "INACTIVE"
        }
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
  //   Cell: ({ ...props }) => (
  //     <SightSeeingTourActionCell
  //       id={props.data[props.row.index].id}
  //       name={props.data[props.row.index]?.translationResponses[0]?.name}
  //     />
  //   ),
  // },
];

export { ClubListColumns };

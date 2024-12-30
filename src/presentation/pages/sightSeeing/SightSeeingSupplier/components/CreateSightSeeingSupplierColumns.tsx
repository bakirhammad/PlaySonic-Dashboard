import { Column } from "react-table";
import { ISightSeeingSupplierData } from "@domain/entities";
import {
  CustomCell,
  CustomHeaderCell,
  CustomSelectAll,
  CustomSelectionCell,
} from "@presentation/components/tables";
import { SightSeeingSupplierActionCell } from "./CustomSightSeeingSupplierActionCell";

const SightSeeingSupplierListColumns: ReadonlyArray<
  Column<ISightSeeingSupplierData>
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
        title="SIGHT-SEEING-SUPPLIER-NAME-COLUMN"
        enableSorting={false}
        className="min-w-125px"
      />
    ),
    id: "supplierName",
    Cell: ({ row }) => <CustomCell data={row.original.supplierName} />,
  },
  {
    Header: (props) => (
      <CustomHeaderCell
        tableProps={props}
        title="SIGHT-SEEING-SUPPLIER-TOUR-NAME-COLUMN"
        enableSorting={false}
        className="min-w-125px"
      />
    ),
    id: "tours",
    Cell: ({ row }) => (
      <div>
        {row.original.tours.map((tour, index: number) => (
          <div key={index} style={{ marginBottom: "8px" }}>
            <CustomCell data={tour.tourName} />
          </div>
        ))}
      </div>
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
    // Cell: ({ row }) => (
    //   <SightSeeingSupplierActionCell
    //     id={row.original.id}
    //     name={
    //       "Supplier Name :" +
    //       row.original.supplierName +
    //       "Tour Name :" +
    //       row.original.tourName
    //     }
    //   />
    // ),
    Cell: ({ row }) => (
      <div>
        {row.original.tours.map((tour, index: number) => (
          <div key={index} style={{ marginBottom: "8px" }}>
            <SightSeeingSupplierActionCell
              id={tour.id}
              name={
                "Supplier Name :" +
                row.original.supplierName +
                "Tour Name :" +
                tour.tourName
              }
            />
          </div>
        ))}
      </div>
    ),
  },
];

export { SightSeeingSupplierListColumns };

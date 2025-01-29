/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  CustomButton,
  CustomKTCard,
  CustomKTCardBody,
} from "@presentation/components";
import { QUERIES, stringifyRequestQuery } from "@presentation/helpers";
import { useQuery, useQueryClient } from "react-query";
import { Form, Formik } from "formik";
import { useState } from "react";
import PleaseWaitTxt from "@presentation/helpers/loading/PleaseWaitTxt";
import Calendar from "./components/Calendar";
import validationSchemas from "@presentation/helpers/validationSchemas";
import * as Yup from "yup";
import CustomSelectField from "@presentation/components/forms/CustomSelectField";
import { IDDlOption } from "@domain/entities";
import { ReservationQueryInstance } from "@app/useCases/reservation";
import { ReservationUrlEnum } from "@domain/enums/URL/Reservation/reservationUrls/Reservation";
import { useClubCourtsDDL } from "@presentation/hooks/queries/DDL/Court/useClubCourtsDDL";
import CustomTimePicker from "@presentation/components/forms/CustomTimePicker";

export default function MyReservations() {
  const [applyFilter, setApplyFilter] = useState(false);
  const [searchQuery, setSearchQuery] = useState<string>();
  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");
  const [courtId, setCourtId] = useState<any>();

  const clubId = 43;

  const {
    data: ReservationData,
    isLoading,
    isFetching,
  } = useQuery({
    queryKey: ["MyReservations", searchQuery],
    queryFn: () => {
      return ReservationQueryInstance.getReservationList(
        `${ReservationUrlEnum.GetReservationList}${searchQuery}`
      );
    },
    enabled: applyFilter,
  });

  const initialValues = {
    fromDate: "",
    toDate: "",
    court: null as IDDlOption | null,
  };

  const filterSchema = Yup.object().shape({
    // fromDate: validationSchemas.Date,
    // toDate: validationSchemas.Date.when("fromDate", {
    //   is: (fromDate: string) => fromDate !== null,
    //   then: (schema) =>
    //     schema.min(Yup.ref("fromDate"), "To Date can't be before From Date"),
    //   otherwise: (schema) => schema,
    // }),
    court: validationSchemas.object,
  });

  // return all non cancelled reservations.
  const filteredData = ReservationData?.data.filter((data) => {
    return data.status !== 16;
  });

  const handleSubmit = (values: typeof initialValues) => {
    const query = stringifyRequestQuery({
      filter: {
        courtId: values.court?.value,
      },
    });
    setSearchQuery(query);
    setApplyFilter(true);
    setStartTime(values.fromDate);
    setEndTime(values.toDate);
    setCourtId(values.court?.value);
  };
  const queryClient = useQueryClient();

  const { ClubCourtsOption, isClubCourtLoading } = useClubCourtsDDL(clubId);
  return (
    <CustomKTCard>
      <CustomKTCardBody>
        <Formik
          initialValues={initialValues}
          validationSchema={filterSchema}
          onSubmit={(values) => {
            handleSubmit(values);
          }}
        >
          {({ resetForm, values }) => (
            <Form>
              <div className="row row-cols-2 align-items-center flex-wrap  border border-2  p-2 rounded mb-5">
                <CustomTimePicker
                  label="From-Date"
                  name="fromDate"
                  placeholder="Select From Date"
                />
                <CustomTimePicker
                  label="To-Date"
                  name="toDate"
                  placeholder="SELECT_TO_DATE"
                  minDate={values.fromDate}
                />
                <CustomSelectField
                  name="court"
                  options={ClubCourtsOption}
                  isloading={isClubCourtLoading}
                  label="DDL-COURT-NAME"
                  placeholder="DDL-CHOOSE-COURT"
                />
                <div className="d-flex mb-2">
                  <CustomButton
                    type="reset"
                    text="RESET_FILTER"
                    onClick={() => {
                      resetForm();
                      setSearchQuery("");
                      setApplyFilter(false);
                      queryClient.removeQueries("MyReservations");
                    }}
                    className="btn btn-light btn-active-light-primary fw-bold me-2 px-6"
                    data-kt-user-table-filter="reset"
                    disabled={isLoading}
                  />
                  <CustomButton
                    type="submit"
                    text={"APPLY_FILTER"}
                    className="btn btn-primary"
                    data-kt-menu-dismiss="true"
                    data-kt-user-table-filter="filter"
                    disabled={isLoading}
                  />
                </div>
              </div>
            </Form>
          )}
        </Formik>
        {ReservationData?.data && !isLoading && !isFetching && (
          <Calendar
            ReservationData={filteredData || []}
            startTime={startTime}
            endTime={endTime}
            courtId={courtId}
          />
        )}

        {(isLoading || isFetching) && <PleaseWaitTxt />}
      </CustomKTCardBody>
    </CustomKTCard>
  );
}

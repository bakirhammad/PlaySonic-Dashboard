import {
  CustomButton,
  CustomKTCard,
  CustomKTCardBody,
} from "@presentation/components";
import { stringifyRequestQuery } from "@presentation/helpers";
import { SightSeeingTourRateQueryInstance } from "@app/index";
import { SightSeeingTourRateUrlEnum } from "@domain/enums";
import { useQuery, useQueryClient } from "react-query";
import { useParams } from "react-router-dom";
import Calendar from "./components/Calendar";
import { Form, Formik } from "formik";
import CustomTimePicker from "@presentation/components/forms/CustomTimePicker";
import { useState } from "react";
import PleaseWaitTxt from "@presentation/helpers/loading/PleaseWaitTxt";
import * as Yup from "yup";
import validationSchemas from "@presentation/helpers/validationSchemas";
export default function SightSeeingTourRateHistory() {
  const { sightSeeingSupplierId } = useParams();
  const [applyFilter, setApplyFilter] = useState(false);
  const [searchQuery, setSearchQuery] = useState<string>();
  const {
    data: SightSeeingTourRateData,
    isLoading,
    isFetching,
  } = useQuery({
    queryKey: [searchQuery, "SightSeeingTourRateListHistory"],
    queryFn: () => {
      const id = `SightSeeingSupplierId=${sightSeeingSupplierId}`;
      return SightSeeingTourRateQueryInstance.getSightSeeingTourRateList(
        `${
          SightSeeingTourRateUrlEnum.GetSightSeeingTourRateList +
          id +
          searchQuery
        }`
      );
    },
    enabled: applyFilter,
  });
  const initialValues = {
    fromDate: "",
    toDate: "",
  };

  const filterSchema = Yup.object().shape({
    fromDate: validationSchemas.Date,
    toDate: validationSchemas.Date.when("fromDate", {
      is: (fromDate: string) => fromDate !== null,
      then: (schema) =>
        schema.min(Yup.ref("fromDate"), "To Date can't be before From Date"),
      otherwise: (schema) => schema,
    }),
  });

  const handleSubmit = (values: typeof initialValues) => {
    const query = stringifyRequestQuery({
      filter: { FromDate: values.fromDate, ToDate: values.toDate },
    });
    setSearchQuery("&" + query);
    setApplyFilter(true);
  };
  const queryClient = useQueryClient();
  return (
    <CustomKTCard>
      <CustomKTCardBody>
        <Formik
          initialValues={initialValues}
          onSubmit={(values) => {
            handleSubmit(values);
          }}
          validationSchema={filterSchema}
        >
          {({ resetForm, values }) => (
            <Form placeholder={undefined}>
              <div className="d-flex align-items-center  gap-5  border border-2  p-3 rounded mb-5">
                <CustomTimePicker
                  label="From Date"
                  name="fromDate"
                  placeholder="Select From Date"
                  additionalClassName="flex-grow-1"
                />
                <CustomTimePicker
                  label="To Date"
                  name="toDate"
                  placeholder="SELECT_TO_DATE"
                  additionalClassName="flex-grow-1"
                  minDate={values.fromDate}
                />
                <div className="d-flex mb-2">
                  <CustomButton
                    type="reset"
                    text="RESET_FILTER"
                    onClick={() => {
                      resetForm();
                      setSearchQuery("");
                      setApplyFilter(false);
                      queryClient.removeQueries(
                        "SightSeeingTourRateListHistory"
                      );
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
        {SightSeeingTourRateData?.data && !isLoading && !isFetching && (
          <Calendar SightSeeingTourRateData={SightSeeingTourRateData?.data} />
        )}

        {(isLoading || isFetching) && <PleaseWaitTxt />}
      </CustomKTCardBody>
    </CustomKTCard>
  );
}

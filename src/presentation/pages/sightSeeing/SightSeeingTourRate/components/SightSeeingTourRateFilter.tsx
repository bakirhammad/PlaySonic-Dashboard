import { MenuComponent } from "@assets/ts/components";
import { CustomToast } from "@presentation/components";
import CustomSelectField from "@presentation/components/forms/CustomSelectField";
import CustomTimePicker from "@presentation/components/forms/CustomTimePicker";
import { useQueryRequest } from "@presentation/context";
import {
  CustomKTIcon,
  initialQueryState,
  WithChildren,
} from "@presentation/helpers";
import { useLocaleFormate } from "@presentation/hooks";
import { Formik, Form } from "formik";
import { FC, useEffect } from "react";
import * as Yup from "yup";

interface FilterProps {
  title?: string;
  fromDate?: string;
}

const SightSeeingTourRateFilter: FC<FilterProps & WithChildren> = ({
  children,
}) => {
  const { updateState, isLoading } = useQueryRequest();
  const initialValues = {
    market: { value: null, label: "" },
    fromDate: "",
    toDate: "",
    asc_des: false,
  };
  const handlError = (message: string, error: Error) => {
    console.error("Error Updating form:", error);

    CustomToast(message, "error");
  };

  
  useEffect(() => {
    MenuComponent.reinitialization();
  }, []);

  const validationSchema = Yup.object().shape({
    // fromDate: Yup.date(),
    // toDate: Yup.date().when("fromDate", {
    //   is: (fromDate: string) => fromDate !== null,
    //   then: (schema) =>
    //     schema.min(Yup.ref("fromDate"), "To Date can't be before From Date"),
    //   otherwise: (schema) => schema,
    // }),
    // asc_des: Yup.boolean(),
  });

  const resetData = () => {
    updateState({ filter: undefined, ...initialQueryState });
  };

  const filterData = (values: typeof initialValues) => {
    updateState({
      filter: {
        MarketId: values.market.value,
        fromDate: values.fromDate,
        toDate: values.toDate,
      },
      ...initialQueryState,
    });
  };

  const _resetFilter = useLocaleFormate("RESET_FILTER");
  const _applyFilter = useLocaleFormate("APPLY_FILTER");

  return (
    <>
      <button
        disabled={isLoading}
        type="button"
        className="btn btn-light-primary flex-grow-1"
        data-kt-menu-trigger="click"
        data-kt-menu-placement="bottom-end"
      >
        <CustomKTIcon iconName="filter" className="fs-2" />
        {useLocaleFormate("FILTER")}
      </button>
      <div
        className="menu menu-sub menu-sub-dropdown p-2 w-300px w-md-325px"
        data-kt-menu="true"
        data-kt-menu-dismiss="false"
      >
        <Formik
          initialValues={initialValues}
          validationSchema={validationSchema}
          onSubmit={(values, { setSubmitting }) => {
            filterData(values);
            setSubmitting(false);
          }}
        >
          {({
            errors,
            touched,
            isSubmitting,
            isValid,
            resetForm,
            handleReset,
          }) => (
            <>
              <Form
                placeholder={undefined}
                onPointerEnterCapture={undefined}
                onPointerLeaveCapture={undefined}
              >
                
                <div className="row mb-3">
                  <CustomTimePicker
                    name="fromDate"
                    label="From Date"
                    placeholder="Select From Date"
                    enableTime={true}
                    labelRequired={true}
                  />
                  <CustomTimePicker
                    name="toDate"
                    label="To Date"
                    placeholder="SELECT_TO_DATE"
                    enableTime={true}
                    labelRequired={true}
                  />
                </div>
                {children}
                <div className="d-flex justify-content-end">
                  <button
                    type="button"
                    disabled={isLoading}
                    onClick={() => {
                      handleReset();
                      resetData();
                      resetForm({ values: initialValues }); // Reset form with initial values
                    }}
                    className="btn btn-light btn-active-light-primary fw-bold me-2 px-6"
                    data-kt-menu-dismiss="true"
                    data-kt-user-table-filter="reset"
                  >
                    {_resetFilter}
                  </button>
                  <button
                    disabled={isLoading && !isValid}
                    type="submit"
                    className="btn btn-primary fw-bold px-6"
                    data-kt-menu-dismiss="true"
                    data-kt-user-table-filter="filter"
                  >
                    {_applyFilter}
                  </button>
                </div>
              </Form>
            </>
          )}
        </Formik>
      </div>
    </>
  );
};

export default SightSeeingTourRateFilter;

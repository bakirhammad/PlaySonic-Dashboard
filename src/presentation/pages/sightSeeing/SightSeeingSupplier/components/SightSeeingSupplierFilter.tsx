import { FC, useEffect } from "react";
import { WithChildren, initialQueryState } from "@presentation/helpers";
import { CustomKTIcon } from "@presentation/helpers";
import { useQueryRequest } from "@presentation/context";
import { MenuComponent } from "@assets/ts/components";
import {
  useLocaleFormate,
  useSightSeeingTourDDL,
} from "@presentation/hooks";
import { CustomToast } from "@presentation/components";
import CustomSelectField from "@presentation/components/forms/CustomSelectField";
import { Formik, Form } from "formik";
import * as Yup from "yup";
import { IDDlOption } from "@domain/entities";

const SightSeeingSupplierFilter: FC<WithChildren> = ({ children }) => {
  const { updateState, isLoading } = useQueryRequest();

  useEffect(() => {
    MenuComponent.reinitialization();
  }, []);

  const handleError = (message: string, error: Error) => {
    console.error("Error Updating form:", error);
    CustomToast(message, "error");
  };

  const resetData = () => {
    updateState({ filter: undefined, ...initialQueryState });
  };
 
  const { isSightSeeingTourListLoading, SightSeeingTourOptions } =
    useSightSeeingTourDDL({
      onError: (error: Error) => {
        handleError("Failed to get Sightseeing  Tour Data ", error);
      },
    });
  const filterData = (values: { supplier: IDDlOption; TourId: IDDlOption }) => {
    updateState({
      filter: {
        SupplierId: values.supplier?.value ?? null,
        TourId: values.TourId.value ?? null,
      },
      ...initialQueryState,
    });
  };

  const validationSchema = Yup.object().shape({});

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
      >
        <Formik
          initialValues={{
            TourId: { value: -1, label: "" },
            supplier: { value: -1, label: "" },
          }}
          validationSchema={validationSchema}
          onSubmit={(values, { setSubmitting }) => {
            filterData(values);
            setSubmitting(false);
          }}
        >
          {({ errors, touched, isSubmitting, resetForm }) => (
            <Form
              placeholder={undefined}
              onPointerEnterCapture={undefined}
              onPointerLeaveCapture={undefined}
            >
              {children}

              <div className="row py-2 px-2" data-kt-menu-dismiss="false">
              
                <CustomSelectField
                  name="TourId"
                  options={SightSeeingTourOptions}
                  isloading={isSightSeeingTourListLoading}
                  label="DDL-SIGHT-SEEING-TOUR"
                  placeholder="SELECT-DDL-SIGHT-SEEING-TOUR"
                  touched={touched}
                  errors={errors}
                  isSubmitting={isSubmitting}
                />
              </div>

              <div className="d-flex justify-content-end">
                <button
                  type="button"
                  disabled={isLoading}
                  onClick={() => {
                    console.log("rrr");

                    resetForm();
                    resetData();
                  }}
                  className="btn btn-light btn-active-light-primary fw-bold me-2 px-6"
                  data-kt-menu-dismiss="true"
                  data-kt-user-table-filter="reset"
                >
                  {_resetFilter}
                </button>
                <button
                  disabled={isLoading}
                  type="submit"
                  className="btn btn-primary fw-bold px-6"
                  data-kt-menu-dismiss="true"
                  data-kt-user-table-filter="filter"
                >
                  {_applyFilter}
                </button>
              </div>
            </Form>
          )}
        </Formik>
      </div>
    </>
  );
};

export { SightSeeingSupplierFilter };

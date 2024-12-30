import { FC, useEffect, useState } from "react";
import { WithChildren, initialQueryState } from "@presentation/helpers";
import { CustomKTIcon } from "@presentation/helpers";
import { useQueryRequest } from "@presentation/context";
import { MenuComponent } from "@assets/ts/components";
import {
  useLocaleFormate,
  useSightSeeingCategoryDDL,
} from "@presentation/hooks";
import { CustomToast } from "@presentation/components";
import CustomSelectField from "@presentation/components/forms/CustomSelectField";
import { Formik, Form } from "formik";
import * as Yup from "yup";
import CustomTimePicker from "@presentation/components/forms/CustomTimePicker";

interface FilterProps {
  title?: string;
  asc_des_label?: string;
  status?: boolean;
  asc_des?: boolean;
}

const SightSeeingTourFilter: FC<FilterProps & WithChildren> = ({
  status = true,
  children,
}) => {
  const { updateState, isLoading } = useQueryRequest();
  const [Status, setStatus] = useState<string | undefined>();

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
  const { isSightSeeingCategoryListLoading, SightSeeingCategoryOptions } =
    useSightSeeingCategoryDDL({
      onError: (error: Error) => {
        handleError("Failed to get Sightseeing Category data", error);
      },
    });

  const initialValues = {
    sightSeeingCategory: {
      value: null,
      label: "",
    },
    closingDate: "",
    asc_des: false,
  };

  const filterData = (values: typeof initialValues) => {
    updateState({
      filter: {
        IsActive:
          Status != "both"
            ? Status == "active"
              ? true
              : Status == "inactive"
              ? false
              : null
            : null,
        CategoryId: values.sightSeeingCategory.value,
        ClosingDate: values.closingDate.split("T")[0],
      },
      ...initialQueryState,
    });
  };

  const validationSchema = Yup.object().shape({
    asc_des: Yup.boolean(),
  });

  const _status = useLocaleFormate("STATUS");
  const _active = useLocaleFormate("ACTIVE");
  const _inActive = useLocaleFormate("IN_ACTIVE");
  const _both = useLocaleFormate("BOTH");
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
          initialValues={initialValues}
          validationSchema={validationSchema}
          onSubmit={(values, { setSubmitting }) => {
            filterData(values);
            setSubmitting(false);
          }}
        >
          {({ errors, touched, isSubmitting }) => (
            <Form
              placeholder={undefined}
              onPointerEnterCapture={undefined}
              onPointerLeaveCapture={undefined}
            >
              {children}

              {status && (
                <div className="mb-10">
                  <label className="form-label fs-6 fw-bold">{_status}</label>
                  <select
                    className="form-select form-select-solid fw-bolder"
                    data-kt-select2="true"
                    data-placeholder="Select option"
                    data-allow-clear="true"
                    data-kt-user-table-filter="two-step"
                    data-hide-search="true"
                    onChange={(e) => setStatus(e.target.value)}
                    value={Status}
                  >
                    <option value="">-----</option>
                    <option value="active">{_active}</option>
                    <option value="inactive">{_inActive}</option>
                    <option value="both">{_both}</option>
                  </select>
                </div>
              )}

              <div className="row py-2 px-2" data-kt-menu-dismiss="false">
                <CustomSelectField
                  name="sightSeeingCategory"
                  placeholder="DDL-SIGHT-SEEING-CATEGORY"
                  label="SELECT-DDL-SIGHT-SEEING-CATEGORY"
                  touched={touched}
                  errors={errors}
                  isloading={isSightSeeingCategoryListLoading}
                  isSubmitting={isSubmitting}
                  options={SightSeeingCategoryOptions}
                  labelRequired={false}
                />
              </div>

              <div className="row px-2" data-kt-menu-dismiss="false">
                <CustomTimePicker
                  name="closingDate"
                  label="CLOSING-DATE"
                  placeholder="CLOSING-DATE"
                  enableTime={false}
                  labelRequired={false}
                />
              </div>

              <div className="d-flex justify-content-end">
                <button
                  type="button"
                  disabled={isLoading}
                  onClick={resetData}
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

export { SightSeeingTourFilter };

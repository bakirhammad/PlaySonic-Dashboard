import { useEffect } from "react";
import { MenuComponent } from "@assets/ts/components";
import { CustomKTIcon, initialQueryState } from "@presentation/helpers";
import { useQueryRequest } from "@presentation/context";
import * as Yup from "yup";
import { useLocaleFormate } from "@presentation/hooks";
import {
  Form,
  Formik,
  FormikContextType,
  FormikValues,
  useFormikContext,
} from "formik";
import { CustomButton } from "@presentation/components";
import moment from "moment";
import CustomSelectField from "@presentation/components/forms/CustomSelectField";
import { useCitiesDDL } from "@presentation/hooks/queries/DDL/GeneralDDL/useCitiesDDL";
import { useAreasDDL } from "@presentation/hooks/queries/DDL/GeneralDDL/useAreasDDL";

interface IReservationFilter {
  cityId: { value: number; label: string } | null;
  areaId: { value: number; label: string } | null;
}
const validationSchema = Yup.object().shape({
  // reservationDate: Yup.date(),
});

const ClubFilter = () => {
  const { updateState } = useQueryRequest();

  const initialValues: IReservationFilter = {
    cityId: null,
    areaId: null,
  };

  useEffect(() => {
    MenuComponent.reinitialization();
  }, []);

  const filterData = (values: typeof initialValues) => {
    updateState({
      filter: {
        cityId: values.cityId?.value,
        areaId: values.areaId?.value,
      },
      ...initialQueryState,
    });
  };

  return (
    <Formik
      initialValues={initialValues}
      validationSchema={validationSchema}
      onSubmit={(values, { setSubmitting }) => {
        filterData(values);
        setSubmitting(false);
      }}
    >
      <ClubFilterWrapper />
    </Formik>
  );
};
const ClubFilterWrapper = () => {
  const { setFieldValue, resetForm, values }: FormikContextType<FormikValues> =
    useFormikContext();
  const { updateState, isLoading } = useQueryRequest();

  const resetData = (resetForm: () => void) => {
    updateState({ filter: undefined, ...initialQueryState });
    resetForm();
  };
  useEffect(() => {
    if (values.reservationDate) {
      setFieldValue(
        "reservationDate",
        moment(values.reservationDate).format("YYYY-MM-DD")
      );
    }
  }, [values.reservationDate, setFieldValue]);

  const { CityOption, isCityLoading } = useCitiesDDL();
  const { AreaOption, isAreaLoading } = useAreasDDL();
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
        className="menu menu-sub menu-sub-dropdown p-6 w-300px w-md-350px"
        data-kt-menu="true"
      >
        <>
          <Form
            placeholder={undefined}
            onPointerEnterCapture={undefined}
            onPointerLeaveCapture={undefined}
          >
            <div className="row row-cols-1">
              <CustomSelectField
                name="cityId"
                options={CityOption}
                isloading={isCityLoading}
                label="DDL-CITY"
                placeholder="DDL-SELECT-CITY"
                labelRequired={false}
              />
              <CustomSelectField
                name="areaId"
                options={AreaOption}
                isloading={isAreaLoading}
                label="DDL-AREA"
                labelRequired={false}
                placeholder="DDL-SELECT-AREA"
              />
            </div>
            <div className="row row-cols-2"></div>
            {/* <CustomCheckbox
              labelTxt="Include_Return"
              labelRequired={false}
              name="includeReturn"
              touched={touched}
              errors={errors}
            /> */}
            <div className="d-flex justify-content-end">
              <CustomButton
                type="reset"
                text="RESET_FILTER"
                onClick={() => resetData(resetForm)}
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
          </Form>
        </>
      </div>
    </>
  );
};
export default ClubFilter;

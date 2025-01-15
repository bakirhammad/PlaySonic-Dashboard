import { useEffect } from "react";
import * as Yup from "yup";
import { MenuComponent } from "@assets/ts/components";
import { CustomKTIcon, initialQueryState } from "@presentation/helpers";
import { useQueryRequest } from "@presentation/context";
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
import { useClubsDDL } from "@presentation/hooks/queries/DDL/Club/useClubsDDL";

interface IClibFilter {
  clubId: { value: number; label: string } | null;
}

const validationSchema = Yup.object().shape({
  // clubId: Yup.number(),
});

const CourtFilter = () => {
  const { updateState } = useQueryRequest();

  const initialValues: IClibFilter = {
    clubId: null,
  };

  useEffect(() => {
    MenuComponent.reinitialization();
  }, []);

  const filterData = (values: typeof initialValues) => {
    updateState({
      filter: {
        clubId: values.clubId?.value,
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
      <DailyFlightsFilterWrapper />
    </Formik>
  );
};
const DailyFlightsFilterWrapper = () => {
  const {
    errors,
    touched,
    setFieldValue,
    resetForm,
    values,
  }: FormikContextType<FormikValues> = useFormikContext();
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

  const { isClubLoading, clubsOption } = useClubsDDL();

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
        className="menu menu-sub menu-sub-dropdown p-6 w-300px w-md-400px"
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
                name="clubId"
                options={clubsOption}
                isloading={isClubLoading}
                label="DDL-CLUB-NAME"
                placeholder="DDL-CLUB-NAME"
                touched={touched}
                errors={errors}
              />
            </div>
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
export default CourtFilter;

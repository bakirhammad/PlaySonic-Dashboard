import { useRef } from "react";
import {
  CustomButton,
  CustomListLoading,
  CustomToast,
} from "@presentation/components";
import { useListView } from "@presentation/context";
import {
  Form,
  Formik,
  FormikProps,
  useFormikContext,
  FormikValues,
  FormikContextType,
} from "formik";
import * as Yup from "yup";
import { useQueryClient } from "react-query";
import { combineBits, QUERIES } from "@presentation/helpers";
import CustomSelectField from "@presentation/components/forms/CustomSelectField";
import { CourtScheduleCommandInstance } from "@app/useCases/courtSchedule";
import { CourtScheduleUrlEnum } from "@domain/enums/URL/CourtSchedule/CourtScheduleUrls/CourtSchedule";
import {
  DaysOptionsDDL,
  IDaysOptionsDDL,
} from "@presentation/helpers/DDL/DaysOptions";
import CustomTimePicker from "@presentation/components/forms/CustomTimePicker";
import validationSchemas from "@presentation/helpers/validationSchemas";
import { useClubsDDL } from "@presentation/hooks/queries/DDL/Club/useClubsDDL";
import { useClubCourtsDDL } from "@presentation/hooks/queries/DDL/Court/useClubCourtsDDL";

export const CourtScheduleModalCreateForm = () => {
  const formikRef = useRef<FormikProps<FormikValues> | null>(null);
  const { setItemIdForUpdate } = useListView();
  const queryClient = useQueryClient();

  const initialValues = Object.assign({
    clubId: null,
    courtId: null,
    days: 0,
    startTime: "",
    endTime: "",
  });

  const _CourtScheduleSchema = Object.assign({
    courtId: validationSchemas.object,
    startTime: Yup.string().required("Start Time is Required"),
    days: validationSchemas.array,
    endTime: Yup.string().required("End Time is Required"),
  });

  const CourtScheduleSchema = Yup.object().shape(_CourtScheduleSchema);

  const handleSubmit = async (
    values: FormikValues,
    setSubmitting: (isSubmitting: boolean) => void
  ) => {
    const days = combineBits(
      values.days.map((day: IDaysOptionsDDL) => day.value)
    );

    const formData = new FormData();
    formData.append("CourtId", values.courtId.value);
    formData.append("Days", String(days));
    formData.append("StartTime", values.startTime);
    formData.append("EndTime", values.endTime);

    try {
      const data = await CourtScheduleCommandInstance.createCourtSchedule(
        CourtScheduleUrlEnum.CreateCourtSchedule,
        formData
      );
      if (data) {
        CustomToast("CourtSchedule is created successfully", "success", {
          autoClose: 3000,
        });
        setItemIdForUpdate(undefined);
        queryClient.invalidateQueries({
          queryKey: [QUERIES.CourtScheduleList],
        });
      }
    } catch (error) {
      if (error instanceof Error) {
        CustomToast(error.message, "error", { autoClose: 6000 });
        console.error("Error Create form:", error);
      }
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Formik
      innerRef={formikRef}
      initialValues={initialValues}
      validationSchema={CourtScheduleSchema}
      onSubmit={(values, { setSubmitting }) => {
        handleSubmit(values, setSubmitting);
      }}
    >
      <CourtScheduleForm />
    </Formik>
  );
};

const CourtScheduleForm = () => {
  const {
    errors,
    touched,
    isSubmitting,
    isValid,
    values,
  }: FormikContextType<FormikValues> = useFormikContext();

  const { setItemIdForUpdate } = useListView();
  const { clubsOption, isClubLoading } = useClubsDDL();
  const { ClubCourtsOption, isClubCourtLoading } = useClubCourtsDDL(
    values.clubId ? values.clubId.value : 0
  );

  return (
    <>
      <Form
        className="form container-fluid w-100"
        placeholder={undefined}
        onPointerEnterCapture={undefined}
        onPointerLeaveCapture={undefined}
      >
        <div className="row row-cols-md-1 row-cols-sm-1 row-cols-1">
          <div className="row">
            <div className="row row-cols-2">
              <CustomSelectField
                name="clubId"
                options={clubsOption}
                isloading={isClubLoading}
                label="DDL-CLUB-MANE"
                placeholder="DDL-CLUB-MANE"
                touched={touched}
                errors={errors}
              />
              <CustomSelectField
                name="courtId"
               options={ ClubCourtsOption}
                isloading={isClubCourtLoading}
                label="DDL-COURT-MANE"
                placeholder="DDL-COURT-MANE"
                touched={touched}
                errors={errors}
                disabled={values.clubId ? false : true}
              />
            </div>
            <div className="row row-cols-2">
              <CustomTimePicker
                name="startTime"
                label="Start-Time"
                placeholder="Start-Time"
                Mode="time"
              />
              <CustomTimePicker
                name="endTime"
                label="End-Time"
                placeholder="End-Time"
                Mode="time"
              />
            </div>
            <div className="row row-cols-2">
              <CustomSelectField
                name="days"
                placeholder="DDL-DAYS"
                label="SELECT-DAYS"
                touched={touched}
                errors={errors}
                isSubmitting={isSubmitting}
                options={DaysOptionsDDL}
                isMulti={true}
              />
            </div>
          </div>
        </div>
        <div className="text-center pt-15">
          <CustomButton
            type="reset"
            text="CANCEL"
            onClick={() => setItemIdForUpdate(undefined)}
            className="btn btn-light me-3"
            disabled={isSubmitting}
          />
          <CustomButton
            type="submit"
            className="btn btn-primary"
            disabled={isSubmitting || !isValid}
            text={isSubmitting ? "PLEASE_WAIT" : "SUBMIT"}
          />
        </div>
        {isSubmitting && <CustomListLoading />}
      </Form>
    </>
  );
};

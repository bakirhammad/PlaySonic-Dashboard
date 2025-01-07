import { useMemo, useRef } from "react";
import {
  CustomButton,
  CustomListLoading,
  CustomToast,
} from "@presentation/components";
import { useListView } from "@presentation/context";
import {
  Form,
  Formik,
  FormikContextType,
  FormikProps,
  FormikValues,
  useFormikContext,
} from "formik";
import * as Yup from "yup";
import { combineBits, QUERIES } from "@presentation/helpers";
import { useQueryClient } from "react-query";
import PleaseWaitTxt from "@presentation/helpers/loading/PleaseWaitTxt";
import { useLanguageStore } from "@infrastructure/storage/LanguageStore";
import validationSchemas from "@presentation/helpers/validationSchemas";
import CustomSelectField from "@presentation/components/forms/CustomSelectField";
import { ICourtScheduleData } from "@domain/entities/CourtSchedule/CourtSchedule";
import { CourtScheduleCommandInstance } from "@app/useCases/courtSchedule";
import { CourtScheduleUrlEnum } from "@domain/enums/URL/CourtSchedule/CourtScheduleUrls/CourtSchedule";
import {
  DaysOptionsDDL,
  IDaysOptionsDDL,
} from "@presentation/helpers/DDL/DaysOptions";
import { useCourtsDDL } from "@presentation/hooks/queries/DDL/Court/useCourtsDDL";
import CustomTimePicker from "@presentation/components/forms/CustomTimePicker";

interface IProps {
  CourtScheduleData: ICourtScheduleData;
  isLoading: boolean;
}

export const UpdateCourtScheduleModalForm = ({
  CourtScheduleData,
  isLoading,
}: IProps) => {
  const formikRef = useRef<FormikProps<FormikValues> | null>(null);
  const { setItemIdForUpdate } = useListView();
  const queryClient = useQueryClient();
  const { Languages } = useLanguageStore();

  const initialValues = useMemo(() => {
    return {
      id: CourtScheduleData.id,
      courtId: CourtScheduleData.courtId,
      days: CourtScheduleData.days,
      startTime: CourtScheduleData.startTime,
      endTime: CourtScheduleData.endTime,
    };
  }, [CourtScheduleData]);

  const _CourtScheduleSchema = Object.assign({
    days: validationSchemas.message,
    courtId: validationSchemas.object,
    startTime: Yup.string().required("Start Time is Required"),
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
    formData.append("Id", String(initialValues.id));
    formData.append("CourtId", values.courtId.value);
    formData.append("Days", String(days));
    formData.append("StartTime", values.startTime);
    formData.append("EndTime", values.endTime);

    try {
      const data = await CourtScheduleCommandInstance.updateCourtSchedule(
        CourtScheduleUrlEnum.UpdateCourtSchedule,
        formData
      );
      if (data) {
        CustomToast("Court Schedule updated successfully", "success", {
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
        console.error("Error submitting form:", error);
      }
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <>
      {isLoading ? (
        <PleaseWaitTxt />
      ) : (
        <Formik
          innerRef={formikRef}
          initialValues={initialValues}
          initialTouched={Languages.reduce<{ [key: string]: boolean }>(
            (acc, lang) => {
              if (lang.id !== 2) acc[`name${lang.id}`] = true;
              return acc;
            },
            {}
          )}
          validationSchema={CourtScheduleSchema}
          onSubmit={(values, { setSubmitting }) => {
            handleSubmit(values, setSubmitting);
          }}
        >
          <CourtScheduleUpdateForm />
        </Formik>
      )}
    </>
  );
};

const CourtScheduleUpdateForm = () => {
  const { setItemIdForUpdate } = useListView();

  const {
    errors,
    touched,
    isSubmitting,
    isValid,
    values,
  }: FormikContextType<FormikValues> = useFormikContext();
  console.log("values", values);

  const { CourtsOption, isCourtLoading } = useCourtsDDL();

  console.log("values", values);

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
                name="courtId"
                options={CourtsOption}
                isloading={isCourtLoading}
                label="DDL-COURT-MANE"
                placeholder="DDL-COURT-MANE"
                touched={touched}
                errors={errors}
              />
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

export default UpdateCourtScheduleModalForm;

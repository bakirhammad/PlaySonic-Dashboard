import { useRef } from "react";
import {
  CustomButton,
  CustomInputField,
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
import { QUERIES } from "@presentation/helpers";
import { ReservationCommandInstance } from "@app/useCases/reservation";
import { ReservationUrlEnum } from "@domain/enums/URL/Reservation/reservationUrls/Reservation";
import CustomTimePicker from "@presentation/components/forms/CustomTimePicker";
import CustomSelectField from "@presentation/components/forms/CustomSelectField";
import { GenderOptionsDDL } from "@presentation/helpers/DDL/GenderOptions";

export const CreateNewUser = () => {
  const formikRef = useRef<FormikProps<FormikValues> | null>(null);
  const { setItemIdForUpdate } = useListView();
  const queryClient = useQueryClient();

  const initialValues = Object.assign({
    name: "",
    phoneNumber: null,
  });

  const _ReservationSchema = Object.assign({
    name: Yup.string().required("Required"),
    phoneNumber: Yup.string().required("Required"),
  });

  const ReservationSchema = Yup.object().shape(_ReservationSchema);

  const handleSubmit = async (
    values: FormikValues,
    setSubmitting: (isSubmitting: boolean) => void
  ) => {
    const formData = new FormData();
    formData.append("CourtId", values.courtId);
    formData.append("SlotTypeId", values.slotTypeId.value);

    try {
      const data = await ReservationCommandInstance.createReservation(
        ReservationUrlEnum.CreateReservation,
        formData
      );
      if (data) {
        CustomToast("Reservation is created successfully", "success", {
          autoClose: 3000,
        });

        // To open popup of new playsonicID  <<<<
        setItemIdForUpdate(undefined);
        queryClient.invalidateQueries({
          queryKey: [QUERIES.ReservationList],
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
      validationSchema={ReservationSchema}
      onSubmit={(values, { setSubmitting }) => {
        handleSubmit(values, setSubmitting);
      }}
    >
      <ReservationForm />
    </Formik>
  );
};
const ReservationForm = () => {
  const { isSubmitting, isValid }: FormikContextType<FormikValues> =
    useFormikContext();

  const { setItemIdForUpdate } = useListView();
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
            <div className="row row-cols-1 row-cols-md-2  border-info-subtle border-black">
              <CustomInputField
                name="firstName"
                placeholder="Firts-Name"
                label="Firts-Name"
                as="input"
              />
              <CustomInputField
                name="lastName"
                placeholder="Last-Name"
                label="Last-Name"
                as="input"
              />
            </div>
            <div className="row row-cols-1 row-cols-md-2  border-info-subtle border-black">
              <CustomInputField
                name="displayName"
                placeholder="User-DISPLAY-NAME"
                label="User-DISPLAY-NAME"
                as="input"
              />
              <CustomInputField
                name="phoneNumber"
                placeholder="USER-PHONE"
                label="USER-PHONE"
                as="input"
              />
            </div>
            <div className="row row-cols-1 row-cols-md-2  border-info-subtle border-black">
              <CustomTimePicker
                label="Bith-Date"
                name="bod"
                placeholder="Bith-Date"
              />
              <CustomInputField
                name="userLevel"
                placeholder="Level"
                label="Level"
                as="input"
                type="number"
              />
            </div>
            <CustomSelectField
              name="Gender"
              options={GenderOptionsDDL}
              label="DDL-GENDER"
              placeholder="DDL-GENDER"
            />
          </div>
        </div>
        <div className="text-center pt-15">
          {/* <CustomButton
            type="reset"
            text="CANCEL"
            onClick={() => setItemIdForUpdate(undefined)}
            className="btn btn-light me-3"
            disabled={isSubmitting}
          /> */}
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

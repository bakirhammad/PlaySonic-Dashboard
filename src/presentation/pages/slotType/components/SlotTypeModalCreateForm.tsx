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
import { SlotTypeCommandInstance } from "@app/useCases/slotType";
import { SlotTypeUrlEnum } from "@domain/enums/URL/SlotType/SlotTyeUrls/SlotType";

export const SlotTypeModalCreateForm = () => {
  const formikRef = useRef<FormikProps<FormikValues> | null>(null);
  const { setItemIdForUpdate } = useListView();
  const queryClient = useQueryClient();

  const initialValues = Object.assign({
    duration: null,
  });

  const _SlotTypeSchema = Object.assign({
    duration: Yup.number().required("Start Time is Required"),
  });

  const SlotTypeSchema = Yup.object().shape(_SlotTypeSchema);

  const handleSubmit = async (
    values: FormikValues,
    setSubmitting: (isSubmitting: boolean) => void
  ) => {
    const formData = new FormData();
    formData.append("Duration", values.duration);

    try {
      const data = await SlotTypeCommandInstance.createSlotType(
        SlotTypeUrlEnum.CreateSlotType,
        formData
      );
      if (data) {
        CustomToast("Slot is created successfully", "success", {
          autoClose: 3000,
        });
        setItemIdForUpdate(undefined);
        queryClient.invalidateQueries({
          queryKey: [QUERIES.SlotTypeList],
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
      validationSchema={SlotTypeSchema}
      onSubmit={(values, { setSubmitting }) => {
        handleSubmit(values, setSubmitting);
      }}
    >
      <SlotTypeForm />
    </Formik>
  );
};

const SlotTypeForm = () => {
  const {
    errors,
    touched,
    isSubmitting,
    isValid,
  }: FormikContextType<FormikValues> = useFormikContext();

  const { setItemIdForUpdate } = useListView();

  return (
    <>
      <Form
        className="form container-fluid w-100"
        placeholder={undefined}
        onPointerEnterCapture={undefined}
        onPointerLeaveCapture={undefined}
      >
        <div className="tw-flex tw-justify-center tw-w-full">
          <div className="tw-w-96 max-w-sm">
            <CustomInputField
              name="duration"
              placeholder="Duration"
              label="Duration"
              as="input"
              touched={touched}
              errors={errors}
              type="number"
              isSubmitting={isSubmitting}
            />
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

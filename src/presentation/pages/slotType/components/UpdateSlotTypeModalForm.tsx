import { useMemo, useRef } from "react";
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
  FormikContextType,
  FormikProps,
  FormikValues,
  useFormikContext,
} from "formik";
import * as Yup from "yup";
import { QUERIES } from "@presentation/helpers";
import { useQueryClient } from "react-query";
import PleaseWaitTxt from "@presentation/helpers/loading/PleaseWaitTxt";
import { ISlotTypeData } from "@domain/entities/SlotType/SlotType";
import { SlotTypeCommandInstance } from "@app/useCases/slotType";
import { SlotTypeUrlEnum } from "@domain/enums/URL/SlotType/SlotTyeUrls/SlotType";

interface IProps {
  SlotTypeData: ISlotTypeData;
  isLoading: boolean;
}

export const UpdateSlotTypeModalForm = ({
  SlotTypeData,
  isLoading,
}: IProps) => {
  const formikRef = useRef<FormikProps<FormikValues> | null>(null);
  const { setItemIdForUpdate } = useListView();
  const queryClient = useQueryClient();

  const initialValues = useMemo(() => {
    return {
      id: SlotTypeData.id,
      duration: SlotTypeData.duration,
    };
  }, [SlotTypeData]);

  const _SlotTypeSchema = Object.assign({
    duration: Yup.number().required("Start Time is Required"),
  });

  const SlotTypeSchema = Yup.object().shape(_SlotTypeSchema);
  const handleSubmit = async (
    values: FormikValues,
    setSubmitting: (isSubmitting: boolean) => void
  ) => {
    const formData = new FormData();
    formData.append("Id", String(initialValues.id));
    formData.append("Duration", values.duration);

    try {
      const data = await SlotTypeCommandInstance.updateSlotType(
        SlotTypeUrlEnum.UpdateSlotType,
        formData
      );
      if (data) {
        CustomToast("Slot updated successfully", "success", {
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
          validationSchema={SlotTypeSchema}
          onSubmit={(values, { setSubmitting }) => {
            handleSubmit(values, setSubmitting);
          }}
        >
          <SlotTypeUpdateForm />
        </Formik>
      )}
    </>
  );
};

const SlotTypeUpdateForm = () => {
  const { setItemIdForUpdate } = useListView();

  const {
    errors,
    touched,
    isSubmitting,
    isValid,
  }: FormikContextType<FormikValues> = useFormikContext();

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

export default UpdateSlotTypeModalForm;

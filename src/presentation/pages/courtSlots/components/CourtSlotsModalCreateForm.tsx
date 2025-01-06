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
import { CourtSlotsCommandInstance } from "@app/useCases/courtSlot";
import { CourtSlotsUrlEnum } from "@domain/enums/URL/courtSlots/courtSlotsUrls/CourtSlots";
import CustomSelectField from "@presentation/components/forms/CustomSelectField";
import { useCourtsDDL } from "@presentation/hooks/queries/DDL/Court/useCourtsDDL";
import { useSlotTypesDDL } from "@presentation/hooks/queries/DDL/SlotTypes/useSlotTypesDDL";
import validationSchemas from "@presentation/helpers/validationSchemas";

export const CourtSlotsModalCreateForm = () => {
  const formikRef = useRef<FormikProps<FormikValues> | null>(null);
  const { setItemIdForUpdate } = useListView();
  const queryClient = useQueryClient();

  const initialValues = Object.assign({
    courtId: null,
    slotTypeId: null,
    fullPrice: null,
    singlePrice: null,
  });

  const _CourtSlotsSchema = Object.assign({
    courtId: validationSchemas.object,
    slotTypeId: validationSchemas.object,
    fullPrice: Yup.number().required("Field is Required"),
    singlePrice: Yup.number().required("Field is Required"),
  });

  const CourtSlotsSchema = Yup.object().shape(_CourtSlotsSchema);

  const handleSubmit = async (
    values: FormikValues,
    setSubmitting: (isSubmitting: boolean) => void
  ) => {
    const formData = new FormData();
    formData.append("CourtId", values.courtId.value);
    formData.append("SlotTypeId", values.slotTypeId.value);
    formData.append("FullPrice", values.fullPrice);
    formData.append("SinglePrice", values.singlePrice);

    try {
      const data = await CourtSlotsCommandInstance.createCourtSlots(
        CourtSlotsUrlEnum.CreateCourtSlots,
        formData
      );
      if (data) {
        CustomToast("Created successfully", "success", {
          autoClose: 3000,
        });
        setItemIdForUpdate(undefined);
        queryClient.invalidateQueries({
          queryKey: [QUERIES.CourtSlotsList],
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
      validationSchema={CourtSlotsSchema}
      onSubmit={(values, { setSubmitting }) => {
        handleSubmit(values, setSubmitting);
      }}
    >
      <CourtSlotsForm />
    </Formik>
  );
};

const CourtSlotsForm = () => {
  const {
    errors,
    touched,
    isSubmitting,
    isValid,
    values,
  }: FormikContextType<FormikValues> = useFormikContext();

  const { setItemIdForUpdate } = useListView();
  console.log("ddd", values);
  const { CourtsOption, isCourtLoading } = useCourtsDDL();
  const { SlotTypesOption, isSlotTypesLoading } = useSlotTypesDDL();
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
                name="slotTypeId"
                options={SlotTypesOption}
                isloading={isSlotTypesLoading}
                label="DDL-SLOT-TYPE"
                placeholder="DDL-SLOT-TYPE"
                touched={touched}
                errors={errors}
              />
            </div>
            <div className="row row-cols-2">
              <CustomInputField
                name="fullPrice"
                placeholder="FULL-PRICE"
                label="FULL-PRICE"
                as="input"
                touched={touched}
                errors={errors}
                type="number"
                isSubmitting={isSubmitting}
              />
              <CustomInputField
                name="singlePrice"
                placeholder="SINGLE-PRICE"
                label="SINGLE-PRICE"
                as="input"
                touched={touched}
                errors={errors}
                type="number"
                isSubmitting={isSubmitting}
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

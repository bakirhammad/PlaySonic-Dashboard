import { useEffect, useMemo, useRef } from "react";
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
import { ICourtSlotsData } from "@domain/entities/CourtSlot/CourtSlot";
import { CourtSlotsCommandInstance } from "@app/useCases/courtSlot";
import { CourtSlotsUrlEnum } from "@domain/enums/URL/courtSlots/courtSlotsUrls/CourtSlots";
import CustomSelectField from "@presentation/components/forms/CustomSelectField";
import { useCourtsDDL } from "@presentation/hooks/queries/DDL/Court/useCourtsDDL";
import { useSlotTypesDDL } from "@presentation/hooks/queries/DDL/SlotTypes/useSlotTypesDDL";
import validationSchemas from "@presentation/helpers/validationSchemas";
import { useClubsDDL } from "@presentation/hooks/queries/DDL/Club/useClubsDDL";
import { useClubCourtsDDL } from "@presentation/hooks/queries/DDL/Court/useClubCourtsDDL";

interface IProps {
  CourtSlotsData: ICourtSlotsData;
  isLoading: boolean;
}

export const UpdateCourtSlotsModalForm = ({
  CourtSlotsData,
  isLoading,
}: IProps) => {
  const formikRef = useRef<FormikProps<FormikValues> | null>(null);
  const { setItemIdForUpdate } = useListView();
  const queryClient = useQueryClient();

  const initialValues = useMemo(() => {
    return {
      id: CourtSlotsData.id,
      clubId: 18,
      courtId: CourtSlotsData.courtId,
      slotTypeId: CourtSlotsData.slotTypeId,
      fullPrice: CourtSlotsData.fullPrice,
      singlePrice: CourtSlotsData.singlePrice,
    };
  }, [CourtSlotsData]);

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
    formData.append("Id", String(initialValues.id));
    formData.append("CourtId", values.courtId.value);
    formData.append("SlotTypeId", values.slotTypeId.value);
    formData.append("FullPrice", values.fullPrice);
    formData.append("SinglePrice", values.singlePrice);
    try {
      const data = await CourtSlotsCommandInstance.updateCourtSlots(
        CourtSlotsUrlEnum.UpdateCourtSlots,
        formData
      );
      if (data) {
        CustomToast("Slot updated successfully", "success", {
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
          validationSchema={CourtSlotsSchema}
          onSubmit={(values, { setSubmitting }) => {
            handleSubmit(values, setSubmitting);
          }}
        >
          <CourtSlotsUpdateForm />
        </Formik>
      )}
    </>
  );
};

const CourtSlotsUpdateForm = () => {
  const { setItemIdForUpdate } = useListView();

  const {
    errors,
    touched,
    isSubmitting,
    isValid,
    values,
    setFieldValue,
  }: FormikContextType<FormikValues> = useFormikContext();

  const { CourtsOption } = useCourtsDDL();
  const { SlotTypesOption, isSlotTypesLoading } = useSlotTypesDDL();
  const { clubsOption, isClubLoading } = useClubsDDL();
  const { ClubCourtsOption, isClubCourtLoading } = useClubCourtsDDL(
    values.clubId.value
  );
  useEffect(() => {
    clubsOption.forEach((elem) => {
      if (elem.value === values.clubId) {
        return setFieldValue("clubId", {
          value: elem.value,
          label: elem.label,
        });
      }
    });
    CourtsOption.forEach((elem) => {
      if (elem.value === values.courtId) {
        return setFieldValue("courtId", {
          value: elem.value,
          label: elem.label,
        });
      }
    });

    SlotTypesOption.forEach((elem) => {
      if (elem.value === values.slotTypeId) {
        return setFieldValue("slotTypeId", {
          value: elem.value,
          label: elem.label,
        });
      }
    });
  }, [CourtsOption, SlotTypesOption, clubsOption]);
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
                options={ClubCourtsOption}
                isloading={isClubCourtLoading}
                label="DDL-COURT-MANE"
                placeholder="DDL-COURT-MANE"
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
            <div className="row row-cols-2">
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

export default UpdateCourtSlotsModalForm;

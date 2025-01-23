import { useEffect, useMemo, useRef } from "react";
import {
  CustomButton,
  CustomCheckbox,
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
import { useLanguageStore } from "@infrastructure/storage/LanguageStore";
import validationSchemas from "@presentation/helpers/validationSchemas";
import CustomSelectField from "@presentation/components/forms/CustomSelectField";
import { ICourtData } from "@domain/entities/Court/Court";
import { CourtCommandInstance } from "@app/useCases/court";
import { CourtUrlEnum } from "@domain/enums/URL/Court/CourtUrls/Court";
import { useClubsDDL } from "@presentation/hooks/queries/DDL/Club/useClubsDDL";
import { useSlotTypesDDL } from "@presentation/hooks/queries/DDL/SlotTypes/useSlotTypesDDL";
interface IProps {
  CourtData: ICourtData;
  isLoading: boolean;
}
export const UpdateCourtModalForm = ({ CourtData, isLoading }: IProps) => {
  const formikRef = useRef<FormikProps<FormikValues> | null>(null);
  const { setItemIdForUpdate } = useListView();
  const queryClient = useQueryClient();
  const { Languages } = useLanguageStore();

  const initialValues = useMemo(() => {
    return {
      id: CourtData.id,
      club: CourtData.clubId,
      rank: CourtData.rank,
      payload: CourtData.payload,
      indoor: CourtData.indoor,
      courtTypeId: CourtData.courtTypeId,
      name: CourtData.name,
      systemTypeId: CourtData.systemTypeId,
      allowedSlotTypes: CourtData.allowedSlotTypes,
      sportId: CourtData.sportId,
    };
  }, [CourtData]);

  const _CourtSchema = Object.assign({
    club: validationSchemas.object,
    rank: validationSchemas.number,
    allowedSlotTypes: validationSchemas.object,
    systemTypeId: validationSchemas.number,
    sportId: validationSchemas.number,
    courtTypeId: validationSchemas.number,
    payload: Yup.string().required("Payload is required"),
    name: Yup.string().required("Name is required"),
  });

  const CourtSchema = Yup.object().shape(_CourtSchema);
  const handleSubmit = async (
    values: FormikValues,
    setSubmitting: (isSubmitting: boolean) => void
  ) => {
    const formData = new FormData();

    formData.append("Id", String(initialValues.id));
    formData.append("ClubId", values.club.value);
    formData.append("Rank", values.rank);
    formData.append("Indoor", values.indoor);
    formData.append("CourtTypeId", values.courtTypeId);
    formData.append("Name", values.name);
    formData.append("SystemTypeId", values.systemTypeId);
    formData.append("Payload", values.payload);
    formData.append("AllowedSlotTypes", values.allowedSlotTypes.value);
    formData.append("SportId", values.sportId);

    try {
      const data = await CourtCommandInstance.updateCourt(
        CourtUrlEnum.UpdateCourt,
        formData
      );
      if (data) {
        CustomToast("Court updated successfully", "success", {
          autoClose: 3000,
        });
        setItemIdForUpdate(undefined);
        queryClient.invalidateQueries({
          queryKey: [QUERIES.CourtList],
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
          validationSchema={CourtSchema}
          onSubmit={(values, { setSubmitting }) => {
            handleSubmit(values, setSubmitting);
          }}
        >
          <CourtUpdateForm />
        </Formik>
      )}
    </>
  );
};

const CourtUpdateForm = () => {
  const { setItemIdForUpdate } = useListView();

  const {
    errors,
    touched,
    isSubmitting,
    isValid,
    values,
    setFieldValue,
  }: FormikContextType<FormikValues> = useFormikContext();
  const { isClubLoading, clubsOption } = useClubsDDL();
  const { SlotTypesOption, isSlotTypesLoading } = useSlotTypesDDL();

  useEffect(() => {
    clubsOption.forEach((elem) => {
      if (elem.value === values.club) {
        return setFieldValue("club", { value: elem.value, label: elem.label });
      }
    });

    SlotTypesOption.forEach((elem) => {
      if (elem.value === values.allowedSlotTypes) {
        return setFieldValue("allowedSlotTypes", {
          value: elem.value,
          label: elem.label,
        });
      }
    });
  }, [clubsOption ,SlotTypesOption]);
  console.log(values)

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
            <div className="row row-cols-2 1 row-cols-md-2">
              <CustomInputField
                name="name"
                placeholder="COURT-MANE"
                label="COURT-MANE"
                as="input"
                touched={touched}
                errors={errors}
                type="text"
                isSubmitting={isSubmitting}
              />
              <CustomSelectField
                name="club"
                options={clubsOption}
                isloading={isClubLoading}
                label="DDL-CLUB-NAME"
                placeholder="DDL-CLUB-NAME"
                touched={touched}
                errors={errors}
              />
            </div>
            <div className="row  row-cols-1 row-cols-md-2 border-info-subtle border-black">
              <CustomSelectField
                name="allowedSlotTypes"
                options={SlotTypesOption}
                isloading={isSlotTypesLoading}
                label="COURT-ALLOWED-SLOT-TYPES"
                placeholder="COURT-ALLOWED-SLOT-TYPES"
                touched={touched}
                errors={errors}
              />
                   <CustomInputField
                name="rank"
                placeholder="COURT-RANK"
                label="COURT-RANK"
                as="input"
                touched={touched}
                errors={errors}
                type="number"
                min={1}
                isSubmitting={isSubmitting}
              />
              {/* <CustomInputField
                name="payload"
                placeholder="COURT-PAYLOAD"
                label="COURT-PAYLOAD"
                as="input"
                touched={touched}
                errors={errors}
                type="text"
                isSubmitting={isSubmitting}
              /> */}
            </div>

            {/* <div className="row  row-cols-1 row-cols-md-2 border-info-subtle border-black">
              <CustomInputField
                name="courtTypeId"
                placeholder="COURT-TYPE-ID"
                label="COURT-TYPE-ID"
                as="input"
                touched={touched}
                errors={errors}
                type="number"
                isSubmitting={isSubmitting}
              />
              <CustomInputField
                name="systemTypeId"
                placeholder="COURT-SYSTEM-TYPE-ID"
                label="COURT-SYSTEM-TYPE-ID"
                as="input"
                touched={touched}
                errors={errors}
                type="number"
                isSubmitting={isSubmitting}
              />
            </div>
            <div className="row  row-cols-1 row-cols-md-2 border-info-subtle border-black">
         
              <CustomInputField
                name="sportId"
                placeholder="COURT-SPORT-ID"
                label="COURT-SPORT-ID"
                as="input"
                touched={touched}
                errors={errors}
                type="number"
                isSubmitting={isSubmitting}
              />
            </div> */}
            <div>
              <CustomCheckbox
                labelTxt="COURT-INDOOR"
                name={"indoor"}
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

export default UpdateCourtModalForm;

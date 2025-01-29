import { useRef } from "react";
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
  FormikProps,
  useFormikContext,
  FormikValues,
  FormikContextType,
} from "formik";
import * as Yup from "yup";
import { useQueryClient } from "react-query";
import { combineBits, QUERIES } from "@presentation/helpers";
import CustomSelectField from "@presentation/components/forms/CustomSelectField";
import validationSchemas from "@presentation/helpers/validationSchemas";
import { CourtCommandInstance } from "@app/useCases/court";
import { CourtUrlEnum } from "@domain/enums/URL/Court/CourtUrls/Court";
import { useClubsDDL } from "@presentation/hooks/queries/DDL/Club/useClubsDDL";
import { useSlotTypesDDL } from "@presentation/hooks/queries/DDL/SlotTypes/useSlotTypesDDL";
import { IDDlOptionSlotType } from "@domain/entities";
import { CustomUploadFile } from "@presentation/components/forms/CustomUploadFile";

export const CourtModalCreateForm = () => {
  const formikRef = useRef<FormikProps<FormikValues> | null>(null);
  const { setItemIdForUpdate } = useListView();
  const queryClient = useQueryClient();

  const initialValues = Object.assign({
    club: 0,
    rank: 1,
    payload: "New Court",
    indoor: false,
    courtTypeId: 1,
    name: "",
    systemTypeId: 1,
    allowedSlotTypes: null,
    sportId: 1,
    image: null,
  });

  const _CourtSchema = Object.assign({
    club: validationSchemas.object,
    allowedSlotTypes: validationSchemas.array.required("Required"),
    // systemTypeId: validationSchemas.number,
    // sportId: validationSchemas.number,
    // courtTypeId: validationSchemas.number,
    // payload: Yup.string().required("Payload is required"),
    name: Yup.string().required("Name is required"),
  });

  const CourtSchema = Yup.object().shape(_CourtSchema);

  const handleSubmit = async (
    values: FormikValues,
    setSubmitting: (isSubmitting: boolean) => void
  ) => {
    const allowedSlots = combineBits(
      values.allowedSlotTypes.map((slot: IDDlOptionSlotType) => slot.value)
    );

    const formData = new FormData();
    formData.append("ClubId", values.club.value);
    formData.append("Rank", values.rank);
    formData.append("Indoor", values.indoor);
    formData.append("CourtTypeId", values.courtTypeId);
    formData.append("Name", values.name);
    formData.append("SystemTypeId", values.systemTypeId);
    formData.append("Payload", values.payload);
    formData.append("AllowedSlotTypes", String(allowedSlots));
    formData.append("SportId", values.sportId);
     formData.append("Img", values.image);

    try {
      const data = await CourtCommandInstance.createCourt(
        CourtUrlEnum.CreateCourt,
        formData
      );
      if (data) {
        CustomToast("Court is created successfully", "success", {
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
      validationSchema={CourtSchema}
      onSubmit={(values, { setSubmitting }) => {
        handleSubmit(values, setSubmitting);
      }}
    >
      <CourtForm />
    </Formik>
  );
};

const CourtForm = () => {
  const {
    errors,
    touched,
    isSubmitting,
    isValid,values,
  }: 
  FormikContextType<FormikValues> = useFormikContext();

  const { setItemIdForUpdate } = useListView();
  const { isClubLoading, clubsOption } = useClubsDDL();
  const { SlotTypesOption, isSlotTypesLoading } = useSlotTypesDDL();

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
                isMulti={true}
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
            </div> */}
            {/* <div className="row  row-cols-1 row-cols-md-2 border-info-subtle border-black">
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
            <div className="row row-cols-1 row-cols-md-2 border-info-subtle border-black">
               <CustomUploadFile
                isSubmitting={isSubmitting}
                touched={touched}
                errors={errors}
                accept="image/*"
                name="image"
                label="COURT-IMAGE"
              /> 
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

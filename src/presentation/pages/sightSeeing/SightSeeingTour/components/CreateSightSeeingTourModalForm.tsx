import { Fragment, useRef, useState } from "react";
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
import { SightSeeingTourCommandInstance } from "@app/index";
import { useQueryClient } from "react-query";
import { combineBits, QUERIES } from "@presentation/helpers";

import { SightSeeingTourUrlEnum } from "@domain/enums";
import { useLanguageStore } from "@infrastructure/storage/LanguageStore";
import clsx from "clsx";
import CustomEditor from "@presentation/components/forms/CustomEditor";
import {
  daysDDLOption,
  hoursDDlOption,
  mintsDDlOption,
  useLocaleFormate,
  useSightSeeingCategoryDDL,
} from "@presentation/hooks";
import CustomSelectField from "@presentation/components/forms/CustomSelectField";
import validationSchemas from "@presentation/helpers/validationSchemas";
import { CustomUploadFile } from "@presentation/components/forms/CustomUploadFile";
import CustomTimePicker from "@presentation/components/forms/CustomTimePicker";

import { formatToUtc } from "@presentation/helpers/DateFormater/formatDate";
import { useCountriesDDL } from "@presentation/hooks/queries/DDL/GeneralDDL";

export const CreateSightSeeingTourModalForm = () => {
  const formikRef = useRef<FormikProps<FormikValues> | null>(null);
  const { setItemIdForUpdate } = useListView();
  const queryClient = useQueryClient();
  const { Languages } = useLanguageStore();

  const initialValues = Object.assign(
    {
      sightSeeingCategory: null,
      Status: false,
      city: null,
      country: null,
      days: "",
      DurationDays: "",
      DurationHours: "",
      DurationMinutes: "",
      Images: "",
      Image: "",
      MaxNumberOfSeats: "",
      PickUpTime: "",
      ClosingDates: "",
    },
    ...Languages.map((lang) => ({
      [`name${lang?.id}`]: "",
      [`description${lang?.id}`]: "",
      [`note${lang?.id}`]: "",
    }))
  );

  const _SightSeeingTourSchema = Object.assign(
    {
      sightSeeingCategory: validationSchemas.object,
      DurationMinutes: validationSchemas.object,
      DurationHours: validationSchemas.object,
      DurationDays: validationSchemas.object,
      country: validationSchemas.object,
      city: validationSchemas.object,
      ClosingDates: validationSchemas.array,
      days: validationSchemas.array,
      PickUpTime: Yup.string().required("PickUp Time is Required"),
      MaxNumberOfSeats: validationSchemas.number,
      name2: Yup.string().required("Sightseeing Tour Name is required"),
    },
    ...Languages.map((lang) => {
      return lang.id === 2
        ? {
            [`name${lang?.id}`]: Yup.string().required(
              "This field is required"
            ),
          }
        : {
            [`name${lang?.id}`]: Yup.string().when(
              [`description${lang.id}`, `note${lang.id}`],
              {
                is: (descriptionVal: string, noteVal: string) =>
                  (descriptionVal && descriptionVal.trim() !== "") ||
                  (noteVal && noteVal.trim() !== ""),
                then: (schema) => schema.required("This field is required"),
                otherwise: (schema) => schema,
              }
            ),
          };
    })
  );

  const SightSeeingTourSchema = Yup.object().shape(_SightSeeingTourSchema);

  const handleSubmit = async (
    values: FormikValues,
    setSubmitting: (isSubmitting: boolean) => void
  ) => {
    const days = combineBits(values.days);

    const formData = new FormData();
    formData.append("CategoryId", values.sightSeeingCategory.value);
    formData.append("CountryId", values.country.value);
    formData.append("CityId", values.city.value);
    formData.append("DurationMinutes", values.DurationMinutes.value);
    formData.append("DurationHours", values.DurationHours.value);
    formData.append("DurationDays", values.DurationDays.value);
    formData.append("PickUpTime", formatToUtc(values.PickUpTime, "HH:mm"));
    formData.append("Status", values.Status);
    values?.Image && formData.append("Image", values?.Image);
    values.Images &&
      values.Images?.map((img: string) => {
        formData.append("Images", img);
      });

    formData.append("MaxNumberOfSeats", values.MaxNumberOfSeats);
    formData.append("ClosingDay", String(days));
    values.ClosingDates.map((ClosingDate: string, i: number) => {
      formData.append(
        `ClosingDates[${i}].closingDate`,
        formatToUtc(ClosingDate)
      );
    });

    ///
    let index = 0;
    Languages.forEach((lang) => {
      if (values[`name${lang?.id}`]) {
        formData.append(`Translations[${index}].langId`, lang.id.toString());
        formData.append(
          `Translations[${index}].name`,
          values[`name${lang?.id}`]
        );
        formData.append(
          `Translations[${index}].description`,
          values[`description${lang?.id}`]
        );
        formData.append(
          `Translations[${index}].note`,
          values[`note${lang?.id}`]
        );

        index++;
      }
    });

    try {
      const data = await SightSeeingTourCommandInstance.createSightSeeingTour(
        SightSeeingTourUrlEnum.CreateSightSeeingTour,
        formData
      );
      if (data) {
        CustomToast("Sightseeing Tour created successfully", "success", {
          autoClose: 3000,
        });
        setItemIdForUpdate(undefined);
        queryClient.invalidateQueries({
          queryKey: [QUERIES.SightSeeingTourList],
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
      validationSchema={SightSeeingTourSchema}
      onSubmit={(values, { setSubmitting }) => {
        handleSubmit(values, setSubmitting);
      }}
    >
      <SightSeeingTourForm />
    </Formik>
  );
};

const SightSeeingTourForm = () => {
  const {
    errors,
    touched,
    isSubmitting,
    isValid,
    setFieldValue,
    values,
    setFieldError,
  }: FormikContextType<FormikValues> = useFormikContext();

  const { setItemIdForUpdate } = useListView();

  const { Languages } = useLanguageStore();
  const [languageInput, setLanguageInput] = useState(2);

  const handleError = (message: string, error: Error, field: string) => {
    console.error("Error Fetching data:", error);
    setFieldError(field, message);
    setFieldValue(field, null);
    CustomToast(message, "error");
  };

  const { isSightSeeingCategoryListLoading, SightSeeingCategoryOptions } =
    useSightSeeingCategoryDDL({
      onError: (error: Error) => {
        handleError(
          "Failed to get Sightseeing Category data",
          error,
          "sightSeeingCategory"
        );
      },
    });
  const { CountriesOption, IsCountryLoading } = useCountriesDDL();

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
            <div className="translation">
              <div className="d-flex mb-7">
                {Languages.map((lang, index) => (
                  <button
                    type="button"
                    key={lang.prefix + lang.id + index}
                    className={clsx("btn btn-light me-3", {
                      "btn-primary": languageInput === lang.id,
                    })}
                    onClick={() => setLanguageInput(lang.id)}
                  >
                    {lang.name}
                  </button>
                ))}
              </div>
              {Languages.map(
                (lang) =>
                  lang.id === languageInput && (
                    <Fragment key={lang.id + lang.id + "input+"}>
                      <div className="row row-cols-md-2 row-cols-sm-1 row-cols-1">
                        <CustomInputField
                          key={
                            lang.prefix +
                            lang.id +
                            lang.direction +
                            "input name"
                          }
                          name={`name${lang?.id}`}
                          label="SIGHT-SEEING-TOUR-NAME-FIELD-LABEL"
                          placeholder="SIGHT-SEEING-NAME-TIME-FIELD-PLACEHOLDER"
                          as="input"
                          touched={touched}
                          errors={errors}
                          isSubmitting={isSubmitting}
                          labelRequired={languageInput === 2 ? true : false}
                        />
                        <CustomInputField
                          key={lang.prefix + lang.id + "input address"}
                          name={`note${lang?.id}`}
                          label="SIGHT-SEEING-TOUR-NOTE-FIELD-LABEL"
                          placeholder="SIGHT-SEEING-NOTE-TIME-FIELD-PLACEHOLDER"
                          as="input"
                          touched={touched}
                          labelRequired={languageInput === 2 ? true : false}
                          errors={errors}
                          isSubmitting={isSubmitting}
                        />
                      </div>
                      <CustomEditor
                        key={lang.prefix + lang.id + "editor"}
                        name={`description${lang?.id}`}
                        labelRequired={languageInput === 2 ? true : false}
                        label={
                          "CREATE-HOTEL-MODAL_HOTEL-INFO-DESCRIPTION-LABEL"
                        }
                      />
                    </Fragment>
                  )
              )}
            </div>
            <div>
              <div className="row row-cols-2">
                <CustomSelectField
                  name="country"
                  options={CountriesOption}
                  labelRequired={false}
                  isloading={IsCountryLoading}
                  label="DDL-COUNTRY_LABEL"
                  placeholder="DDL-COUNTRY_LABEL"
                  touched={touched}
                  errors={errors}
                />
                {/* <CustomSelectField
                  name="city"
                  labelRequired={false}
                  options={citiesOption}
                  isloading={isCitiesLoading}
                  label="DDL-CITY_LABEL"
                  placeholder="DDL-CITY_LABEL"
                  touched={touched}
                  disabled={!citiesOption.length}
                  errors={errors}
                /> */}
              </div>
              <hr />
              <h2 className="text-info mb-5">
                {useLocaleFormate("TOUR-DURATION")}
              </h2>
              <div className="row row-cols-md-3 border-info-subtle border-black">
                <CustomSelectField
                  name="DurationDays"
                  placeholder="DDL-DAYS"
                  label="SELECT-DDL-DAYS"
                  touched={touched}
                  errors={errors}
                  isSubmitting={isSubmitting}
                  options={daysDDLOption}
                />
                <CustomSelectField
                  name="DurationHours"
                  placeholder="DDL-HOURS"
                  label="SELECT-DDL-HOURS"
                  touched={touched}
                  errors={errors}
                  isSubmitting={isSubmitting}
                  options={hoursDDlOption}
                />
                <CustomSelectField
                  name="DurationMinutes"
                  placeholder="DDL-MINUTS"
                  label="SELECT-DDL-MINUTS"
                  touched={touched}
                  errors={errors}
                  isSubmitting={isSubmitting}
                  options={mintsDDlOption}
                />
              </div>
            </div>

            <div className="row row-cols-3">
              <CustomSelectField
                name="sightSeeingCategory"
                label="DDL-SIGHT-SEEING-CATEGORY"
                placeholder="SELECT-DDL-SIGHT-SEEING-CATEGORY"
                touched={touched}
                errors={errors}
                isloading={isSightSeeingCategoryListLoading}
                isSubmitting={isSubmitting}
                options={SightSeeingCategoryOptions}
              />
              <CustomTimePicker
                name={"PickUpTime"}
                label="SIGHT-SEEING-TOUR-PICKUP-TIME-FIELD-LABEL"
                placeholder="SIGHT-SEEING-TOUR-PICKUP-TIME-FIELD-PLACEHOLDER"
                touched={touched}
                Mode="time"
                errors={errors}
              />
              <CustomInputField
                name="MaxNumberOfSeats"
                placeholder="SIGHT-SEEING-TOUR-MAX_NUMBER_OF_SEATS-FIELD-PLACEHOLDER"
                label="SIGHT-SEEING-TOUR-MAX_NUMBER_OF_SEATS-FIELD-LABEL"
                as="input"
                touched={touched}
                errors={errors}
                type="number"
                isSubmitting={isSubmitting}
              />
              <div className="d-flex align-items-center ">
                <CustomCheckbox
                  name={"Status"}
                  touched={touched}
                  errors={errors}
                  labelTxt="SIGHT-SEEING-TOUR-STATUS-FIELD"
                />
              </div>
            </div>

            <div className="row">
              <div className="col-md-6">
                <CustomUploadFile
                  isSubmitting={isSubmitting}
                  touched={touched}
                  errors={errors}
                  accept="image/*"
                  name="Image"
                  label="SIGHT-SEEING-TOUR-IMAGE-FIELD"
                />
              </div>
              <div className="col-md-6">
                <CustomUploadFile
                  isSubmitting={isSubmitting}
                  multiple={true}
                  touched={touched}
                  errors={errors}
                  accept="image/*"
                  name="Images"
                  labelRequired={false}
                  label="SIGHT-SEEING-TOUR-IMAGES-FIELD"
                />
              </div>
            </div>
            <div className="row my-6">
              <hr />
              <h2 className="text-info mb-5">
                {useLocaleFormate("CLOSING-DAYS")}
              </h2>
            </div>
            <div className="col-md-12">
              <CustomTimePicker
                name={"ClosingDates"}
                Mode="multiple"
                placeholder="SIGHT-SEEING-TOUR-Closing_Dates-FIELD-PLACEHOLDER"
                label="SIGHT-SEEING-TOUR-Closing_Dates-FIELD-LABEL"
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

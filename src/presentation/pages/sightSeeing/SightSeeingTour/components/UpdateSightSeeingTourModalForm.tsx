import { Fragment, useEffect, useMemo, useRef, useState } from "react";
import {
  CustomButton,
  CustomCheckbox,
  CustomInputField,
  CustomListLoading,
  CustomToast,
  showAreYouSure,
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
import {
  combineBits,
  compareAndUpdate,
  QUERIES,
} from "@presentation/helpers";
import { useQueryClient } from "react-query";
import {
  IDDlOption,
  ISightSeeingTourData,
  ISightSeeingTourTranslation,
} from "@domain/entities";
import { SightSeeingTourCommandInstance } from "@app/index";
import PleaseWaitTxt from "@presentation/helpers/loading/PleaseWaitTxt";
import { SightSeeingTourUrlEnum } from "@domain/enums";
import { useLanguageStore } from "@infrastructure/storage/LanguageStore";

import clsx from "clsx";
import validationSchemas from "@presentation/helpers/validationSchemas";
import CustomEditor from "@presentation/components/forms/CustomEditor";
import CustomSelectField from "@presentation/components/forms/CustomSelectField";
import CustomTimePicker from "@presentation/components/forms/CustomTimePicker";
import { CustomUploadFile } from "@presentation/components/forms/CustomUploadFile";
import {
  useLocaleFormate,
  daysDDLOption,
  hoursDDlOption,
  mintsDDlOption,
  useSightSeeingCategoryDDL,
} from "@presentation/hooks";
import { CustomImageReviewForUpdate } from "@presentation/components/forms/CustomImageReviewForUpdate";
import {
  formatFromUtcToLocale,
  formatToUtc,
} from "@presentation/helpers/DateFormater/formatDate";
import { useCountriesDDL } from "@presentation/hooks/queries/DDL/GeneralDDL";

interface IProps {
  SightSeeingTourData: ISightSeeingTourData;
  isLoading: boolean;
}

export const UpdateSightSeeingTourModalForm = ({
  SightSeeingTourData,
  isLoading,
}: IProps) => {
  const formikRef = useRef<FormikProps<FormikValues> | null>(null);
  const { setItemIdForUpdate } = useListView();
  const queryClient = useQueryClient();
  const { Languages } = useLanguageStore();
 
  const initialValues = useMemo(() => {
    const translations = Languages.reduce<{ [key: string]: string }>(
      (acc, lang) => {
        acc[`name${lang.id}`] = "";
        acc[`description${lang.id}`] = "";
        acc[`note${lang.id}`] = "";
        return acc;
      },
      {}
    );
    SightSeeingTourData.translationResponses.forEach((lang) => {
      translations[`name${lang.langId}`] = lang.name;
      translations[`description${lang.langId}`] = lang.description;
      translations[`note${lang.langId}`] = lang.note;
    });

    return {
      id: SightSeeingTourData.id,
      sightSeeingCategory: null,
      Status: SightSeeingTourData.status,
      DurationDays: {
        label: SightSeeingTourData?.durationDays,
        value: SightSeeingTourData?.durationDays,
      },
      DurationHours: {
        label: SightSeeingTourData?.durationHours,
        value: SightSeeingTourData?.durationHours,
      },
      DurationMinutes: {
        label: SightSeeingTourData?.durationMinutes,
        value: SightSeeingTourData?.durationMinutes,
      },
      ClosingDates: SightSeeingTourData.closingDates.map((e) => {
        return formatFromUtcToLocale(e.closingDate);
      }),
      ClosingDatesClone: SightSeeingTourData.closingDates,
      Images: SightSeeingTourData.images,
      Image: SightSeeingTourData.image,
      city: SightSeeingTourData?.cityId,
      country: SightSeeingTourData?.countryId,
      MaxNumberOfSeats: SightSeeingTourData.maxNumberOfSeats,
      PickUpTime: formatFromUtcToLocale(
        SightSeeingTourData.pickUpTime,
        "HH:mm"
      ),
      ...translations,
    };
  }, [SightSeeingTourData, Languages]);

  const _SightSeeingTourSchema = Object.assign(
    {
      sightSeeingCategory: validationSchemas.object,
      DurationMinutes: validationSchemas.object,
      ClosingDates: validationSchemas.array,
      country: validationSchemas.object,
      city: validationSchemas.object,
      DurationHours: validationSchemas.object,
      DurationDays: validationSchemas.object,
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

    formData.append("id", String(initialValues.id));
    formData.append("CategoryId", values.sightSeeingCategory.value);
    formData.append("DurationMinutes", values.DurationMinutes.value);
    formData.append("DurationHours", values.DurationHours.value);
    formData.append("DurationDays", values.DurationDays.value);
    formData.append("PickUpTime", formatToUtc(values.PickUpTime, "HH:mm"));
    formData.append("CountryId", values.country.value);
    formData.append("CityId", values.city.value);
    formData.append("Status", values.Status);
    formData.append("Image", values.Image);
    if (Array.isArray(values.Images)) {
      values.Images.forEach((img: string) => {
        formData.append("Images", img);
      });
    }

    formData.append("MaxNumberOfSeats", values.MaxNumberOfSeats);
    formData.append("ClosingDay", String(days));
    const NewClosingDates = compareAndUpdate(
      initialValues.ClosingDatesClone,
      values.ClosingDates
    );

    NewClosingDates.map(
      (
        ClosingDate: {
          id: number;
          tourId: number;
          closingDate: string;
          isDeleted: boolean;
        },
        i: number
      ) => {
        formData.append(`ClosingDates[${i}].id`, String(ClosingDate.id || 0));
        // formData.append(
        //   `ClosingDates[${i}].closingDate`,
        //   ClosingDate?.closingDate
        //     ? formatToUtc(ClosingDate?.closingDate)
        //     : formatToUtc(ClosingDate)
        // );
        formData.append(`ClosingDates[${i}].tourId`, String(initialValues.id));
        formData.append(
          `ClosingDates[${i}].isDeleted`,
          String(ClosingDate?.closingDate ? ClosingDate?.isDeleted : "false")
        );
      }
    );
    const translation: { [key: string]: ISightSeeingTourTranslation } = {};
    SightSeeingTourData.translationResponses.forEach((ele) => {
      translation[ele.langId] = ele;
    });
    let index = 0;
    Languages.forEach((lang) => {
      if (values[`name${lang?.id}`]) {
        formData.append(
          `Translations[${index}].id`,
          translation[lang.id] ? translation[lang.id].id.toString() : "0"
        );
        formData.append(`Translations[${index}].langId`, lang.id.toString());
        formData.append(
          `Translations[${index}].SightSeeingTourId`,
          String(SightSeeingTourData.id)
        );
        formData.append(
          `Translations[${index}].name`,
          values[`name${lang?.id}`]
        );
        formData.append(
          `Translations[${index}].note`,
          values[`note${lang?.id}`]
        );
        formData.append(
          `Translations[${index}].description`,
          values[`description${lang?.id}`]
        );
        index++;
      }
    });
    try {
      const data = await SightSeeingTourCommandInstance.updateSightSeeingTour(
        SightSeeingTourUrlEnum.UpdateSightSeeingTour,
        formData
      );
      if (data) {
        CustomToast("Hotel Sightseeing Tour updated successfully", "success", {
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
          validationSchema={SightSeeingTourSchema}
          onSubmit={(values, { setSubmitting }) => {
            handleSubmit(values, setSubmitting);
          }}
        >
          <SightSeeingTourUpdateForm
            SightSeeingTourData={SightSeeingTourData}
          />
        </Formik>
      )}
    </>
  );
};
type IPropsUpdate = {
  SightSeeingTourData: ISightSeeingTourData;
};
const SightSeeingTourUpdateForm = ({ SightSeeingTourData }: IPropsUpdate) => {
  const { setItemIdForUpdate, itemIdForUpdate } = useListView();

  const {
    errors,
    touched,
    isSubmitting,
    isValid,
    values,
    setFieldValue,
    setFieldError,
  }: FormikContextType<FormikValues> = useFormikContext();
  console.log("values", values);

  const { Languages } = useLanguageStore();
  const [languageInput, setLanguageInput] = useState(2);
  const handleError = (message: string, error: Error, field: string) => {
    console.error("Error Fetching data:", error);
    setFieldError(field, message);
    setFieldValue(field, null);
    CustomToast(message, "error");
  };
  const GetSelectedOption = (
    options: IDDlOption[],
    optionId: number | number[],
    FieldName: string
  ) => {
    let selectedOption;

    if (Array.isArray(optionId)) {
      selectedOption = options.filter((option) =>
        optionId.includes(Number(option.value))
      );
    } else {
      selectedOption = options.find(
        (option) => option.value === Number(optionId)
      );
    }

    setFieldValue(FieldName, selectedOption);
  };
  const queryClient = useQueryClient();
  const { CountriesOption, IsCountryLoading } = useCountriesDDL();
  // const { citiesOption, isCitiesLoading } = useCitiesDDL({
  //   countryId: values?.country?.value,
  //   onError: () => {
  //     CustomToast(`Failed to get city data`, "error");
  //   },
  // });
  // useEffect(() => {
  //   const selectedCity = citiesOption?.find(
  //     (city) => city.value === Number(SightSeeingTourData.cityId)
  //   );
  //   if (selectedCity) {
  //     setFieldValue("city", {
  //       label: selectedCity?.label,
  //       value: selectedCity?.value,
  //     });
  //   } else {
  //     setFieldValue("city", null);
  //   }
  // }, [SightSeeingTourData.cityId, citiesOption, setFieldValue]);

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
  useEffect(() => {
    GetSelectedOption(
      SightSeeingCategoryOptions ? SightSeeingCategoryOptions : [],
      SightSeeingTourData?.categoryId,
      "sightSeeingCategory"
    );
    GetSelectedOption(
      CountriesOption ? CountriesOption : [],
      SightSeeingTourData?.countryId, //todo
      "country"
    );
  }, [SightSeeingCategoryOptions, CountriesOption]);

  const HandelDeleteImage = async (imageName?: string) => {
    showAreYouSure({
      message: "Are you sure you want to delete the image?",
      onConfirm: async () => {
        if (imageName) {
          await SightSeeingTourCommandInstance.deleteImagesSightSeeingTour(
            SightSeeingTourUrlEnum.DeleteMultiImagesSightSeeingTour,
            values?.id,
            imageName
          );
          queryClient.invalidateQueries({
            queryKey: [QUERIES.SightSeeingTourList],
          });
          setItemIdForUpdate(SightSeeingTourData.id);
        } else {
          await SightSeeingTourCommandInstance.deleteMainImageSightSeeingTour(
            SightSeeingTourUrlEnum.DeleteSingelImageSightSeeingTour,
            { id: SightSeeingTourData.id, isDeleteImage: true }
          );

          queryClient.invalidateQueries({
            queryKey: [QUERIES.SightSeeingTourList],
          });
          setItemIdForUpdate(SightSeeingTourData.id);
        }
      },
      onCancel: async () => {},
      icon: "warning",
    });
  };
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
                <ul>
                  {SightSeeingTourData.image && (
                    <CustomImageReviewForUpdate
                      inedx={1}
                      fileName={SightSeeingTourData.image}
                      imageUrl={SightSeeingTourData.image}
                      onClickDelete={() => {
                        HandelDeleteImage();
                      }}
                    />
                  )}
                </ul>
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
                <ul>
                  {SightSeeingTourData?.images &&
                    SightSeeingTourData?.images.split(",").map((image) => (
                      <CustomImageReviewForUpdate
                        inedx={+image}
                        fileName={SightSeeingTourData.image + image}
                        imageUrl={SightSeeingTourData.image + image}
                        onClickDelete={() => {
                          HandelDeleteImage(image);
                        }}
                      />
                    ))}
                </ul>
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

export default UpdateSightSeeingTourModalForm;

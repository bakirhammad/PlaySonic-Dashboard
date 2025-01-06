import { Fragment, useEffect, useMemo, useRef, useState } from "react";
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
import { combineBits, QUERIES } from "@presentation/helpers";
import { useQueryClient } from "react-query";
import { IDDlOption } from "@domain/entities";
import PleaseWaitTxt from "@presentation/helpers/loading/PleaseWaitTxt";
import { useLanguageStore } from "@infrastructure/storage/LanguageStore";
import clsx from "clsx";
import validationSchemas from "@presentation/helpers/validationSchemas";
import CustomEditor from "@presentation/components/forms/CustomEditor";
import CustomSelectField from "@presentation/components/forms/CustomSelectField";
import { daysDDLOption } from "@presentation/hooks";
import { useCountriesDDL } from "@presentation/hooks/queries/DDL/SightSeeing/GeneralDDL";
import { IClubData } from "@domain/entities/Clubs/Clubs";
import { ClubCommandInstance } from "@app/useCases/clubs";
import { ClubUrlEnum } from "@domain/enums/URL/Clubs/ClubUrls/Club";
import {
  FeaturesOptionsDDL,
  IfeatureOptionsDDL,
} from "@presentation/helpers/DDL/FeaturesOptions";

interface IProps {
  ClubData: IClubData;
  isLoading: boolean;
}

export const UpdateClubModalForm = ({ ClubData, isLoading }: IProps) => {
  const formikRef = useRef<FormikProps<FormikValues> | null>(null);
  const { setItemIdForUpdate } = useListView();
  const queryClient = useQueryClient();
  const { Languages } = useLanguageStore();

  const initialValues = useMemo(() => {
    const translations = Languages.reduce<{ [key: string]: string }>(
      (acc, lang) => {
        acc[`name${lang.id}`] = "";
        acc[`description${lang.id}`] = "";
        return acc;
      },
      {}
    );
    // SightSeeingTourData.translationResponses.forEach((lang) => {
    //   translations[`name${lang.langId}`] = lang.name;
    //   translations[`description${lang.langId}`] = lang.description;
    // });

    return {
      id: ClubData.id,
      city: ClubData?.cityId,
      country: ClubData?.countryId,
      area: ClubData.areaId,
      phone: ClubData.phone,
      website: ClubData.website,
      features: ClubData.features,
      payload: ClubData.payload,
      lat: ClubData.lat,
      lng: ClubData.lng,
      ...translations,
    };
  }, [ClubData, Languages]);

  const _ClubSchema = Object.assign(
    {
      country: validationSchemas.object,
      // city: validationSchemas.object,
      PickUpTime: Yup.string().required("PickUp Time is Required"),
      MaxNumberOfSeats: validationSchemas.number,
      name2: Yup.string().required("Name is required"),
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
  const ClubSchema = Yup.object().shape(_ClubSchema);
  const handleSubmit = async (
    values: FormikValues,
    setSubmitting: (isSubmitting: boolean) => void
  ) => {
    const features = combineBits(
      values.features.map((feature: IfeatureOptionsDDL) => feature.value)
    );
    const formData = new FormData();
    formData.append("Id", String(initialValues.id));
    formData.append("CountryId", values.country.value);
    formData.append("CityId", values.city.value);
    formData.append("AreaId", values.area.value);
    formData.append("Phone", values.phone);
    formData.append("Website", values.website);
    formData.append("Features", String(features));
    formData.append("Payload", values.payload);
    formData.append("lat", values.lat);
    formData.append("lng", values.lng);

    // const translation: { [key: string]: ISightSeeingTourTranslation } = {};
    // SightSeeingTourData.translationResponses.forEach((ele) => {
    //   translation[ele.langId] = ele;
    // });
    // let index = 0;
    // Languages.forEach((lang) => {
    //   if (values[`name${lang?.id}`]) {
    //     formData.append(
    //       `Translations[${index}].id`,
    //       translation[lang.id] ? translation[lang.id].id.toString() : "0"
    //     );
    //     formData.append(`Translations[${index}].langId`, lang.id.toString());
    //     formData.append(
    //       `Translations[${index}].SightSeeingTourId`,
    //       String(SightSeeingTourData.id)
    //     );
    //     formData.append(
    //       `Translations[${index}].name`,
    //       values[`name${lang?.id}`]
    //     );
    //     formData.append(
    //       `Translations[${index}].note`,
    //       values[`note${lang?.id}`]
    //     );
    //     formData.append(
    //       `Translations[${index}].description`,
    //       values[`description${lang?.id}`]
    //     );
    //     index++;
    //   }
    // });
    try {
      const data = await ClubCommandInstance.updateClub(
        ClubUrlEnum.UpdateClub,
        formData
      );
      if (data) {
        CustomToast("Club updated successfully", "success", {
          autoClose: 3000,
        });
        setItemIdForUpdate(undefined);
        queryClient.invalidateQueries({
          queryKey: [QUERIES.ClubList],
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
          validationSchema={ClubSchema}
          onSubmit={(values, { setSubmitting }) => {
            handleSubmit(values, setSubmitting);
          }}
        >
          <ClubUpdateForm ClubData={ClubData} />
        </Formik>
      )}
    </>
  );
};
type IPropsUpdate = {
  ClubData: IClubData;
};
const ClubUpdateForm = ({ ClubData }: IPropsUpdate) => {
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

  useEffect(() => {
    GetSelectedOption(
      CountriesOption ? CountriesOption : [],
      ClubData?.countryId, //todo
      "country"
    );
  }, [CountriesOption]);

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
            <div className="row row-cols-3">
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
              <CustomSelectField
                name="city"
                labelRequired={false}
                // options={citiesOption}
                // isloading={isCitiesLoading}
                label="DDL-CITY_LABEL"
                placeholder="DDL-CITY_LABEL"
                touched={touched}
                errors={errors}
              />
              <CustomSelectField
                name="area"
                labelRequired={false}
                // options={citiesOption}
                // isloading={isCitiesLoading}
                label="DDL-AREA"
                placeholder="DDL-AREA"
                touched={touched}
                errors={errors}
              />
            </div>
            <div className="row row-cols-md-3 border-info-subtle border-black">
              <CustomSelectField
                name="features"
                placeholder="DDL-FEATURE"
                label="SELECT-FEATURE"
                touched={touched}
                errors={errors}
                isSubmitting={isSubmitting}
                options={FeaturesOptionsDDL}
                isMulti={true}
              />
              <CustomInputField
                name="lat"
                placeholder="CLUB-Latitude"
                label="CLUB-Latitude"
                as="input"
                touched={touched}
                errors={errors}
                type="text"
                isSubmitting={isSubmitting}
              />
              <CustomInputField
                name="lng"
                placeholder="CLUB-Longitude"
                label="CLUB-Longitude"
                as="input"
                touched={touched}
                errors={errors}
                type="text"
                isSubmitting={isSubmitting}
              />
            </div>

            <div className="row row-cols-3">
              <CustomInputField
                name="phone"
                placeholder="CLUB-PHONE"
                label="CLUB-PHONE"
                as="input"
                touched={touched}
                errors={errors}
                type="text"
                isSubmitting={isSubmitting}
              />

              <CustomInputField
                name="payload"
                placeholder="CLUB-PAYLOAD"
                label="CLUB-PAYLOAD"
                as="input"
                touched={touched}
                errors={errors}
                type="text"
                isSubmitting={isSubmitting}
              />

              <CustomInputField
                name="website"
                placeholder="CLUB-WEBSITE"
                label="CLUB-WEBSITE"
                as="input"
                touched={touched}
                errors={errors}
                type="text"
                isSubmitting={isSubmitting}
              />
            </div>
            <hr />
            <div className="translation mt-5">
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
                          label="CLUB-NAME"
                          placeholder="CLUB-NAME"
                          as="input"
                          touched={touched}
                          errors={errors}
                          isSubmitting={isSubmitting}
                          labelRequired={languageInput === 2 ? true : false}
                        />
                      </div>
                      <CustomEditor
                        key={lang.prefix + lang.id + "editor"}
                        name={`description${lang?.id}`}
                        labelRequired={languageInput === 2 ? true : false}
                        label={"CLUB-DISSCRIPTION"}
                      />
                    </Fragment>
                  )
              )}
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

export default UpdateClubModalForm;

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
import { QUERIES } from "@presentation/helpers";
import { useQueryClient } from "react-query";
import PleaseWaitTxt from "@presentation/helpers/loading/PleaseWaitTxt";
import { useLanguageStore } from "@infrastructure/storage/LanguageStore";
import clsx from "clsx";
import validationSchemas from "@presentation/helpers/validationSchemas";
import CustomSelectField from "@presentation/components/forms/CustomSelectField";
import { ICityData } from "@domain/entities/general/city/City";
import { CityCommandInstance } from "@app/useCases/general/city/commands/CityCommand";
import { CityUrlEnum } from "@domain/enums/URL/General/GeneralEnum/CityEnum";
import { useCountriesDDL } from "@presentation/hooks/queries/DDL/GeneralDDL/useCountriesDDL";

interface IProps {
  CityData: ICityData;
  isLoading: boolean;
}

export const UpdateCity = ({ CityData, isLoading }: IProps) => {
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
    CityData.translations.forEach((lang) => {
      translations[`name${lang.languageId}`] = lang.name;
      translations[`description${lang.languageId}`] = lang.description;
    });

    return {
      id: CityData.id,
      rank: CityData.rank,
      payload: CityData.payload,
      countryId: CityData.countryId,
      ...translations,
    };
  }, [CityData, Languages]);

  const _CitySchema = Object.assign(
    {
      rank: Yup.number().required("Rank is required"),
      payload: Yup.string().required("Name is required"),
      countryId: validationSchemas.object,
    },
    ...Languages.map((lang) => {
      return lang.id === 2
        ? {
            [`name${lang?.id}`]: Yup.string().required(
              "This field is required"
            ),
          }
        : {
            [`name${lang?.id}`]: Yup.string().required(
              "This field is required"
            ),
          };
    })
  );
  const CitySchema = Yup.object().shape(_CitySchema);
  const handleSubmit = async (
    values: FormikValues,
    setSubmitting: (isSubmitting: boolean) => void
  ) => {
    const formData = new FormData();
    formData.append("Id", String(initialValues.id));
    formData.append("Rank", values.rank);
    formData.append("Payload", values.payload);
    formData.append("CountryId", values.countryId.value);

    let index = 0;
    Languages.forEach((lang) => {
      if (values[`name${lang?.id}`]) {
        formData.append(`Translations[${index}].id`, values.id.toString());
        formData.append(`Translations[${index}].cityId`, values.id.toString());
        formData.append(
          `Translations[${index}].languageId`,
          lang.id.toString()
        );
        formData.append(
          `Translations[${index}].name`,
          values[`name${lang?.id}`]
        );
        formData.append(
          `Translations[${index}].description`,
          values[`description${lang?.id}`]
        );

        index++;
      }
    });

    try {
      const data = await CityCommandInstance.updateCity(
        CityUrlEnum.UpdateCity,
        formData
      );
      if (data) {
        CustomToast("City updated successfully", "success", {
          autoClose: 3000,
        });
        setItemIdForUpdate(undefined);
        queryClient.invalidateQueries({
          queryKey: [QUERIES.CityList],
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
          validationSchema={CitySchema}
          onSubmit={(values, { setSubmitting }) => {
            handleSubmit(values, setSubmitting);
          }}
        >
          <CityUpdateForm />
        </Formik>
      )}
    </>
  );
};

const CityUpdateForm = () => {
  const { setItemIdForUpdate } = useListView();

  const {
    errors,
    touched,
    isSubmitting,
    isValid,
    values,
    setFieldValue,
  }: FormikContextType<FormikValues> = useFormikContext();
  const { Languages } = useLanguageStore();
  const [languageInput, setLanguageInput] = useState(2);
  const { CountryOption, isCountryLoading } = useCountriesDDL();

  useEffect(() => {
    CountryOption.forEach((elem) => {
      if (elem.value === values.countryId) {
        return setFieldValue("countryId", {
          value: elem.value,
          label: elem.label,
        });
      }
    });
  }, [CountryOption]);

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
                      <div className="row row-cols-1">
                        <CustomInputField
                          key={
                            lang.prefix +
                            lang.id +
                            lang.direction +
                            "input name"
                          }
                          name={`name${lang?.id}`}
                          label="City-NAME"
                          placeholder="City-NAME"
                          as="input"
                          touched={touched}
                          errors={errors}
                          isSubmitting={isSubmitting}
                          labelRequired={languageInput === 2 ? true : false}
                        />
                      </div>
                      {/* <CustomEditor
                        key={lang.prefix + lang.id + "editor"}
                        name={`description${lang?.id}`}
                        labelRequired={languageInput === 2 ? true : false}
                        label={"City-DISSCRIPTION"}
                      /> */}
                    </Fragment>
                  )
              )}
            </div>
            <hr />

            <div className="row row-cols-1">
              {/* <CustomInputField
                name="rank"
                placeholder="Country-RANK"
                label="Country-RANK"
                as="input"
                touched={touched}
                errors={errors}
                type="number"
                isSubmitting={isSubmitting}
              />
              <CustomInputField
                name="payload"
                placeholder="Country-PAYLOAD"
                label="Country-PAYLOAD"
                as="input"
                touched={touched}
                errors={errors}
                type="text"
                isSubmitting={isSubmitting}
              /> */}
              <CustomSelectField
                name="countryId"
                options={CountryOption}
                labelRequired={false}
                isloading={isCountryLoading}
                label="DDL-COUNTRY_LABEL"
                placeholder="DDL-COUNTRY_LABEL"
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

export default UpdateCity;

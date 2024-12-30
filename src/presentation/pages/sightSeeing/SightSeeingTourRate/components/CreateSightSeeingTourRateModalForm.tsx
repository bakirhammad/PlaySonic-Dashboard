import { FC, Fragment, useMemo, useState } from "react";
import {
  CustomButton,
  CustomCheckbox,
  CustomInputField,
  CustomKTCard,
  CustomListLoading,
  CustomToast,
} from "@presentation/components";
import { useListView } from "@presentation/context";
import {
  Form,
  Formik,
  useFormikContext,
  FormikValues,
  FormikContextType,
  FieldArray,
} from "formik";
import * as Yup from "yup";
import { SightSeeingTourRateCommandInstance } from "@app/index";
import { useMutation, useQueryClient } from "react-query";
import { isNotEmpty, QUERIES } from "@presentation/helpers";

import { SightSeeingTourRateUrlEnum } from "@domain/enums";

import validationSchemas from "@presentation/helpers/validationSchemas";
import {
  useLocaleFormate,
  useSightSeeingTourDDL,
} from "@presentation/hooks";
import CustomSelectField from "@presentation/components/forms/CustomSelectField";
import CustomTimePicker from "@presentation/components/forms/CustomTimePicker";
import { useLanguageStore } from "@infrastructure/storage/LanguageStore";
import CustomEditor from "@presentation/components/forms/CustomEditor";
import clsx from "clsx";
import CustomCurrncySelectDDL from "@presentation/components/forms/CustomCurrncySelectDDL";
import { IDDlOption } from "@domain/entities";
import { formatToUtc } from "@presentation/helpers/DateFormater/formatDate";

type Props = {
  sightSeeingSupplierId: string | undefined;
};

export const CreateSightSeeingTourRateModalForm: FC<Props> = ({
  sightSeeingSupplierId,
}) => {
  const { setItemIdForUpdate } = useListView();
  const queryClient = useQueryClient();
  const { Languages } = useLanguageStore();

  const initialValues = useMemo(() => {
    const translations = Languages.reduce<{ [key: string]: string }>(
      (acc, lang) => {
        acc[`name${lang.id}`] = "";
        acc[`note${lang.id}`] = "";
        return acc;
      },
      {}
    );
    return {
      TourId: null,
      ToDate: null,
      FromDate: null,
      Markets: null,
      NumberOfAdults: "",
      AdultCost: "",
      AdultMarkup: "",
      AdultCostCurrency: "",
      AdultMarkupCurrency: "",
      IsActive: false,
      Children: [
        {
          childNumber: "",
          rangeFrom: "",
          rangeTo: "",
          childCost: "",
          childMarkup: "",
          childCostCurrency: null as IDDlOption | null,
          childMarkupCurrency: null as IDDlOption | null,
        },
      ],
      Policies: [],
      ...translations,
    };
  }, [Languages]);

  const SightSeeingTourRateSchema = useMemo(() => {
    const translations = Languages.map((lang) => {
      return lang.id === 2
        ? {
            [`name${lang?.id}`]: Yup.string().required(
              "This field is required"
            ),
          }
        : {
            [`name${lang?.id}`]: Yup.string().when(`note${lang?.id}`, {
              is: (val: string) => val && val.trim() !== "",
              then: (schema) => schema.required("This field is required"),
              otherwise: (schema) => schema,
            }),
          };
    });
    return Yup.object().shape(
      Object.assign(
        {
          Markets: validationSchemas.array,
          FromDate: Yup.date()
            .required("From Date is required")
            .typeError("Invalid Date"),
          ToDate: Yup.date()
            .required("To Date is required")
            .typeError("Invalid Date")
            .when("FromDate", {
              is: (FromDate: string) => isNotEmpty(FromDate),
              then: (schema) =>
                schema.min(
                  Yup.ref("FromDate"),
                  "Date To can't be before Date From"
                ),
              otherwise: (schema) => schema,
            }),
          NumberOfAdults: validationSchemas.number,
          AdultCost: validationSchemas.double,
          AdultMarkup: validationSchemas.double,
          Policies: validationSchemas.array,
          note2: validationSchemas.string,

          Children: Yup.array().of(
            Yup.object().shape({
              rangeFrom: Yup.number().required("Range from is required"),
              rangeTo: Yup.number().required("Range to is required"),
              childCost: Yup.number().required("Child cost is required"),
              childMarkup: Yup.number().required("Child markup is required"),
            })
          ),
        },
        ...translations
      )
    );
  }, [Languages]);

  const createSightSeeingTourRate = async (formData: FormData) => {
    return SightSeeingTourRateCommandInstance.createSightSeeingTourRate(
      SightSeeingTourRateUrlEnum.CreateSightSeeingTourRate,
      formData
    );
  };

  const mutation = useMutation(createSightSeeingTourRate, {
    onSuccess: () => {
      CustomToast("Sightseeing Tour Rate created successfully", "success", {
        autoClose: 3000,
      });
      setItemIdForUpdate(undefined);
      queryClient.invalidateQueries({
        queryKey: [QUERIES.SightSeeingTourRateList],
      });
    },
    onError: (error) => {
      if (error instanceof Error) {
        CustomToast(error.message, "error", { autoClose: 6000 });
        console.error("Error Create form:", error);
      }
    },
  });

  const handleSubmit = async (
    values: FormikValues,
    setSubmitting: (isSubmitting: boolean) => void
  ) => {
    const formData = new FormData();
    formData.append("SightSeeingSupplierId", String(sightSeeingSupplierId));
    formData.append("TourId", values.TourId.value);
    formData.append(
      "FromDate",
      formatToUtc(values.FromDate, "YYYY-MM-DD HH:mm")
    );
    formData.append("ToDate", formatToUtc(values.ToDate, "YYYY-MM-DD HH:mm"));

    formData.append("NumberOfAdults", values.NumberOfAdults);
    formData.append("NumberOfChildren", values.Children.length);
    formData.append("AdultCost", values.AdultCost);
    formData.append("AdultMarkup", values.AdultMarkup);
    formData.append("AdultCostCurrencyId", values.AdultCostCurrency.value);
    formData.append("AdultMarkupCurrencyId", values.AdultMarkupCurrency.value);
    formData.append("IsActive", values.IsActive);
    values.Markets.forEach((Market: IDDlOption, index: number) => {
      formData.append(`Markets[${index}]`, String(Market?.value));
    });
    values.Children.forEach(
      (child: (typeof initialValues.Children)[0], index: number) => {
        formData.append(`Children[${index}].rangeFrom`, child.rangeFrom);
        formData.append(`Children[${index}].rangeTo`, child.rangeTo);
        formData.append(`Children[${index}].childCost`, child.childCost);
        formData.append(`Children[${index}].childMarkup`, child.childMarkup);

        formData.append(
          `Children[${index}].childCostCurrencyId`,
          String(child.childCostCurrency?.value)
        );
        formData.append(
          `Children[${index}].childMarkupCurrencyId`,
          String(child.childMarkupCurrency?.value)
        );
      }
    );

    values.Policies.forEach((policy: IDDlOption, index: number) => {
      formData.append(`Policies[${index}].policyId`, policy.value.toString());
    });
    let index = 0;
    Languages.forEach((lang) => {
      if (values[`name${lang?.id}`]) {
        formData.append(`Translations[${index}].langId`, lang.id.toString());
        formData.append(
          `Translations[${index}].name`,
          values[`name${lang?.id}`]
        );
        formData.append(
          `Translations[${index}].note`,
          values[`note${lang?.id}`]
        );
        index++;
      }
    });
    try {
      mutation.mutate(formData);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Formik
      initialValues={initialValues}
      initialTouched={Languages.reduce<{ [key: string]: boolean }>(
        (acc, lang) => {
          if (lang.id !== 2) acc[`name${lang.id}`] = true;
          return acc;
        },
        {}
      )}
      validationSchema={SightSeeingTourRateSchema}
      onSubmit={(values, { setSubmitting }) => {
        handleSubmit(values, setSubmitting);
      }}
    >
      <SightSeeingTourRateForm />
    </Formik>
  );
};

const SightSeeingTourRateForm = () => {
  const {
    errors,
    touched,
    isSubmitting,
    isValid,
    values,
    setFieldError,
    setFieldValue,
  }: FormikContextType<FormikValues> = useFormikContext();

  const handlError = (message: string, error: Error, field: string) => {
    console.error("Error Fetching data:", error);
    setFieldError(field, message);
    setFieldValue(field, null);
    CustomToast(message, "error");
  };
  const { setItemIdForUpdate } = useListView();

  const { Languages } = useLanguageStore();
  const [languageInput, setLanguageInput] = useState(2);
  const { isSightSeeingTourListLoading, SightSeeingTourOptions } =
    useSightSeeingTourDDL({
      onError: (error: Error) => {
        handlError("Failed to get Sightseeing  Tour Data ", error, "TourId");
      },
    });

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
              <CustomTimePicker
                name={`FromDate`}
                label="SIGHT-SEEING-TOUR-RATE-FROM-DATE-TABEL-LABEL"
                placeholder="SIGHT-SEEING-TOUR-RATE-FROM-DATE-TABEL-PLACEHOLDER"
                touched={touched}
                enableTime={true}
                errors={errors}
                labelRequired={true}
              />
              <CustomTimePicker
                name={`ToDate`}
                label="SIGHT-SEEING-TOUR-RATE-TO-DATE-TABEL-LABEL"
                placeholder="SIGHT-SEEING-TOUR-RATE-TO-DATE-TABEL-PLACEHOLDER"
                touched={touched}
                enableTime={true}
                errors={errors}
                labelRequired={true}
              />
              <CustomSelectField
                name="TourId"
                options={SightSeeingTourOptions}
                isloading={isSightSeeingTourListLoading}
                label="DDL-SIGHT-SEEING-TOUR"
                placeholder="SELECT-DDL-SIGHT-SEEING-TOUR"
                touched={touched}
                errors={errors}
                isSubmitting={isSubmitting}
              />

            
            </div>

            <div className="col-sm-12 row row-cols-3">
              <CustomInputField
                name={"NumberOfAdults"}
                touched={touched}
                label="SIGHT-SEEING-TOUR-RATE-NUMBER-OF-ADULTS-TABEL"
                placeholder="SIGHT-SEEING-TOUR-RATE-NUMBER-OF-ADULTS-TABEL"
                errors={errors}
                type="number"
              />
              <CustomCurrncySelectDDL
                name={`AdultCostCurrency`}
                label="DDL-CURRENCY"
              >
                <CustomInputField
                  name={"AdultCost"}
                  touched={touched}
                  label="SIGHT-SEEING-TOUR-RATE-NUMBER-ADUT-COST-TABEL"
                  placeholder="SIGHT-SEEING-TOUR-RATE-NUMBER-ADUT-COST-TABEL"
                  errors={errors}
                  type="number"
                />
              </CustomCurrncySelectDDL>
              <CustomCurrncySelectDDL
                name={`AdultMarkupCurrency`}
                label="DDL-CURRENCY"
              >
                <CustomInputField
                  name={"AdultMarkup"}
                  touched={touched}
                  label="SIGHT-SEEING-TOUR-RATE-NUMBER-ADUT-MARKUP-TABEL"
                  placeholder="SIGHT-SEEING-TOUR-RATE-NUMBER-ADUT-MARKUP-TABEL"
                  errors={errors}
                  type="number"
                />
              </CustomCurrncySelectDDL>
            </div>

            <div className="row row-cols-2">
              <div className="d-flex align-items-center">
                <CustomCheckbox
                  labelTxt="SIGHT-SEEING-TOUR-RATE-STATUS-TABEL-LABEL"
                  name={"IsActive"}
                  touched={touched}
                  labelRequired={false}
                  errors={errors}
                />
              </div>
            </div>
          </div>
          <hr />
          <h2 className="text-info mb-5 nav-underline ">
            {useLocaleFormate("CHILDREN")}
          </h2>
          <FieldArray name={"Children"}>
            {({ remove, push }) => (
              <>
                {values.Children.map((_: unknown, index: number) => (
                  <div className="my-5">
                    <CustomKTCard
                      utilityP={10}
                      stretch="stretch-25"
                      flush={true}
                    >
                      <div key={index} className="row mb-3 ">
                        <div className="col-md-6">
                          <CustomInputField
                            name={`Children[${index}].rangeFrom`}
                            label={
                              "SIGHT-SEEING-TOUR-RATE-RANGE-FROM-TABEL-LABEL"
                            }
                            placeholder="SIGHT-SEEING-TOUR-RATE-RANGE-FROM-TABEL-PLACEHOLDER"
                            touched={touched}
                            errors={errors}
                            type="number"
                            labelRequired={true}
                          />
                        </div>
                        <div className="col-md-6">
                          <CustomInputField
                            name={`Children[${index}].rangeTo`}
                            label={
                              "SIGHT-SEEING-TOUR-RATE-RANGE-TO-TABEL-LABEL"
                            }
                            placeholder="SIGHT-SEEING-TOUR-RATE-RANGE-TO-TABEL-PLACEHOLDER"
                            touched={touched}
                            type="number"
                            errors={errors}
                            labelRequired={true}
                          />
                        </div>
                        <div className="col-md-6">
                          <CustomCurrncySelectDDL
                            name={`Children[${index}].childCostCurrency`}
                            label="DDL-CURRENCY"
                          >
                            <CustomInputField
                              name={`Children[${index}].childCost`}
                              label={
                                "SIGHT-SEEING-TOUR-RATE-CHILD-COST-TABEL-LABEL"
                              }
                              placeholder="SIGHT-SEEING-TOUR-RATE-CHILD-COST-TABEL-PLACEHOLDER"
                              type="number"
                              touched={touched}
                              errors={errors}
                              labelRequired={true}
                            />
                          </CustomCurrncySelectDDL>
                        </div>
                        <div className="col-md-6">
                          <CustomCurrncySelectDDL
                            name={`Children[${index}].childMarkupCurrency`}
                            label="DDL-CURRENCY"
                          >
                            <CustomInputField
                              name={`Children[${index}].childMarkup`}
                              label="SIGHT-SEEING-TOUR-RATE-CHILD-MARKUP-TABEL-LABEL"
                              placeholder="SIGHT-SEEING-TOUR-RATE-CHILD-MARKUP-TABEL-PLACEHOLDER"
                              type="number"
                              touched={touched}
                              errors={errors}
                              labelRequired={true}
                            />
                          </CustomCurrncySelectDDL>
                        </div>
                        {index > 0 && (
                          <div className="col-md-1 d-flex align-items-center">
                            <CustomButton
                              type="button"
                              className="btn btn-danger"
                              text="REMOVE"
                              onClick={() => remove(index)}
                            />
                          </div>
                        )}
                      </div>
                    </CustomKTCard>
                  </div>
                ))}
                <div className="text-center">
                  <CustomButton
                    type="button"
                    className="btn btn-primary my-4"
                    text="ADD-CHILDREN"
                    onClick={() =>
                      push({
                        id: 0,
                        rangeFrom: "",
                        rangeTo: "",
                        childCost: "",
                        childMarkup: "",
                      })
                    }
                    icon
                    iconName="bi bi-plus-lg"
                  />
                </div>
              </>
            )}
          </FieldArray>
          <hr />
          <h2 className="text-info mb-5 nav-underline ">
            {useLocaleFormate("POLICIES")}
          </h2>

          <div className="d-flex mb-7">
            {Languages?.map((lang, index) => (
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
          <div className="row row-cols-1">
            {Languages?.map(
              (lang) =>
                lang.id === languageInput && (
                  <Fragment key={lang.prefix + lang.id + "input+editor"}>
                    <CustomInputField
                      key={lang.prefix + lang.id + "input"}
                      label="SIGHT-SEEING-TOUR-RATE-NAME_LABEL"
                      placeholder="SIGHT-SEEING-TOUR-RATE-NAME_PLACEHOLDER"
                      name={`name${lang?.id}`}
                      as="input"
                      touched={touched}
                      errors={errors}
                      isSubmitting={isSubmitting}
                      labelRequired={languageInput === 2 ? true : false}
                    />
                    <CustomEditor
                      key={lang.prefix + lang.id + "editor"}
                      label="SIGHT-SEEING-TOUR-RATE-NOTE-LABEL"
                      name={`note${lang?.id}`}
                      isSubmitting={isSubmitting}
                    />
                  </Fragment>
                )
            )}
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

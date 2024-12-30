import { Fragment, useEffect, useMemo, useRef, useState } from "react";
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
  FieldArray,
  Form,
  Formik,
  FormikContextType,
  FormikProps,
  FormikValues,
  useFormikContext,
} from "formik";
import * as Yup from "yup";
import { isNotEmpty, QUERIES } from "@presentation/helpers";
import { useMutation, useQueryClient } from "react-query";
import {
  IDDlOption,
  ISightSeeingTourRateChild,
  ISightSeeingTourRateData,
  ISightSeeingTourRatePolicy,
  ISightSeeingTourRateTranslation,
} from "@domain/entities";
import { SightSeeingTourRateCommandInstance } from "@app/index";
import PleaseWaitTxt from "@presentation/helpers/loading/PleaseWaitTxt";
import { SightSeeingTourRateUrlEnum } from "@domain/enums";

import {
  useLocaleFormate,
  useSightSeeingTourDDL,
} from "@presentation/hooks";
import CustomSelectField from "@presentation/components/forms/CustomSelectField";
import validationSchemas from "@presentation/helpers/validationSchemas";
import CustomTimePicker from "@presentation/components/forms/CustomTimePicker";
import { useLanguageStore } from "@infrastructure/storage/LanguageStore";
import CustomEditor from "@presentation/components/forms/CustomEditor";
import clsx from "clsx";
import { compareAndUpdate } from "@presentation/helpers";
import CustomCurrncySelectDDL from "@presentation/components/forms/CustomCurrncySelectDDL";
import {
  formatFromUtcToLocale,
  formatToUtc,
} from "@presentation/helpers/DateFormater/formatDate";
import { currenciesStore } from "@infrastructure/storage/currenciesStore";

interface IProps {
  SightSeeingTourRateData: ISightSeeingTourRateData;
  isLoading: boolean;
  openUpdateSightSeeingTourRateModal: (id: number) => Promise<void>;
}

export const UpdateSightSeeingTourRateModalForm = ({
  SightSeeingTourRateData,
  isLoading,
}: IProps) => {
  const formikRef = useRef<FormikProps<FormikValues> | null>(null);
  const { Languages } = useLanguageStore();
  const { setItemIdForUpdate } = useListView();
  const queryClient = useQueryClient();
  const initialValues = useMemo(() => {
    const translations = Languages.reduce<{ [key: string]: string }>(
      (acc, lang) => {
        acc[`name${lang.id}`] = "";
        acc[`note${lang.id}`] = "";
        return acc;
      },
      {}
    );

    SightSeeingTourRateData.translations.forEach((lang) => {
      translations[`name${lang.langId}`] = lang.name;
      translations[`note${lang.langId}`] = lang.note;
    });

    return {
      id: SightSeeingTourRateData.id,
      TourId: null,
      ToDate: formatFromUtcToLocale(
        SightSeeingTourRateData.toDate,
        "YYYY-MM-DD HH:mm"
      ),
      FromDate: formatFromUtcToLocale(
        SightSeeingTourRateData.fromDate,
        "YYYY-MM-DD HH:mm"
      ),
      CurrencyId: null,
      MarketId: null,
      NumberOfAdults: SightSeeingTourRateData.numberOfAdults,
      NumberOfChildren: SightSeeingTourRateData.numberOfChildren,
      AdultCost: SightSeeingTourRateData.adultCost,
      AdultMarkup: SightSeeingTourRateData.adultMarkup,
      IsActive: SightSeeingTourRateData.isActive,
      Children: SightSeeingTourRateData.children,
      Policies: SightSeeingTourRateData.policies,
      ...translations,
    };
  }, [Languages, SightSeeingTourRateData]);
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
          TourId: validationSchemas.object,
          CurrencyId: validationSchemas.object,
          MarketId: validationSchemas.object,
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
          NumberOfChildren: validationSchemas.number,
          AdultCost: validationSchemas.double,
          AdultMarkup: validationSchemas.double,
          Policies: validationSchemas.array,
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

  const updateSightSeeingTourRate = async (formData: FormData) => {
    return SightSeeingTourRateCommandInstance.updateSightSeeingTourRate(
      SightSeeingTourRateUrlEnum.UpdateSightSeeingTourRate,
      formData
    );
  };

  const UpdateSightSeeingTourRate = useMutation(updateSightSeeingTourRate, {
    onSuccess: () => {
      CustomToast("Sightseeing Tour Rate Updated successfully", "success", {
        autoClose: 3000,
      });
      setItemIdForUpdate(undefined);
      queryClient.invalidateQueries({
        queryKey: [QUERIES.SightSeeingTourRateList],
      });
    },
    onError: (error: Error) => {
      if (error instanceof Error) {
        CustomToast(error.message, "error", { autoClose: 6000 });
        console.error("Error Update form:", error);
      }
    },
  });
  const handleSubmit = async (
    values: FormikValues,
    setSubmitting: (isSubmitting: boolean) => void
  ) => {
    const formData = new FormData();
    formData.append("id", String(initialValues.id));
    formData.append(
      "SightSeeingSupplierId",
      String(SightSeeingTourRateData.sightSeeingSupplierId)
    );
    formData.append("TourId", values.TourId.value);
    formData.append(
      "FromDate",
      formatToUtc(values.FromDate, "YYYY-MM-DD HH:mm")
    );
    formData.append("ToDate", formatToUtc(values.ToDate, "YYYY-MM-DD HH:mm"));
    formData.append("CurrencyId", values.CurrencyId?.value);
    formData.append("MarketId", values.MarketId?.value);
    formData.append("NumberOfAdults", values.NumberOfAdults);
    formData.append("NumberOfChildren", values.NumberOfChildren);
    formData.append("AdultCost", values.AdultCost);
    formData.append("AdultMarkup", values.AdultMarkup);
    formData.append("IsActive", values.IsActive);
    const newChildren = compareAndUpdate<ISightSeeingTourRateChild>(
      initialValues.Children,
      values.Children
    );
    const NewPolicies = compareAndUpdate<ISightSeeingTourRatePolicy>(
      initialValues.Policies,
      values.Policies
    );

    newChildren.forEach(
      (child: (typeof initialValues.Children)[0], index: number) => {
        formData.append(`Children[${index}].id`, String(child.id));
        formData.append(
          `Children[${index}].rangeFrom`,
          String(child.rangeFrom)
        );
        formData.append(`Children[${index}].rateId`, String(initialValues.id));
        formData.append(`Children[${index}].rangeTo`, String(child.rangeTo));
        formData.append(
          `Children[${index}].childCost`,
          String(child.childCost)
        );
        formData.append(
          `Children[${index}].childMarkup`,
          String(child.childMarkup)
        );
        formData.append(
          `Children[${index}].isDeleted`,
          String(child.isDeleted ? child.isDeleted : false)
        );
      }
    );

    let index = 0;
    const oldTranslation = SightSeeingTourRateData.translations.reduce<{
      [field: number]: ISightSeeingTourRateTranslation;
    }>((acc, translation) => {
      acc[translation.langId] = translation;
      return acc;
    }, {});
    Languages.forEach((lang) => {
      if (values[`name${lang?.id}`]) {
        formData.append(
          `Translations[${index}].id`,
          oldTranslation[lang.id] ? oldTranslation[lang.id].id.toString() : "0"
        );
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
    const mutation = UpdateSightSeeingTourRate;

    try {
      mutation.mutate(formData);
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
          validationSchema={SightSeeingTourRateSchema}
          onSubmit={(values, { setSubmitting }) => {
            handleSubmit(values, setSubmitting);
          }}
        >
          <SightSeeingTourRateUpdateForm
            SightSeeingTourRateData={SightSeeingTourRateData}
          />
        </Formik>
      )}
    </>
  );
};

const SightSeeingTourRateUpdateForm = ({
  SightSeeingTourRateData,
}: {
  SightSeeingTourRateData: ISightSeeingTourRateData;
}) => {
  const { setItemIdForUpdate } = useListView();

  const {
    errors,
    touched,
    isSubmitting,
    isValid,
    setFieldError,
    values,
    setFieldValue,
  }: FormikContextType<FormikValues> = useFormikContext();
  console.log("values", values);

  const handlError = (message: string, error: Error, field: string) => {
    console.error("Error Fetching data:", error);
    setFieldError(field, message);
    setFieldValue(field, null);
    CustomToast(message, "error");
  };
 
  const { Languages } = useLanguageStore();
  const [languageInput, setLanguageInput] = useState(2);
  const { currenciesDDL } = currenciesStore();

  const { isSightSeeingTourListLoading, SightSeeingTourOptions } =
    useSightSeeingTourDDL({
      onError: (error: Error) => {
        handlError("Failed to get Sightseeing  Tour Data ", error, "TourId");
      },
    });
  
  const GetSelctedOption = (
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

  useEffect(() => {
    
    GetSelctedOption(
      currenciesDDL ?? [],
      SightSeeingTourRateData?.currencyId,
      "CurrencyId"
    );
   
    GetSelctedOption(
      SightSeeingTourOptions ?? [],
      SightSeeingTourRateData?.tourId,
      "TourId"
    );
  }, [SightSeeingTourOptions]);

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
            <div className="col-md-6">
              <CustomTimePicker
                name={`FromDate`}
                label="SIGHT-SEEING-TOUR-RATE-FROM-DATE-TABEL-LABEL"
                placeholder="SIGHT-SEEING-TOUR-RATE-FROM-DATE-TABEL-PLACEHOLDER"
                touched={touched}
                enableTime={true}
                errors={errors}
                labelRequired={true}
              />
            </div>
            <div className="col-md-6">
              <CustomTimePicker
                name={`ToDate`}
                label="SIGHT-SEEING-TOUR-RATE-TO-DATE-TABEL-LABEL"
                placeholder="SIGHT-SEEING-TOUR-RATE-TO-DATE-TABEL-PLACEHOLDER"
                touched={touched}
                enableTime={true}
                errors={errors}
                labelRequired={true}
              />
            </div>
            <div className="row row-cols-3">
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

              

              <CustomSelectField
                name="CurrencyId"
                options={currenciesDDL}
                label="DDL-CURRENCY"
                placeholder="SELECT-DDL-CURRENCY"
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
              <CustomInputField
                name={"NumberOfChildren"}
                touched={touched}
                label="SIGHT-SEEING-TOUR-RATE-NUMBER-OF-CHILDREN-TABEL"
                placeholder="SIGHT-SEEING-TOUR-RATE-NUMBER-OF-CHILDREN-TABEL"
                errors={errors}
                type="number"
              />
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
          <FieldArray name="Children">
            {({ push, replace }) => (
              <>
                {values.Children.map((child, index) => (
                  <>
                    {!child.isDeleted && (
                      <div className="my-5" key={index}>
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
                          </div>
                          <div className="row mb-3">
                            {index > 0 && (
                              <div className="col-md-1 d-flex align-items-center">
                                <CustomButton
                                  type="button"
                                  className="btn btn-danger"
                                  text="REMOVE"
                                  onClick={() => {
                                    replace(index, {
                                      ...child,
                                      isDeleted: true,
                                    });
                                  }}
                                />
                              </div>
                            )}
                          </div>
                        </CustomKTCard>
                      </div>
                    )}
                  </>
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
                        isDeleted: false,
                      })
                    }
                    icon
                    iconName="bi bi-plus-lg"
                    disabled={
                      values.NumberOfChildren
                        ? values.Children.length >= values.NumberOfChildren
                        : false
                    }
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

export default UpdateSightSeeingTourRateModalForm;

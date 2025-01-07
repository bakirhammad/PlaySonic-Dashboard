import { Fragment, useRef, useState } from "react";
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
import { useLanguageStore } from "@infrastructure/storage/LanguageStore";
import clsx from "clsx";
import { CountryCommandInstance } from "@app/useCases/general/country/commands/CountryCommand";
import { CountryUrlEnum } from "@domain/enums";

export const CreateCountry = () => {
  const formikRef = useRef<FormikProps<FormikValues> | null>(null);
  const { setItemIdForUpdate } = useListView();
  const queryClient = useQueryClient();
  const { Languages } = useLanguageStore();

  const initialValues = Object.assign(
    {
      rank: null,
      payload: null,
    },
    ...Languages.map((lang) => ({
      [`name${lang?.id}`]: "",
    }))
  );

  const _CountrySchema = Object.assign(
    {
      rank: Yup.number().required("Rank is required"),
      payload: Yup.string().required("Name is required"),
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

  const CountrySchema = Yup.object().shape(_CountrySchema);

  const handleSubmit = async (
    values: FormikValues,
    setSubmitting: (isSubmitting: boolean) => void
  ) => {
    const formData = new FormData();
    formData.append("Rank", values.rank);
    formData.append("Payload", values.payload);

    let index = 0;
    Languages.forEach((lang) => {
      if (values[`name${lang?.id}`]) {
        formData.append(
          `Translations[${index}].languageId`,
          lang.id.toString()
        );
        formData.append(
          `Translations[${index}].name`,
          values[`name${lang?.id}`]
        );
        index++;
      }
    });

    try {
      const data = await CountryCommandInstance.createCountry(
        CountryUrlEnum.CreateCountry,
        formData
      );
      if (data) {
        CustomToast("Country is created successfully", "success", {
          autoClose: 3000,
        });
        setItemIdForUpdate(undefined);
        queryClient.invalidateQueries({
          queryKey: [QUERIES.CountryList],
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
      validationSchema={CountrySchema}
      onSubmit={(values, { setSubmitting }) => {
        handleSubmit(values, setSubmitting);
      }}
    >
      <CountryForm />
    </Formik>
  );
};

const CountryForm = () => {
  const {
    errors,
    touched,
    isSubmitting,
    isValid,
  }: FormikContextType<FormikValues> = useFormikContext();

  const { setItemIdForUpdate } = useListView();

  const { Languages } = useLanguageStore();
  const [languageInput, setLanguageInput] = useState(2);

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
            <div className="row row-cols-md-3 border-info-subtle border-black">
              <CustomInputField
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
                          label="Country-NAME"
                          placeholder="Country-NAME"
                          as="input"
                          touched={touched}
                          errors={errors}
                          isSubmitting={isSubmitting}
                          labelRequired={languageInput === 2 ? true : false}
                        />
                      </div>
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

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
import { SightSeeingCategoryCommandInstance } from "@app/index";
import { useQueryClient } from "react-query";
import { QUERIES } from "@presentation/helpers";

import { SightSeeingCategoryUrlEnum } from "@domain/enums";
import { useLanguageStore } from "@infrastructure/storage/LanguageStore";
import clsx from "clsx";

export const CreateSightSeeingCategoryModalForm = () => {
  const formikRef = useRef<FormikProps<FormikValues> | null>(null);
  const { setItemIdForUpdate } = useListView();
  const queryClient = useQueryClient();
  const { Languages } = useLanguageStore();

  const initialValues = Object.assign(
    {
      Code: "",
      Status: false,
    },
    ...Languages.map((lang) => ({
      [`name${lang?.id}`]: "",
    }))
  );

  const _SightSeeingCategorySchema = Object.assign({
    Code: Yup.string().required("Sightseeing Category Code is required"),
    name2: Yup.string().required("Sightseeing Category Name is required"),
  });

  const SightSeeingCategorySchema = Yup.object().shape(
    _SightSeeingCategorySchema
  );

  const handleSubmit = async (
    values: FormikValues,
    setSubmitting: (isSubmitting: boolean) => void
  ) => {
    const formData = new FormData();
    formData.append("Code", values.Code);
    formData.append("Status", values.Status);

    let index = 0;
    Languages.forEach((lang) => {
      if (values[`name${lang?.id}`]) {
        formData.append(`Translations[${index}].langId`, lang.id.toString());
        formData.append(
          `Translations[${index}].name`,
          values[`name${lang?.id}`]
        );

        index++;
      }
    });

    try {
      const data =
        await SightSeeingCategoryCommandInstance.createSightSeeingCategory(
          SightSeeingCategoryUrlEnum.CreateSightSeeingCategory,
          formData
        );
      if (data) {
        CustomToast("Sightseeing Category created successfully", "success", {
          autoClose: 3000,
        });
        setItemIdForUpdate(undefined);
        queryClient.invalidateQueries({
          queryKey: [QUERIES.SightSeeingCategoryList],
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
      validationSchema={SightSeeingCategorySchema}
      onSubmit={(values, { setSubmitting }) => {
        handleSubmit(values, setSubmitting);
      }}
    >
      <SightSeeingCategoryForm />
    </Formik>
  );
};

const SightSeeingCategoryForm = () => {
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
                <Fragment key={lang.prefix + lang.id + "input+editor"}>
                  <CustomInputField
                    key={lang.prefix + lang.id + "input"}
                    name={`name${lang?.id}`}
                    labelRequired={lang?.id == 2 ? true : false}
                    label="SIGHT-SEEING-NAME"
                    placeholder="SIGHT-SEEING-NAME"
                    as="input"
                    touched={touched}
                    errors={errors}
                    isSubmitting={isSubmitting}
                  />
                </Fragment>
              )
          )}
          <div className="row">
            <div className="col-md-6">
              <CustomInputField
                name="Code"
                placeholder="SIGHT-SEEING-CATEGORY-CODE-TABEL-PLACEHOLDER"
                label="SIGHT-SEEING-CATEGORY-CODE-TABEL-LABEL"
                as="input"
                touched={touched}
                errors={errors}
                isSubmitting={isSubmitting}
              />
            </div>
            <div className="col-md-6 d-flex align-items-center">
              <CustomCheckbox
                labelTxt="SIGHT-SEEING-CATEGORY-STATUS-TABEL-LABEL"
                name={"Status"}
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

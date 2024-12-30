import { Fragment, useMemo, useRef, useState } from "react";
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
import {
  ISightSeeingCategoryData,
  ISightSeeingCategoryTranslation,
} from "@domain/entities";
import { SightSeeingCategoryCommandInstance } from "@app/index";
import PleaseWaitTxt from "@presentation/helpers/loading/PleaseWaitTxt";
import { SightSeeingCategoryUrlEnum } from "@domain/enums";
import { useLanguageStore } from "@infrastructure/storage/LanguageStore";

import clsx from "clsx";

interface IProps {
  SightSeeingCategoryData: ISightSeeingCategoryData;
  isLoading: boolean;
  openUpdateSightSeeingCategoryModal: (id: number) => Promise<void>;
}

export const UpdateSightSeeingCategoryModalForm = ({
  SightSeeingCategoryData,
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
        return acc;
      },
      {}
    );
    SightSeeingCategoryData.translations.forEach((lang) => {
      translations[`name${lang.langId}`] = lang.name;
    });

    return {
      id: SightSeeingCategoryData.id,
      Code: SightSeeingCategoryData.code,
      Status: SightSeeingCategoryData.status,
      ...translations,
    };
  }, [SightSeeingCategoryData, Languages]);

  const SightSeeingCategorySchema = Yup.object().shape({
    Code: Yup.string().required("Sightseeing Category Code is required"),
    name2: Yup.string().required("Sightseeing Category Name is required"),
  });

  const handleSubmit = async (
    values: FormikValues,
    setSubmitting: (isSubmitting: boolean) => void
  ) => {
    const formData = new FormData();
    formData.append("id", String(SightSeeingCategoryData.id));
    formData.append("Code", values.Code);
    formData.append("Status", values.Status);
    const translation: { [key: string]: ISightSeeingCategoryTranslation } = {};
    SightSeeingCategoryData.translations.forEach((ele) => {
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
          `Translations[${index}].sightSeeingCategoryId`,
          String(SightSeeingCategoryData.id)
        );
        formData.append(
          `Translations[${index}].name`,
          values[`name${lang?.id}`]
        );
        index++;
      }
    });
    try {
      const data =
        await SightSeeingCategoryCommandInstance.updateSightSeeingCategory(
          SightSeeingCategoryUrlEnum.UpdateSightSeeingCategory,
          formData
        );
      if (data) {
        CustomToast("Sightseeing Category updated successfully", "success", {
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
          validationSchema={SightSeeingCategorySchema}
          onSubmit={(values, { setSubmitting }) => {
            handleSubmit(values, setSubmitting);
          }}
        >
          <SightSeeingCategoryUpdateForm />
        </Formik>
      )}
    </>
  );
};

const SightSeeingCategoryUpdateForm = () => {
  const { setItemIdForUpdate } = useListView();

  const {
    errors,
    touched,
    isSubmitting,
    isValid,
  }: FormikContextType<FormikValues> = useFormikContext();

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

export default UpdateSightSeeingCategoryModalForm;

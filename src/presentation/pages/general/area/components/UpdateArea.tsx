import { Fragment, useMemo, useRef, useState } from "react";
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
import { AreaUrlEnum } from "@domain/enums/URL/General/GeneralEnum/AreaEnum";
import { IAreaData } from "@domain/entities/general/area/Area";
import { AreaCommandInstance } from "@app/useCases/general/area/command/AreaCommand";
import { useCitiesDDL } from "@presentation/hooks/queries/DDL/GeneralDDL/useCitiesDDL";

interface IProps {
  AreaData: IAreaData;
  isLoading: boolean;
}

export const UpdateArea = ({ AreaData, isLoading }: IProps) => {
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
    AreaData.translations.forEach((lang) => {
      translations[`name${lang.languageId}`] = lang.name;
    });

    return {
      id: AreaData.id,
      rank: AreaData.rank,
      payload: AreaData.payload,
      cityId: AreaData.cityId,
      ...translations,
    };
  }, [AreaData, Languages]);

  const _AreaSchema = Object.assign(
    {
      rank: Yup.number().required("Rank is required"),
      payload: Yup.string().required("Name is required"),
      cityId: validationSchemas.object,
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
  const AreaSchema = Yup.object().shape(_AreaSchema);
  const handleSubmit = async (
    values: FormikValues,
    setSubmitting: (isSubmitting: boolean) => void
  ) => {
    const formData = new FormData();
    formData.append("Id", String(initialValues.id));
    formData.append("Rank", values.rank);
    formData.append("Payload", values.payload);
    formData.append("CityId", values.cityId.value);

    let index = 0;
    Languages.forEach((lang) => {
      if (values[`name${lang?.id}`]) {
        formData.append(`Translations[${index}].id`, values.id.toString());
        formData.append(`Translations[${index}].areaId`, values.id.toString());
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
      const data = await AreaCommandInstance.updateArea(
        AreaUrlEnum.UpdateArea,
        formData
      );
      if (data) {
        CustomToast("Area updated successfully", "success", {
          autoClose: 3000,
        });
        setItemIdForUpdate(undefined);
        queryClient.invalidateQueries({
          queryKey: [QUERIES.AreaList],
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
          validationSchema={AreaSchema}
          onSubmit={(values, { setSubmitting }) => {
            handleSubmit(values, setSubmitting);
          }}
        >
          <AreaUpdateForm />
        </Formik>
      )}
    </>
  );
};

const AreaUpdateForm = () => {
  const { setItemIdForUpdate } = useListView();

  const {
    errors,
    touched,
    isSubmitting,
    isValid,
    values,
  }: FormikContextType<FormikValues> = useFormikContext();
  console.log("values", values);

  const { Languages } = useLanguageStore();
  const [languageInput, setLanguageInput] = useState(2);
  const { CityOption, isCityLoading } = useCitiesDDL();

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
              <CustomSelectField
                name="cityId"
                options={CityOption}
                labelRequired={false}
                isloading={isCityLoading}
                label="DDL-City-label"
                placeholder="DDL-City-label"
                touched={touched}
                errors={errors}
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
                          label="SIDEBAR-Area-NAME"
                          placeholder="SIDEBAR-Area-NAME"
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

export default UpdateArea;

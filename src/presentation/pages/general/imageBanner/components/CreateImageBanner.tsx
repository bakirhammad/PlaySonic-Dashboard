import { useRef } from "react";
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
import { ImageBannerUrlEnum } from "@domain/enums/URL/General/GeneralEnum/ImageBannerEnum";
import { ImageBannerCommandInstance } from "@app/useCases/general/imageBanner";
import { CustomUploadFile } from "@presentation/components/forms/CustomUploadFile";

export const CreateImageBanner = () => {
  const formikRef = useRef<FormikProps<FormikValues> | null>(null);
  const { setItemIdForUpdate } = useListView();
  const queryClient = useQueryClient();

  const initialValues = Object.assign({
    title: "",
    description: "",
    image: "",
    path: "",
  });

  const _ImageBannerSchema = Object.assign({
    // name: Yup.string().required("Field is Required"),
  });

  const ImageBannerSchema = Yup.object().shape(_ImageBannerSchema);

  const handleSubmit = async (
    values: FormikValues,
    setSubmitting: (isSubmitting: boolean) => void
  ) => {
    const formData = new FormData();
    formData.append("Title", values.title);
    formData.append("Description", values.description);
    formData.append("Image", values.image);
    formData.append("Path", values.path);

    try {
      const data = await ImageBannerCommandInstance.createImageBanner(
        ImageBannerUrlEnum.CreateImageBanner,
        formData
      );
      if (data) {
        CustomToast("Created successfully", "success", {
          autoClose: 3000,
        });
        setItemIdForUpdate(undefined);
        queryClient.invalidateQueries({
          queryKey: [QUERIES.ImageBannerList],
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
      validationSchema={ImageBannerSchema}
      onSubmit={(values, { setSubmitting }) => {
        handleSubmit(values, setSubmitting);
      }}
    >
      <ImageBannerForm />
    </Formik>
  );
};

const ImageBannerForm = () => {
  const {
    touched,
    errors,
    isSubmitting,
    isValid,
    values,
  }: FormikContextType<FormikValues> = useFormikContext();
  console.log({ values });
  const { setItemIdForUpdate } = useListView();

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
              <CustomInputField
                name="title"
                placeholder="Banner-Titel"
                label="Banner-Titel"
                as="input"
                isSubmitting={isSubmitting}
              />
              <CustomInputField
                name="description"
                placeholder="Banner-Description"
                label="Banner-Description"
                as="input"
                isSubmitting={isSubmitting}
              />
            </div>
            <div className="row row-cols-2">
              <CustomInputField
                name="path"
                placeholder="Banner-Path"
                label="Banner-Path"
                as="input"
                isSubmitting={isSubmitting}
              />
              <CustomUploadFile
                isSubmitting={isSubmitting}
                accept="image/*"
                name="image"
                label="Banner-Image"
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

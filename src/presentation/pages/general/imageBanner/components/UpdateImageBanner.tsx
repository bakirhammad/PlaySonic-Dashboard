import { FC, useMemo, useRef } from "react";
import {
  CustomButton,
  CustomInputField,
  CustomListLoading,
  CustomToast,
  showConfirmationAlert,
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
import { useMutation, useQueryClient } from "react-query";
import PleaseWaitTxt from "@presentation/helpers/loading/PleaseWaitTxt";
import { ImageBannerUrlEnum } from "@domain/enums/URL/General/GeneralEnum/ImageBannerEnum";
import { IImageBannerData } from "@domain/entities/general/ImageBanner/ImageBanner";
import { ImageBannerCommandInstance } from "@app/useCases/general/imageBanner";
import { CustomUploadFile } from "@presentation/components/forms/CustomUploadFile";
import { CustomImageReviewForUpdate } from "@presentation/components/forms/CustomImageReviewForUpdate";

interface IProps {
  ImageBannerData: IImageBannerData;
  isLoading: boolean;
}

export const UpdateImageBanner = ({ ImageBannerData, isLoading }: IProps) => {
  const formikRef = useRef<FormikProps<FormikValues> | null>(null);
  const { setItemIdForUpdate } = useListView();
  const queryClient = useQueryClient();

  const initialValues = useMemo(() => {
    return {
      id: ImageBannerData.id,
      title: ImageBannerData.title,
      description: ImageBannerData.description,
      image: ImageBannerData.image,
      path: ImageBannerData.path,
    };
  }, [ImageBannerData]);

  const _ImageBannerSchema = Object.assign({
    // name: Yup.string().required("Field is Required"),
  });

  const ImageBannerSchema = Yup.object().shape(_ImageBannerSchema);
  const handleSubmit = async (
    values: FormikValues,
    setSubmitting: (isSubmitting: boolean) => void
  ) => {
    const formData = new FormData();
    formData.append("Id", String(initialValues.id));
    formData.append("Title", values.title);
    formData.append("Description", values.description);
    formData.append("Image", values.image);
    formData.append("Path", values.path);
    try {
      const data = await ImageBannerCommandInstance.updateImageBanner(
        ImageBannerUrlEnum.UpdateImageBanner,
        formData
      );
      if (data) {
        CustomToast("Slot updated successfully", "success", {
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
          validationSchema={ImageBannerSchema}
          onSubmit={(values, { setSubmitting }) => {
            handleSubmit(values, setSubmitting);
          }}
        >
          <ImageBannerUpdateForm ImageBannerData={ImageBannerData} />
        </Formik>
      )}
    </>
  );
};
interface IProp {
  ImageBannerData: IImageBannerData;
}
const ImageBannerUpdateForm: FC<IProp> = ({ ImageBannerData }) => {
  const { setItemIdForUpdate } = useListView();

  const {
    errors,
    touched,
    isSubmitting,
    isValid,
    values,
  }: FormikContextType<FormikValues> = useFormikContext();
 // Wait to Delete Image Api to added >>
  // const { mutateAsync: deleteImage } = useMutation(
  //   async () => {
  //     const confirm = await showConfirmationAlert();
  //     if (confirm) {
  //       const data = await CourtCommandInstance.deleteCourtImage(
  //         CourtUrlEnum.DeleteCourtImage,
  //         CourtData?.id
  //       );
  //       return data;
  //     }
  //   },
  //   {
  //     onSuccess: async () => {
  //       queryClient.invalidateQueries({ queryKey: [QUERIES.CourtList] });
  //       setItemIdForUpdate(undefined)
  //       CustomToast(`Deleted successfully`, "success");
  //       showDeletedAlert();
  //       // setItemIdForUpdate(CourtData.id)
  //     },
  //     onError: (error) => {
  //       console.error("Error when deleting Country Image", error);
  //       CustomToast(`Failed to delete Country Image`, "error");
  //     },
  //   }
  // );

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
              <div>
                <CustomUploadFile
                  label="Banner-Image"
                  name="image"
                  touched={touched}
                  errors={errors}
                  labelRequired={true}
                  isSubmitting={isSubmitting}
                  accept={"image/*"}
                />
                {typeof values.image === "string" && ImageBannerData.image ? (
                  // Wait to Delete Image Api to added ,, the trash icon hidden
                  <CustomImageReviewForUpdate
                    inedx={1}
                    fileName={ImageBannerData.image}
                    imageUrl={ImageBannerData.image}
                    // onClickDelete={async () => {
                    //   await deleteImage();
                    // }}
                  />
                ) : (
                  <div></div>
                )}
              </div>
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

export default UpdateImageBanner;

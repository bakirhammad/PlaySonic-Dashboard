import { useRef } from "react";
import {
  CustomButton,
  CustomCheckbox,
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
import { SightSeeingSupplierCommandInstance } from "@app/index";
import { useMutation, useQueryClient } from "react-query";
import { QUERIES } from "@presentation/helpers";

import { SightSeeingSupplierUrlEnum } from "@domain/enums";

import validationSchemas from "@presentation/helpers/validationSchemas";
import { useSightSeeingTourDDL } from "@presentation/hooks";
import CustomSelectField from "@presentation/components/forms/CustomSelectField";
import { IDDlOption } from "@domain/entities";

export const CreateSightSeeingSupplierModalForm = () => {
  const formikRef = useRef<FormikProps<FormikValues> | null>(null);
  const { setItemIdForUpdate } = useListView();
  const queryClient = useQueryClient();

  const initialValues = Object.assign({
    SightSeeings: null,
    SupplierId: null,
    Status: false,
  });

  const _SightSeeingSupplierSchema = Object.assign({
    SightSeeings: validationSchemas.array,
    SupplierId: validationSchemas.object,
  });

  const SightSeeingSupplierSchema = Yup.object().shape(
    _SightSeeingSupplierSchema
  );

  const createSightSeeingSupplier = async (formData: FormData) => {
    return SightSeeingSupplierCommandInstance.createSightSeeingSupplier(
      SightSeeingSupplierUrlEnum.CreateSightSeeingSupplier,
      formData
    );
  };

  const mutation = useMutation(createSightSeeingSupplier, {
    onSuccess: (data) => {
      CustomToast("Sightseeing Supplier created successfully", "success", {
        autoClose: 3000,
      });
      setItemIdForUpdate(undefined);
      queryClient.invalidateQueries({
        queryKey: [QUERIES.SightSeeingSupplierList],
      });
    },
    onError: (error: any) => {
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
    values.SightSeeings?.map((SightSeeing: IDDlOption, index: number) => {
      formData.append(
        `SightSeeingSuppliers[${index}].tourId`,
        String(SightSeeing?.value)
      );
      formData.append(
        `SightSeeingSuppliers[${index}].supplierId`,
        String(values.SupplierId?.value)
      );
      formData.append(`SightSeeingSuppliers[${index}].status`, values.Status);
    });

    try {
      mutation.mutate(formData);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Formik
      innerRef={formikRef}
      initialValues={initialValues}
      validationSchema={SightSeeingSupplierSchema}
      onSubmit={(values, { setSubmitting }) => {
        handleSubmit(values, setSubmitting);
      }}
    >
      <SightSeeingSupplierForm />
    </Formik>
  );
};

const SightSeeingSupplierForm = () => {
  const {
    errors,
    touched,
    isSubmitting,
    isValid,
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

            <div className="col-md-6">
              <CustomSelectField
                name="SightSeeings"
                options={SightSeeingTourOptions}
                isloading={isSightSeeingTourListLoading}
                label="DDL-SIGHT-SEEING-TOUR"
                placeholder="SELECT-DDL-SIGHT-SEEING-TOUR"
                touched={touched}
                errors={errors}
                isSubmitting={isSubmitting}
                isMulti={true}
              />
            </div>
            <div className="col-md-6 d-flex align-items-center">
              <CustomCheckbox
                labelTxt="SIGHT-SEEING-SUPPLIER-STATUS-TABEL-LABEL"
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

import { useEffect, useRef } from "react";
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
  FormikContextType,
  FormikProps,
  FormikValues,
  useFormikContext,
} from "formik";
import * as Yup from "yup";
import { QUERIES } from "@presentation/helpers";
import { useMutation, useQueryClient } from "react-query";
import { IDDlOption, ISightSeeingSupplierData } from "@domain/entities";
import { SightSeeingSupplierCommandInstance } from "@app/index";
import PleaseWaitTxt from "@presentation/helpers/loading/PleaseWaitTxt";
import { SightSeeingSupplierUrlEnum } from "@domain/enums";

import { useSightSeeingTourDDL } from "@presentation/hooks";
import CustomSelectField from "@presentation/components/forms/CustomSelectField";
import validationSchemas from "@presentation/helpers/validationSchemas";

interface IProps {
  SightSeeingSupplierData: ISightSeeingSupplierData;
  isLoading: boolean;
  openUpdateSightSeeingSupplierModal: (id: number) => Promise<void>;
}

export const UpdateSightSeeingSupplierModalForm = ({
  SightSeeingSupplierData,
  isLoading,
}: IProps) => {
  const formikRef = useRef<FormikProps<FormikValues> | null>(null);
  const { setItemIdForUpdate } = useListView();
  const queryClient = useQueryClient();

  const initialValues = Object.assign({
    id: SightSeeingSupplierData.id,
    TourId: null,
    SupplierId: null,
    Status: SightSeeingSupplierData.status,
  });

  const _SightSeeingSupplierSchema = Object.assign({
    TourId: validationSchemas.object,
    SupplierId: validationSchemas.object,
  });

  const SightSeeingSupplierSchema = Yup.object().shape(
    _SightSeeingSupplierSchema
  );
  const updateSightSeeingSupplier = async (formData: FormData) => {
    return SightSeeingSupplierCommandInstance.updateSightSeeingSupplier(
      SightSeeingSupplierUrlEnum.UpdateSightSeeingSupplier,
      formData
    );
  };

  const UpdateSightSeeingSupplier = useMutation(updateSightSeeingSupplier, {
    onSuccess: (data) => {
      CustomToast("Sightseeing Supplier Updated successfully", "success", {
        autoClose: 3000,
      });
      setItemIdForUpdate(undefined);
      queryClient.invalidateQueries({
        queryKey: [QUERIES.SightSeeingSupplierList],
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
    formData.append("TourId", values.TourId.value);
    formData.append("SupplierId", values.SupplierId.value);
    formData.append("Status", values.Status);
    const mutation = UpdateSightSeeingSupplier;

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
          validationSchema={SightSeeingSupplierSchema}
          onSubmit={(values, { setSubmitting }) => {
            handleSubmit(values, setSubmitting);
          }}
        >
          <SightSeeingSupplierUpdateForm
            SightSeeingSupplierData={SightSeeingSupplierData}
          />
        </Formik>
      )}
    </>
  );
};

const SightSeeingSupplierUpdateForm = ({
  SightSeeingSupplierData,
}: {
  SightSeeingSupplierData: ISightSeeingSupplierData;
}) => {
  const { setItemIdForUpdate } = useListView();

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

export default UpdateSightSeeingSupplierModalForm;

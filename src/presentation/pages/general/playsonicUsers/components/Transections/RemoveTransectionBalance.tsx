import { useMemo, useRef } from "react";
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
import { useLanguageStore } from "@infrastructure/storage/LanguageStore";
import CustomSelectField from "@presentation/components/forms/CustomSelectField";
import { CommerceCommandInstance } from "@app/useCases/commerce";
import { CommerceUrlEnum } from "@domain/enums/URL/Commerce/CommerceUrls/Commerce";
interface IProps {
  userId: string;
}
export const RemoveTransectionBalance = ({ userId }: IProps) => {
  const formikRef = useRef<FormikProps<FormikValues> | null>(null);
  const { setItemIdForUpdate } = useListView();
  const queryClient = useQueryClient();

  const { Languages } = useLanguageStore();

  const initialValues = useMemo(() => {
    return {
      userId: userId,
      amount: null,
      transactionType: { value: 8, label: "Remove Balance" },
      description: null,
    };
  }, [userId]);

  const _RemoveBalanceSchema = Object.assign({
    amount: Yup.number().required("Field required"),
    description: Yup.string().required("Field required"),
  });

  const RemoveBalanceSchema = Yup.object().shape(_RemoveBalanceSchema);
  const handleSubmit = async (
    values: FormikValues,
    setSubmitting: (isSubmitting: boolean) => void
  ) => {
    const formData = new FormData();

    formData.append("UserId", values.userId);
    formData.append("Amount", values.amount);
    formData.append("TransactionType", values.transactionType.value);
    formData.append("Description", values.description);

    try {
      const data = await CommerceCommandInstance.removeUserBalance(
        CommerceUrlEnum.RemoveUserBalance,
        formData
      );
      if (data) {
        CustomToast("RemoveBalance updated successfully", "success", {
          autoClose: 3000,
        });
        setItemIdForUpdate(undefined);
        queryClient.invalidateQueries({
          queryKey: [QUERIES.UserTransectionsList],
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
        validationSchema={RemoveBalanceSchema}
        onSubmit={(values, { setSubmitting }) => {
          handleSubmit(values, setSubmitting);
        }}
      >
        <RemoveBalanceUpdateForm />
      </Formik>
    </>
  );
};

const RemoveBalanceUpdateForm = () => {
  const { setItemIdForUpdate } = useListView();

  const {
    errors,
    touched,
    isSubmitting,
    isValid,
  }: FormikContextType<FormikValues> = useFormikContext();

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
            <div className="row row-cols-2 1 row-cols-md-2">
              <CustomInputField
                name="amount"
                placeholder="Amount"
                label="Amount"
                as="input"
                touched={touched}
                errors={errors}
                type="number"
                isSubmitting={isSubmitting}
              />
              <CustomSelectField
                name="transactionType"
                label="Transection-Type"
                placeholder="Transection-Type"
                touched={touched}
                errors={errors}
                disabled={true}
                options={[]}
              />
            </div>
            <div>
              <CustomInputField
                name="description"
                placeholder="Note"
                label="Note"
                as="textarea"
                touched={touched}
                errors={errors}
                isSubmitting={isSubmitting}
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

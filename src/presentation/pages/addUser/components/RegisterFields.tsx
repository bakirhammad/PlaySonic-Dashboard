import { useRef } from "react";
import {
  CustomButton,
  CustomInputField,
  CustomListLoading,
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
import CustomSelectField from "@presentation/components/forms/CustomSelectField";
import { useClubsDDL } from "@presentation/hooks/queries/DDL/Club/useClubsDDL";
import { useRolesDDL } from "@presentation/hooks/queries/DDL/Roles/useRolesDDL";

export const RegisterFields = () => {
  const formikRef = useRef<FormikProps<FormikValues> | null>(null);
  const { setItemIdForUpdate } = useListView();
  const queryClient = useQueryClient();

  const initialValues = Object.assign({
    name: "",
    clubId: "",
    email: "",
    password: "",
    role: null,
  });

  const _RegisterSchema = Object.assign({
    firstname: Yup.string()
      .min(3, "Minimum 3 symbols")
      .max(50, "Maximum 50 symbols")
      .required("First name is required"),
    email: Yup.string()
      .email("Wrong email format")
      .min(3, "Minimum 3 symbols")
      .max(50, "Maximum 50 symbols")
      .required("Email is required"),
    lastname: Yup.string()
      .min(3, "Minimum 3 symbols")
      .max(50, "Maximum 50 symbols")
      .required("Last name is required"),
    password: Yup.string()
      .min(3, "Minimum 3 symbols")
      .max(50, "Maximum 50 symbols")
      .required("Password is required"),
    acceptTerms: Yup.bool().required(
      "You must accept the terms and conditions"
    ),
  });

  const RegisterSchema = Yup.object().shape(_RegisterSchema);

  const handleSubmit = async (
    values: FormikValues,
    setSubmitting: (isSubmitting: boolean) => void
  ) => {
    const formData = new FormData();
    formData.append("Name", values.name);
    formData.append("clubId", values.clubId);
    formData.append("Email", values.email);
    formData.append("Password", values.password);
    formData.append("Role", values.role);

    // try {
    //   const data = await RegisterCommandInstance.createRegister(
    //     RegisterUrlEnum.CreateRegister,
    //     formData
    //   );
    //   if (data) {
    //     CustomToast("Register is created successfully", "success", {
    //       autoClose: 3000,
    //     });
    //     setItemIdForUpdate(undefined);
    //     queryClient.invalidateQueries({
    //       queryKey: [QUERIES.RegisterList],
    //     });
    //   }
    // } catch (error) {
    //   if (error instanceof Error) {
    //     CustomToast(error.message, "error", { autoClose: 6000 });
    //     console.error("Error Create form:", error);
    //   }
    // } finally {
    //   setSubmitting(false);
    // }
  };

  return (
    <Formik
      innerRef={formikRef}
      initialValues={initialValues}
      validationSchema={RegisterSchema}
      onSubmit={(values, { setSubmitting }) => {
        handleSubmit(values, setSubmitting);
      }}
    >
      <RegisterForm />
    </Formik>
  );
};

const RegisterForm = () => {
  const {
    errors,
    touched,
    isSubmitting,
    isValid,
    values,
  }: FormikContextType<FormikValues> = useFormikContext();
  const { setItemIdForUpdate } = useListView();

  const { clubsOption, isClubLoading } = useClubsDDL();
  const { RolesOption, isRoleLoading } = useRolesDDL();
  return (
    <>
      <Form
        className="form container-fluid w-100 tw-p-7"
        placeholder={undefined}
        onPointerEnterCapture={undefined}
        onPointerLeaveCapture={undefined}
      >
        <div className="tw-text-center mb-8">
          <h3>Sign Up</h3>
        </div>
        <div className="row">
          <div className="row row-cols-2">
            <CustomInputField
              name="name"
              placeholder="User-Name"
              label="User-Name"
              as="input"
              type="text"
            />

            <CustomSelectField
              name={"clubId"}
              options={clubsOption}
              isloading={isClubLoading}
              placeholder="Select-Club"
              label="Club-Name"
            />
          </div>
          <div className="row row-cols-2">
            <CustomInputField
              name="email"
              placeholder="EMAIL"
              label="EMAIL"
              as="input"
              type="email"
            />
            <CustomInputField
              name="password"
              placeholder="Password"
              label="Password"
              as="input"
              touched={touched}
              errors={errors}
              type="password"
              isSubmitting={isSubmitting}
            />
          </div>
          <div className="row row-cols-2">
            <CustomSelectField
              name={"role"}
              options={RolesOption}
              isloading={isRoleLoading}
              placeholder="CHOOSE-Role"
              label="CHOOSE-Role"
            />
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

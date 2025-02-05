import { useRef } from "react";
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
import { useQueryClient } from "react-query";
import { QUERIES } from "@presentation/helpers";
import CustomSelectField from "@presentation/components/forms/CustomSelectField";
import { AddUsersCommandInstance } from "@app/useCases/general/addUsers";
import { AddUsersUrlEnum } from "@domain/enums/URL/General/GeneralEnum/AddUsers";
import { useClubsDDL } from "@presentation/hooks/queries/DDL/Club/useClubsDDL";
import { useRolesDDL } from "@presentation/hooks/queries/DDL/Roles/useRolesDDL";
import validationSchemas from "@presentation/helpers/validationSchemas";

export const CreateAdminUsers = () => {
  const formikRef = useRef<FormikProps<FormikValues> | null>(null);
  const { setItemIdForUpdate } = useListView();
  const queryClient = useQueryClient();

  const initialValues = Object.assign({
    userName: null,
    name: null,
    email: null,
    password: null,
    phoneNumber: null,
    roleId: null,
    clubId: null,
    isClub: false,
  });

  const _RolesSchema = Object.assign({
    name: Yup.string().required("Field is Required"),
    userName: Yup.string().required("Field is Required"),
    email: Yup.string().required("Field is Required"),
    phoneNumber: Yup.string().required("Field is Required"),
    password: Yup.string().required("Field is Required"),
    roleId: validationSchemas.object.required("Field is Required"),
  });

  const RolesSchema = Yup.object().shape(_RolesSchema);

  const handleSubmit = async (
    values: FormikValues,
    setSubmitting: (isSubmitting: boolean) => void
  ) => {
    const formData = new FormData();
    formData.append("Name", values.name);
    formData.append("UserName", values.userName);
    formData.append("Email", values.email);
    formData.append("Password", values.password);
    formData.append("PhoneNumber", values.phoneNumber);
    formData.append("RoleId", values.roleId.value);
    values.clubId && formData.append("ClubId", values.clubId.value);

    try {
      const data = await AddUsersCommandInstance.createAddUsers(
        AddUsersUrlEnum.CreateUser,
        formData
      );
      if (data) {
        CustomToast("Created successfully", "success", {
          autoClose: 3000,
        });
        setItemIdForUpdate(undefined);
        queryClient.invalidateQueries({
          queryKey: [QUERIES.AdminUsersList],
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
      validationSchema={RolesSchema}
      onSubmit={(values, { setSubmitting }) => {
        handleSubmit(values, setSubmitting);
      }}
    >
      <RolesForm />
    </Formik>
  );
};

const RolesForm = () => {
  const {
    errors,
    touched,
    isSubmitting,
    isValid,
    values,
    setFieldValue,
  }: FormikContextType<FormikValues> = useFormikContext();
  console.log({ values });
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
        <div className="tw-text-center mb-8"></div>
        <div className="row">
          <div className="row row-cols-2">
            <CustomInputField
              name="name"
              placeholder="Name"
              label="Name"
              as="input"
              type="text"
            />
            <CustomInputField
              name="userName"
              placeholder="User-Name"
              label="User-Name"
              as="input"
              type="text"
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
            <CustomInputField
              name="phoneNumber"
              placeholder="Phone-Number"
              label="Phone-Number"
              as="input"
              touched={touched}
              errors={errors}
              isSubmitting={isSubmitting}
            />
            <CustomSelectField
              name={"roleId"}
              options={RolesOption}
              isloading={isRoleLoading}
              placeholder="CHOOSE-Role"
              label="CHOOSE-Role"
            />
          </div>
          <div className="row row-cols-2">
            <CustomCheckbox
              labelTxt="Is-Club"
              labelRequired={false}
              name="isClub"
              touched={touched}
              errors={errors}
            />

            {values.isClub && (
              <CustomSelectField
                name={"clubId"}
                options={clubsOption}
                isloading={isClubLoading}
                placeholder="Select-Club"
                label="Club-Name"
              />
            )}
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
